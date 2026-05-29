import time
import random

# --- 시스템 상태 정의 상수 ---
STATUS_SUCCESS = "SUCCESS"
STATUS_FAULT = "FAULT"
STATUS_RECOVERY = "RECOVERY"
STATUS_FAILURE = "CRITICAL_FAILURE"

class PaymentFlowSimulator:
    """
    시스템 복원력(System Resilience)과 결제 플로우를 통합 시뮬레이션하는 모의 API 클래스.
    강제 오류 주입 포인트를 포함하여, 기술적 실패가 사용자 경험에 미치는 영향을 테스트합니다.
    """
    def __init__(self):
        self.is_faulty = False
        self.system_status = STATUS_SUCCESS
        print("✅ PaymentFlowSimulator Initialized: System nominal.")

    def set_fault(self, fault_level: bool):
        """시스템에 강제 오류를 주입합니다."""
        self.is_faulty = fault_level
        if fault_level:
            self.system_status = STATUS_FAULT
            print("\n🚨 [SYSTEM ALERT] --- WARNING! CRITICAL FAULT INJECTED. Observability Panel 활성화 필요! ---")
        else:
            self.system_status = STATUS_SUCCESS
            print("\n✅ [SYSTEM RECOVERY] System stable. Monitoring normal.")

    def attempt_purchase(self, user_id: str, amount: float) -> dict:
        """사용자가 결제를 시도하는 핵심 엔드포인트 (E2E 테스트 대상)."""
        start_time = time.time()
        print(f"\n--- [{user_id}] Purchase Attempt for ${amount:.2f} initiated at {time.strftime('%H:%M:%S')} ---")

        # 1. Fault Injection 체크: 시스템이 정상 작동하는지 검사
        if self.is_faulty and random.random() < 0.7: # 70% 확률로 실패 유도
            print(f"   [Backend Mock] -> API Call failed due to system instability (Fault Code: E429).")
            return {
                "status": STATUS_FAULT,
                "success": False,
                "message": "Payment Gateway Unavailable. Please check the Observability Panel.",
                "latency_ms": int((time.time() - start_time) * 1000),
                "error_code": "E429_SERVICE_UNAVAILABLE",
            }

        # 2. 성공 경로 (Success Path Simulation)
        if self.is_faulty:
             # 오류 상태이지만, 사용자에게는 '잠시 기다리라'고 안내하는 복구 시나리오를 가정
             time.sleep(1) 
             self.system_status = STATUS_RECOVERY # 시간이 지나면 자동 복구된다고 가정
             print("   [Backend Mock] -> System stabilizing...")

        # 실제 성공 로직 (가상의 외부 API 호출 모방)
        if amount > 0:
            time.sleep(random.uniform(0.5, 1.5)) # 지연 시간 추가
            return {
                "status": STATUS_SUCCESS,
                "success": True,
                "message": "Payment processed successfully. Welcome aboard!",
                "transaction_id": f"TXN-{int(time.time())}-{random.randint(100, 999)}",
                "latency_ms": int((time.time() - start_time) * 1000),
            }

        # 3. 기타 오류 (Critical Failure Simulation)
        return {
            "status": STATUS_FAILURE,
            "success": False,
            "message": "Internal Server Error or Invalid Parameters.",
            "latency_ms": int((time.time() - start_time) * 1000),
            "error_code": "E500_INTERNAL_ERROR",
        }

# --- 시뮬레이션 실행 예시 (테스트 코드) ---
if __name__ == "__main__":
    simulator = PaymentFlowSimulator()
    user = "TestUser123"
    purchase_amount = 97.00

    print("\n================== [SCENARIO 1: 정상 작동 시도] ==================")
    # 1. 시스템이 깨끗한 상태에서 구매 시도 (정상 경로)
    result_ok = simulator.attempt_purchase(user, purchase_amount)
    print("결과:", result_ok)

    time.sleep(2)
    simulator.set_fault(True) # 2. 시스템에 오류 주입
    
    print("\n================== [SCENARIO 2: 강제 오류 발생 시도] ==================")
    # 3. 오류가 있는 상태에서 구매 시도 (실패/복구 경로)
    result_faulty = simulator.attempt_purchase(user, purchase_amount)
    print("결과:", result_faulty)

    time.sleep(2)
    simulator.set_fault(False) # 4. 시스템 복구 완료
    
    print("\n================== [SCENARIO 3: 복구 후 재시도] ==================")
    # 5. 오류가 해결된 상태에서 구매 시도 (성공 경로로 회복)
    result_recover = simulator.attempt_purchase(user, purchase_amount)
    print("결과:", result_recover)