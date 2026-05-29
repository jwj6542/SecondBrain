import json
import time
from datetime import datetime, timedelta

# --- Configuration ---
SIMULATION_DURATION = 60  # Seconds for a full cycle test
INITIAL_STATE = "NORMAL"
STRESS_THRESHOLD = 0.15 # Example: RSI drops below this value
RECOVERY_RATE = 0.02    # Rate of recovery per second

class StateTransitionSimulator:
    """
    Mock WebSocket Core 기반의 상태 전이 스트레스 테스트 시뮬레이터.
    정상 -> 실패(임계치 이탈) -> 복구 시퀀스를 구조화된 JSON 이벤트로 출력합니다.
    """
    def __init__(self):
        self.current_state = INITIAL_STATE
        self.stress_level = 1.0 # Initialized at 1.0 (Healthy)
        print("--- Stress Test Engine Initializing ---")

    def _generate_event(self, event_type: str, details: dict) -> dict:
        """시간 태그와 구조화된 데이터를 가진 이벤트 객체를 생성합니다."""
        return {
            "timestamp": datetime.now().isoformat() + "Z",
            "event_type": event_type,
            "data": details
        }

    def _transition_to_failure(self):
        """1단계: 정상 상태에서 임계치 이탈 및 실패 시퀀스 시작."""
        print("[SIM] State Transitioning: NORMAL -> STRESS/FAILURE")
        self.current_state = "STRESSED"
        
        # 1. 경고 이벤트 발생 (Pre-failure Warning)
        event = self._generate_event("WARNING", {"metric": "RSI", "value": 0.7, "threshold": STRESS_THRESHOLD})
        print(f"[EVENT] {json.dumps(event)}")

        # 2. 실패 상태 진입 (Critical Failure Event)
        self.stress_level = 1.0 - STRESS_THRESHOLD # Simulate significant drop
        failure_event = self._generate_event("CRITICAL_FAILURE", {"reason": "System Liquidity Drop", "impact_score": 0.95})
        print(f"[EVENT] {json.dumps(failure_event)}")

    def _simulate_stress_period(self, duration: int):
        """실패 상태 유지 및 데이터 악화 시뮬레이션."""
        for i in range(duration // 2): # Simulate for half the time
            time.sleep(0.1) # Short sleep for simulation visibility
            # Stress level degrades further over time
            self.stress_level = max(0, self.stress_level - (i * 0.005))
            event = self._generate_event("DATA_DEGRADATION", {"metric": "Vol_Spread", "value": f"{1-(i*0.01):.4f}"})
            print(f"[EVENT] {json.dumps(event)}")

    def _transition_to_recovery(self, duration: int):
        """2단계: 복구 시도 및 안정화 과정 시뮬레이션."""
        print("\n[SIM] State Transitioning: STRESSED -> RECOVERY")
        self.current_state = "RECOVERING"

        for i in range(duration):
            time.sleep(0.1)
            # Recovery logic: stress level slowly climbs back up
            recovery_amount = RECOVERY_RATE * (i + 1)
            self.stress_level = min(1.0, self.stress_level + recovery_amount)

            event = self._generate_event("RECOVERY_ATTEMPT", {"metric": "Capital_Preservation", "value": f"{self.stress_level:.4f}", "progress": i / duration})
            print(f"[EVENT] {json.dumps(event)}")

        # 3단계: 안정화 완료 (Final Success)
        self.current_state = "NORMAL"
        final_event = self._generate_event("SYSTEM_STABLE", {"message": "System fully restored and operating within optimal parameters."})
        print(f"[EVENT] {json.dumps(final_event)}")


    def run_stress_test_cycle(self):
        """전체 3단계 시퀀스를 실행하는 메인 함수."""
        start_time = time.time()
        print("===============================================")
        print("🚀 STARTING INTEGRATED STRESS TEST CYCLE (3 Stages)")
        print("===============================================")

        # Stage 1: Normal -> Failure Trigger
        self._transition_to_failure()

        # Stage 2: Stress Period Simulation (Data Degradation)
        self._simulate_stress_period(int(SIMULATION_DURATION * 0.4))

        # Stage 3: Recovery Attempt & Stabilization
        self._transition_to_recovery(int(SIMULATION_DURATION * 0.6))
        
        print("\n===============================================")
        print("✅ STRESS TEST CYCLE COMPLETED SUCCESSFULLY.")
        print(f"Total simulated time: {time.time() - start_time:.2f} seconds.")

# --- Execution Block ---
if __name__ == "__main__":
    simulator = StateTransitionSimulator()
    simulator.run_stress_test_cycle()