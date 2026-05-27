import asyncio

class StateManagerAPI:
    """시스템의 상태를 관리하고 모든 모듈에 최종 결과를 브로드캐스팅하는 게이트웨이."""
    def __init__(self):
        # 시스템 전역 상태 저장소 (Single Source of Truth)
        self.global_state = {
            "current_positions": {}, # {"XAUUSD": {"entry_price": 1900, "qty": 1, "status": "OPEN"}}
            "daily_pnl": 0.0,         # 일일 수익률
            "drawdown_history": [],   # 누적 손실 추이 (KPI)
            "risk_violations": []     # 발생한 리스크 위반 기록
        }
        self._subscribers = set() # WebSocket 연결된 클라이언트 목록

    def register(self, websocket_conn):
        """클라이언트가 접속하면 구독자로 등록한다."""
        self._subscribers.add(websocket_conn)

    async def process_signal_and_update(self, signal: dict, current_data: dict) -> bool:
        """
        트레이딩 신호를 받아 RiskManager를 거쳐 최종 상태 업데이트를 시도한다. (핵심 통합 로직)
        """
        # 1. 리스크 검증 요청 (가장 먼저 실행되어야 함)
        is_allowed = await self._check_risk(signal, current_data)

        if not is_allowed:
            print("🚨 [ALERT] Risk Manager Blocked Signal.")
            self.global_state["risk_violations"].append({"time": current_data['timestamp'], "message": "Risk Limit Exceeded"})
            return False # 거래 금지

        # 2. 상태 업데이트 및 트랜잭션 실행 (성공 시)
        if signal and signal['action'] in ["BUY", "SELL"]:
             self._execute_transaction(signal, current_data)
             self.global_state["daily_pnl"] += self._calculate_profit(signal)

        # 3. 모든 구독자에게 상태 변경을 전파 (실시간 대시보드 업데이트 트리거)
        await self._broadcast_update()
        return True

    async def _check_risk(self, signal: dict, data: dict):
        """가상의 리스크 관리 서비스 호출 지점."""
        # 실제로는 외부 RiskManagerService와 통신 (비동기 대기)
        print("Checking risk limits (1% per position, 3% daily)...")
        await asyncio.sleep(0.01) # 비동기 대기 시뮬레이션
        return True # 임시로 통과 처리

    async def _broadcast_update(self):
        """WebSocket을 통해 모든 연결된 클라이언트에 최신 상태를 전송한다."""
        # 실제 구현에서는 asyncio.gather(*[ws.send(json.dumps(self.global_state)) for ws in self._subscribers])
        print("\n✅ [STATE UPDATE] Global State Broadcasted: PnL={:.2f}, Positions={}".format(self.global_state["daily_pnl"], len(self.global_state["current_positions"])))

    def _execute_transaction(self, signal, data):
        """실제 포지션 및 거래 기록을 업데이트한다."""
        # 로직 구현: Buy/Sell 시점에 따라 current_positions 딕셔너리 수정
        pass

    def _calculate_profit(self, signal):
        """수익률 계산 (KPI의 근간)."""
        return 0.1 # 예시 값