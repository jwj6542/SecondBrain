from typing import Tuple
# 로컬 모듈로 임포트 (실제 환경에서는 패키지 구조를 가정)
# from src.tests.mock_payment_gateway import MockPaymentGateway 

class CrisisToSaleFlow:
    """
    위기 감지(Crisis Detection)부터 판매 유도 및 트랜잭션 처리까지의 E2E 플로우 관리자.
    T+5:30 지점을 핵심 트리거로 사용한다.
    """
    def __init__(self, gateway: MockPaymentGateway):
        self.gateway = gateway
        self.STATE_UNKNOWN = "UNKNOWN"
        self.STATE_CRISIS = "CRISIS_DETECTED"
        self.STATE_SALES_NEEDED = "SOLUTION_REQUIRED"

    def run_flow(self, user_id: str, initial_data: dict) -> Tuple[str, dict]:
        """
        전체 플로우를 실행하고 최종 상태와 결과를 반환한다.
        """
        current_state = self.STATE_UNKNOWN
        print("="*60)
        print(f"🚀 E2E Flow Start | User: {user_id} | Initial Data: {initial_data}")
        print("="*60)

        # 1. 초기 상태 및 위기 임계치 확인 (T+5:30 시점 가정)
        if initial_data.get('time_elapsed', 0) < 300: # 5분 미만이면 크라이시스 아님
            return "SUCCESS", {"state": self.STATE_UNKNOWN, "message": "Crisis not yet reached."}

        # T+5:30 지점 도달 -> 위기 감지 (State Transition)
        print("\n[🚨 ALERT] --- Critical Threshold Reached (T+5:30)! ---")
        current_state = self.STATE_CRISIS
        result = {"state": current_state, "message": "시스템적 위험 임계치 초과. 즉각적인 관리가 필요합니다."}

        # 2. 판매 유도 단계 진입 (Solution Required)
        if initial_data.get('is_systemic_failure', False):
            print("[💡 Funnel Trigger] 보고서 구매 필요성 강제 노출.")
            current_state = self.STATE_SALES_NEEDED
            result['solution_required'] = True

        # 3. 결제 트랜잭션 시뮬레이션 및 처리
        if result.get('solution_required'):
            print("\n[💰 Transaction Stage] 사용자에게 해결책 제공을 위한 구매 유도.")
            payment_amount = 97.00 # 보고서 가격 가정

            try:
                # A. 성공 시나리오 테스트 (정상 결제)
                token_success = "VALID_TOKEN"
                print("\n--- [TEST CASE 1: SUCCESSFUL TRANSACTION] ---")
                transaction_result = self.gateway.process_payment(user_id, payment_amount, token_success)
                if transaction_result['status'] == 'SUCCESS':
                    final_message = f"✅ 완벽한 판매 플로우 완료! 트랜잭션 ID: {transaction_result['transaction_id']}"
                    return "COMPLETE", {"state": self.STATE_SALES_NEEDED, "payment_success": True, "details": final_message}

            except ConnectionError as e:
                # B. 네트워크 오류/타임아웃 실패 시나리오 (Recovery Test)
                print("\n--- [TEST CASE 2: NETWORK FAILURE] ---")
                error_log = self.gateway.log_failure(e)
                final_message = f"❌ 결제 시스템 연결 오류 발생 ({error_log['details']}). 사용자에게 대체 방법을 제시해야 함."
                return "RECOVERY_NEEDED", {"state": self.STATE_SALES_NEEDED, "payment_success": False, "error_log": error_log, "recovery_message": final_message}

            except Exception as e:
                 # C. 기타 예상치 못한 실패 (Invalid Token/Logic Error)
                print("\n--- [TEST CASE 3: SYSTEM FAILURE] ---")
                token_failure = "INVALID" + str(hash(user_id)) # 고의로 유효하지 않은 토큰 생성
                transaction_result = self.gateway.process_payment(user_id, payment_amount, token_failure)
                if transaction_result['status'] == 'FAILED':
                    final_message = f"⚠️ 결제 실패 (이유: {transaction_result['message']}). 사용자에게 힌트를 제공해야 함."
                    return "FAILURE", {"state": self.STATE_SALES_NEEDED, "payment_success": False, "failure_reason": transaction_result['message'], "recovery_message": final_message}

        # 만약 위기 상황이지만 판매 유도로 이어지지 않은 경우 (Edge Case)
        return "WARNING", {"state": self.STATE_CRISIS, "message": "위기는 감지되었으나, 구매 플로우 트리거가 작동하지 않았습니다."}