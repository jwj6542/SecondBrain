class TradingEngine:
    """전략 실행 및 초기 신호 생성 (EMA-RSI)."""
    def __init__(self, strategy_params: dict):
        self.strategy_params = strategy_params

    def run_signal(self, current_data: dict) -> list[dict] | None:
        """현재 시점의 데이터로 EMA-RSI를 계산하고 트레이딩 신호를 생성한다."""
        # 1. 지표 계산 (EMA, RSI 등)
        ema = self._calculate_ema(current_data['close'])
        rsi = self._calculate_rsi(current_data['close'])

        # 2. 로직 평가: 진입/청산 조건 확인 (예: EMA 교차 & RSI 과매수/과매도)
        signal = None
        if ema > rsi and current_data['close'] > self.params['support']: # 매수 예시
            signal = {"action": "BUY", "confidence": 0.8, "risk_level": "LOW"}
        # ... (숏 포지션 및 청산 로직 추가)

        return [signal] if signal else None

    def _calculate_ema(self, price):
        """EMA 계산을 위한 내부 유틸리티."""
        pass

    def _calculate_rsi(self, price):
        """RSI 계산을 위한 내부 유틸리티."""
        pass