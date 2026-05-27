# auto_trader/strategy.py
import pandas as pd
from datetime import timezone

class EMARSI:
    """
    EMA-RSI 하이브리드 전략 클래스.
    - EMA 크로스(Fast > Slow) + RSI >= 50 이면 롱 진입
    - EMA 크로스( Fast < Slow) + RSI <= 50 이면 숏 진입
    - RSI 과매수(>70) 혹은 과매도(<30)에서 청산 알림
    """

    def __init__(self, fast_period: int = 9, slow_period: int = 21,
                 rsi_period: int = 14):
        self.fast_period = fast_period
        self.slow_period = slow_period
        self.rsi_period = rsi_period

    # --------------------------------------------------------------
    # 지표 계산 (DataFrame에 NaN 보간 전 호출)
    # --------------------------------------------------------------
    def compute_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        EMA와 RSI를 추가하고 'signal' 컬럼을 만든다.
        signal:  1 = 롱, -1 = 숏, 0 = 홀드
        """
        df = df.copy()

        # EMA
        df["ema_fast"] = df["close"].ewm(span=self.fast_period, adjust=False).mean()
        df["ema_slow"] = df["close"].ewm(span=self.slow_period, adjust=False).mean()

        # RSI
        delta = df["close"].diff()
        up = delta.where(delta > 0, 0)
        down = delta.where(delta < 0, 0)

        roll_up = up.ewm(alpha=1 / self.rsi_period, adjust=False).mean()
        roll_down = down.ewm(alpha=1 / self.rsi_period, adjust=False).mean()

        rs = roll_up / roll_down
        df["rsi"] = 100 - (100 / (1 + rs))

        # 시그널 생성
        df["signal"] = 0
        # EMA 크로스 업
        df.loc[(df["ema_fast"] > df["ema_slow"]) & (df["rsi"] >= 50), "signal"] = 1   # 롱
        # EMA 크로스 다운
        df.loc[(df["ema_fast"] < df["ema_slow"]) & (df["rsi"] <= 50), "signal"] = -1  # 숏

        return df

    # --------------------------------------------------------------
    # 현재 시그널 결정 (마지막 행 기준)
    # --------------------------------------------------------------
    def decide_trade(self, df: pd.DataFrame) -> dict:
        """
        최신 데이터를 기반으로 trade 결정을 반환.
        {
            "action": "buy" | "sell" | "hold",
            "signal": 1 | -1 | 0,
            "reason": str
        }
        """
        if df.empty:
            return {"action": "hold", "signal": 0, "reason": "no data"}

        latest = df.iloc[-1]
        prev = df.iloc[-2] if len(df) > 1 else None

        # EMA 크로스 확인
        ema_cross_up = (prev["ema_fast"] <= prev["ema_slow"]) and (latest["ema_fast"] > latest["ema_slow"])
        ema_cross_down = (prev["ema_fast"] >= prev["ema_slow"]) and (latest["ema_fast"] < latest["ema_slow"])

        # RSI 조건
        rsi_ok_long = latest["rsi"] >= 50
        rsi_ok_short = latest["rsi"] <= 50

        # 청산 조건 (과매수/과매도)
        if latest["rsi"] > 70:
            return {"action": "sell", "signal": -1, "reason": "RSI overbought"}
        if latest["rsi"] < 30:
            return {"action": "buy", "signal": 1, "reason": "RSI oversold"}

        # 진입 판단
        if ema_cross_up and rsi_ok_long:
            return {"action": "buy", "signal": 1, "reason": "EMA bullish crossover + RSI OK"}
        if ema_cross_down and rsi_ok_short:
            return {"action": "sell", "signal": -1, "reason": "EMA bearish crossover + RSI OK"}

        return {"action": "hold", "signal": 0, "reason": "no clear signal"}