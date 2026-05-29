from src.tests.mock_payment_gateway import MockPaymentGateway
from src.tests.crisis_to_salesfunnel import CrisisToSaleFlow
import time

def run_simulation(user_id: str, initial_data: dict):
    """통합 테스트 시뮬레이션 실행 함수"""
    print("\n" + "="*80)
    print("✨ 통합 E2E 판매 플로우 시뮬레이션 시작 ✨")
    time.sleep(1)
    
    gateway = MockPaymentGateway()
    flow_manager = CrisisToSaleFlow(gateway)
    
    status, result = flow_manager.run_flow(user_id, initial_data)
    
    print("\n" + "="*80)
    print("📊 시뮬레이션 결과 요약:")
    print(f"  -> 최종 상태: {status}")
    if status == "COMPLETE":
        print(f"  -> [SUCCESS] 결제 플로우가 완벽하게 작동했습니다. ({result['details']})")
    elif status == "RECOVERY_NEEDED":
        print(f"  -> [WARNING] 시스템 오류 발생. 로그 기록: {result['error_log']['details']}")
        print("  -> [ACTION] 개발자가 이 로그를 기반으로 복구 로직을 추가해야 합니다.")
    else:
        print(f"  -> [INFO] 상태 전이 완료. 다음 단계가 필요합니다.")
    print("="*80)

if __name__ == "__main__":
    # 1. 정상 성공 케이스 (Happy Path)
    success_data = {'time_elapsed': 360, 'is_systemic_failure': True} # 6분 경과 가정
    run_simulation("User_A", success_data)

    print("\n\n" + "#"*80)
    # 2. 네트워크 오류 발생 케이스 (Recovery Test - ConnectionError 주입)
    fail_network_data = {'time_elapsed': 360, 'is_systemic_failure': True}
    run_simulation("User_B", fail_network_data)

    print("\n\n" + "#"*80)
    # 3. 유효하지 않은 토큰 실패 케이스 (System Failure Test - Invalid Token 주입)
    fail_token_data = {'time_elapsed': 360, 'is_systemic_failure': True}
    run_simulation("User_C", fail_token_data)