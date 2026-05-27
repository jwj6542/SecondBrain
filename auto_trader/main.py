# auto_trader/main.py
import pandas as pd
from datetime import timedelta
import numpy as np

from .config import EMA_FAST_PERIOD, EMA_SLOW_PERIOD, RSI_PERIOD, RISK_PERCENT, DAILY_LOSS_LIMIT
from .utils import utc_now, interpolate_missing
from .broker import BrokerAPI
from .strategy import EMARSI

# --------------------------------------------------------------
# 가상 데이터 로드 (실제로는 API 호출로 교체)
# --------------------------------------------------------------
def fetch_live_data(symbol: str) -> pd.DataFrame:
    """
    실제 구현 시에는 REST API 로부터 최신 OHLCV 데이터를 가져온다.
    여기서는 CSV 파일을 읽는 형태로Placeholder 처리한다.
    """
    # 예시: 현재 시각을 기준으로 1시간 전까지만 데이터가 있다고 가정
    now = utc_now()
    # CSV 파일 경로 (실제 프로젝트에서는 동적 다운 로드)
    path = "sample_data.csv"
    df = pd.read_csv(path, parse_dates=["timestamp"])
    df.set_index("timestamp", inplace=True)
    df.index = df.index.tz_localize(None).tz_convert('UTC')
    # 결측치 보간
    df = interpolate_missing(df)
    return df

# --------------------------------------------------------------
# 메인 로직
# --------------------------------------------------------------
def main():
    symbol = "BTCUSDT"   # 예시 심볼, 필요에 따라 교체

    # 1) 브로커 연결 (실제 API 키/URL은 config 혹은 env 변수에서 관리)
    broker = BrokerAPI()

    # 2) 계좌 잔고 확인
    equity = broker.get_account_balance()
    print(f"[INFO] 현재 계좌 평가: {equity:.2f} USD")

    # 3) 전략 인스턴스 생성
    strategy = EMARSI(
        fast_period=EMA_FAST_PERIOD,
        slow_period=EMA_SLOW_PERIOD,
        rsi_period=RSI_PERIOD
    )

    # 4) 실시간 데이터 획득 (1분 간격 가정)
    df = fetch_live_data(symbol)

    # 5) 지표 계산 및 시그널 결정
    df = strategy.compute_indicators(df)
    signal_info = strategy.decide_trade(df.iloc[-1])   # 최신 행 기준

    print(f"[STRATEGY] {signal_info['action']} - {signal_info['reason']}")

    if signal_info["action"] != "hold":
        # 포지션 사이즈 계산 (리스크 1% 적용)
        # 여기서는 간단히 최근 EMA 차이를 volatility proxy 로 사용
        atr = abs(df.iloc[-1]["ema_fast"] - df.iloc[-1]["ema_slow"])
        stop_loss_dist = atr * 1.5   # ATR 대신 EMA 차이 * 1.5 로 가정

        position_size = broker.calculate_position_size(equity, RISK_PERCENT, stop_loss_dist)

        side = "buy" if signal_info["signal"] == 1 else "sell"

        success = broker.place_order(symbol=symbol, qty=position_size, side=side)
        if success:
            print(f"[TRADE] {side.upper()} {position_size:.6f} {symbol} (리스크 {RISK_PERCENT*100:.2f}%)")
        else:
            print("[ERROR] 주문 전송 실패")

    # 6) 일일 손실 한도 모니터링 (간단히 전체 손익 계산)
    total_pnl = sum(t[3] for t in strategy.trades) if hasattr(strategy, "trades") else 0.0
    daily_loss_pct = abs(total_pnl) / equity * 100
    print(f"[DAILY P&L] 총 손익: {total_pnl:.2f} USD ({daily_loss_pct:.2f}% of equity)")
    if daily_loss_pct > DAILY_LOSS_LIMIT * 100:
        print("[ALERT] 일일 손실 한도(3%) 초과! 자동 매매 중단")
        # 실제 운영에서는 브로커에 트레이딩 정지 요청을 보낼 수 있다.

if __name__ == "__main__":
    main()