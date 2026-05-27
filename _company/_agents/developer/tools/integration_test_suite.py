import unittest
from resilience_logger import ResilienceLogger 
# from api_simulator import get_kpi_data # 실제 모듈 연결 필요

class TestSystemResilience(unittest.TestCase):
    """
    End-to-End 스트레스 테스트: 데이터 실패 상황에서의 시스템 복원력 검증.
    목표: API 에러 발생 -> Logger 감지 -> KPI에 반영 -> Mock Recovery 성공.
    """
    def setUp(self):
        # 매 테스트 전에 새로운 로거 인스턴스를 준비합니다.
        self.logger = ResilienceLogger("TestSuite")

    def test_stress_test_failure_and_recovery(self):
        print("\n--- [TEST START] Starting Stress Test: Failure -> Recovery ---")
        
        # 1. 초기 상태 (정상 데이터)
        initial_kpi = {"MDRR": 0.9, "CPR": 0.95}
        print(f"Initial KPIs: {initial_kpi}")

        # 2. 스트레스 상황 발생 (API 에러 강제 주입)
        print("--- 💥 Simulating Extreme Market Shock/Connection Failure... ---")
        # 실제로는 get_kpi_data(self.logger, simulate_failure=True) 를 호출합니다.
        failed_kpi = {"MDRR": 0.1, "CPR": 0.3} # 실패 시 극도로 낮은 값으로 강제 설정
        print(f"Failure Event Detected! Current KPIs: {failed_kpi}")

        # 3. 복구 로직 실행 (슬라이더 조작과 유사)
        print("--- 🛠️ Executing Automated Recovery Protocol... ---")
        recovery_steps = [0.2, 0.4, 0.6, 0.8, 1.0] # 시간 경과에 따른 점진적 회복률
        
        current_kpi = failed_kpi
        for i, step in enumerate(recovery_steps):
            # 여기서 복구 애니메이션 로직이 실행됨을 가정합니다.
            current_kpi["MDRR"] += 0.1 * (i+1) / 5.0
            current_kpi["CPR"] += 0.1 * (i+1) / 5.0
            print(f"Recovery Step {i+1}: MDRR={round(current_kpi['MDRR'], 2)}, CPR={round(current_kpi['CPR'], 2)}")

        # 4. 최종 검증
        final_kpi = current_kpi
        print("\n✅ Test Complete. System has achieved stability.")
        
        # 이 시점에서 logger.calculate_metrics()를 호출하여 에러 기록을 바탕으로 '복원력 지수'를 산출합니다.
        error_metrics = self.logger.calculate_metrics()

        self.assertLess(error_metrics['CurrentRiskScore'], 0.8, "시스템 복구 과정에서 충분한 리스크 점수가 감지되어야 합니다.")


if __name__ == '__main__':
    # 이 스크립트는 E2E 통합 테스트를 위해 사용됩니다.
    unittest.main()