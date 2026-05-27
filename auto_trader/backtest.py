# auto_trader/backtest.py
import pandas as pd
from datetime import timedelta

class Backtester:
    """
    간단한 백테스팅 엔진.
    - 일일 손실 한도(3%)를 초과하면 자동 중단.
    - 포지션당 리스크(1%)를 적용해 포지션 사이즈 계산.
    """

    def __init__(self, config):
        self.equity = config.get("initial_equity", 10000.0)   # 시작 капитал
        self.daily_loss_limit_pct = config["daily_loss_limit"]
        self.risk_percent = config["risk_percent"]
        self.stop_loss_atr_mult = config.get("stop_loss_atr_mult", 1.5)
        self.trades = []      # 리스트에 (timestamp, action, size, pnl) 저장

    def run(self, df: pd.DataFrame):
        """
        df must contain columns: ['open','high','low','close','volume'] and a datetime index.
        """
        df = df.copy()
        df["ema_fast"] = df["close"].ewm(span=self.config["fast_period"], adjust=False).mean()
        df["ema_slow"] = df["close"].ewm(span=self.config["slow_period"], adjust=False).mean()

        position = 0   # 1=롱, -1=숏, 0=flat
        entry_price = 0.0
        entry_time = None

        for i, row in df.iterrows():
            # 지표 계산 (EMA, RSI) – 여기서는 EMA만 사용
            if position != 0:
                # 간단하게 EMA 크로스에서_exit
                if (position == 1 and row["ema_fast"] < row["ema_slow"]) or \
                   (position == -1 and row["ema_fast"] > row["ema_slow"]):
                    pnl = (row["close"] - entry_price) * position if position == 1 else (entry_price - row["close"]) * position
                    self.trades.append((i, "close", position, pnl))
                    self.equity += pnl
                    position = 0
                    entry_price = 0.0

            # 신규 진입
            signal = 1 if (row["ema_fast"] > row["ema_slow"]) else -1 if (row["ema_fast"] < row["ema_slow"]) else 0
            if signal != 0:
                # 손실 허용 거리 (ATR 대신 EMA 차이로 간단히 계산)
                atr = abs(row["ema_fast"] - row["ema_slow"])
                stop_loss_dist = atr * self.stop_loss_atr_mult
                risk_amount = self.equity * self.risk_percent
                qty = self.config["broker"].calculate_position_size(self.equity, self.risk_percent, stop_loss_dist)

                # 실제 주문 시뮬레이션 (가격은 현재 종가)
                entry_price = row["close"]
                position = signal
                entry_time = i
                self.trades.append((i, "open", qty, 0.0))   # pnl은 나중에 계산

        # 일일 손실 한도 체크
        daily_loss = 0.0
        for t, _, _, pnl in self.trades:
            daily_loss += pnl
            if abs(daily_loss) > self.equity * self.daily_loss_limit_pct:
                print(f"[BACKTEST] 일일 손실 한도 초과 ({daily_loss:.2f}%): 테스트 중단")
                break

        return self.trades, self.equity