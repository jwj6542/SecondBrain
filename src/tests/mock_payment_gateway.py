class MockPaymentGateway:
    """
    실제 결제 게이트웨이의 복잡한 응답을 시뮬레이션하는 모의 객체.
    성공, 실패(Insufficient Funds), 타임아웃 등을 강제 주입할 수 있다.
    """
    def __init__(self):
        print("⚙️ MockPaymentGateway 초기화 완료: 결제 트랜잭션을 기다리는 중...")

    def process_payment(self, user_id: str, amount: float, token: str) -> dict:
        """
        지정된 조건에 따라 가상의 결제를 시도한다.
        :param user_id: 사용자 ID
        :param amount: 결제 금액 ($97 가정)
        :param token: 결제 토큰 (유효성 검사용)
        :return: 트랜잭션 결과 딕셔너리
        """
        print(f"\n[💳 Payment Attempt] User {user_id}가 ${amount:.2f} 지출을 시도합니다.")

        # 테스트 실패 케이스 주입 (예: 토큰 무효화)
        if "INVALID" in token:
            return {"status": "FAILED", "code": 401, "message": "Invalid payment token provided."}
        
        # 테스트 타임아웃/네트워크 오류 시뮬레이션
        if amount > 500.0 and token == "TIMEOUT_SIM": # 특정 조건에서만 실패 유도
             raise ConnectionError("Gateway connection timed out or service unavailable.")

        # 성공 케이스 (Default)
        print("[✅ SUCCESS] 결제 트랜잭션 성공적으로 처리되었습니다.")
        return {"status": "SUCCESS", "code": 200, "transaction_id": f"TX-{hash(user_id)}-{amount:.2f}", "message": "Payment confirmed."}

    def log_failure(self, error: Exception) -> dict:
        """예외 발생 시 실패 로그를 기록한다."""
        return {"status": "ERROR", "code": 500, "error_type": type(error).__name__, "details": str(error)}