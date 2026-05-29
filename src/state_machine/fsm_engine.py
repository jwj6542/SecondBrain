from typing import Dict, Any, Type
# 실제 코드에서는 위에서 만든 State 클래스를 임포트합니다.
# from .base_state import State, NormalState 

class FSMStateEngine:
    """PoC Widget의 핵심 상태 관리 엔진입니다."""
    def __init__(self, initial_state: Type[State]):
        self._current_state = initial_state()
        print(f"Engine Initialized in {self._current_state.name} State.")

    @property
    def current_state(self) -> State:
        return self._current_state

    def process_data(self, data: Dict[str, float]) -> tuple[State, bool]:
        """외부 데이터를 받아 상태 변화를 시도하고 결과를 반환합니다."""
        print("\n--- Running Cycle Check ---")
        
        # 1. 현재 상태 기반으로 다음 상태 검사 로직 실행
        next_state_identifier = self._current_state.check_transition(data)

        if next_state_identifier:
            # 2. 실제 구현에서는 여기에 next_state 객체를 찾아 바인딩합니다.
            # 예시: self._current_state = WarningState()
            print("✅ Transition Successful! New State Activated.")
            # Mock Update for demonstration purposes
            self._current_state = type('MockNext', (object,), {'name': 'WARNING'})() 
            return self._current_state, True # 상태 변경 성공

        else:
            # 3. 변화 없음, 현재 상태 유지
            print("🔄 State Stable. No transition detected.")
            return self._current_state, False # 상태 변경 실패 (유지)

    def get_status(self) -> Dict[str, Any]:
        """현재 시스템의 전체 상태 정보를 반환합니다."""
        return self._current_state.get_current_state_info()


# --- 테스트 코드 영역 ---
if __name__ == '__main__':
    # 1. 초기화 (Normal State에서 시작)
    engine = FSMStateEngine(NormalState)

    # 2. 시나리오 A: 정상 데이터 주입 (상태 유지 확인)
    normal_data = {'vix': 15.0, 'volatility': 0.1}
    state, changed = engine.process_data(normal_data)
    print("\n[OUTPUT] 현재 상태:", state.get_current_state_info())

    # 3. 시나리오 B: 위험 데이터 주입 (상태 전이 강제 확인)
    crisis_data = {'vix': 25.0, 'volatility': 0.3} # VIX 임계치 초과
    state, changed = engine.process_data(crisis_data)
    print("\n[OUTPUT] 현재 상태:", state.get_current_state_info())