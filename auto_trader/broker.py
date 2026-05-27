# auto_trader/broker.py
import requests
import json
from datetime import datetime, timezone

class BrokerAPI:
    """
    가상 브로커 API 래퍼.
    실제 거래소(예: Binance, Bybit 등)와 연동될 때는
    여기서 HTTP 요청만 교체하면 된다.
    """

    def __init__(self, base_url: str = "https://api.example.com"):
        self.base_url = base_url
        self.session = requests.Session()

    # ------------------------------------------------------------------
    # 계좌 조회
    # ------------------------------------------------------------------
    def get_account_balance(self) -> float:
        """
        계좌 평가를 반환 (USD 기준).
        실제 구현에서는 API 인증과 JSON 파싱을 수행한다.
        """
        resp = self.session.get(f"{self.base_url}/account")
        data = resp.json()
        return float(data["balance"])

    # ------------------------------------------------------------------
    # 포지션 조회
    # ------------------------------------------------------------------
    def get_position(self, symbol: str) -> dict:
        """
        특정 심볼에 대한 포지션 정보를 반환.
        예시 구조: {"symbol": "BTCUSDT", "size": 0.015, "side": "long"}
        """
        resp = self.session.get(f"{self.base_url}/position", params={"symbol": symbol})
        data = resp.json()
        return data

    # ------------------------------------------------------------------
    # 주문 전송
    # ------------------------------------------------------------------
    def place_order(self, symbol: str, qty: float, side: str) -> bool:
        """
        매수/매도 주문을 전송한다.
        성공 시 True, 실패 시 False 반환.
        """
        payload = {
            "symbol": symbol,
            "quantity": qty,
            "side": side,
            "type": "market",   # 시장가 order (예시)
            "time_in_force": "GTC"
        }
        resp = self.session.post(f"{self.base_url}/order", json=payload)
        result = resp.json()
        return result.get("status") == "success"

    # ------------------------------------------------------------------
    # 헬퍼: 포지션당 리스크 금액 계산
    # ------------------------------------------------------------------
    def calculate_position_size(self, equity: float, risk_percent: float, stop_loss_distance: float) -> float:
        """
        위험 금액 = equity * risk_percent
        포지션 사이즈 = 위험 금액 / stop_loss_distance
        """
        risk_amount = equity * risk_percent
        return safe_division(risk_amount, stop_loss_distance)