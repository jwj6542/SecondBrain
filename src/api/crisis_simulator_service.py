import json
from typing import Dict, List, Any
from datetime import datetime

class CrisisSimulatorService:
    """
    PoC 엔진의 구조화된 이벤트 스트림 출력을 관리하는 핵심 서비스 레이어.
    시스템 상태 전이(State Transition)에 따른 가상의 이벤트를 생성합니다.
    """
    def __init__(self):
        print("Crisis Simulator Service Initialized.")

    def _generate_event(self, event_type: str, value: Any, timestamp_offset: int = 0) -> Dict[str, Any]:
        """단일 이벤트 객체를 생성합니다."""
        return {
            "timestamp": datetime.now().timestamp() + timestamp_offset,
            "event_type": event_type,  # 예: CRITICAL, WARNING, NORMAL
            "data": value,
            "message": f"{event_type} state detected."
        }

    def simulate_crisis(self, crisis_type: str) -> List[Dict[str, Any]]:
        """
        주어진 위기 유형에 따라 구조화된 이벤트 스트림을 생성합니다.
        Args:
            crisis_type (str): 시뮬레이션할 위기 타입 ('NORMAL', 'LATENCY_HIGH', 'LIQUIDITY_DROP' 등).

        Returns:
            List[Dict[str, Any]]: JSON 직렬화가 가능한 이벤트 리스트.
        """
        event_stream = []

        # 1. 초기 상태 (정상)
        event_stream.append(self._generate_event("NORMAL", {"status": "System Nominal"}))

        if crisis_type == "LATENCY_HIGH":
            # 2. 위기 발생: Latency 임계치 초과
            latency = {"current_ms": 350, "threshold_ms": 150}
            event_stream.append(self._generate_event("WARNING", latency, timestamp_offset=1))
            event_stream.append(self._generate_event("CRITICAL", {"cause": "Network Jitter detected"}, timestamp_offset=2))

        elif crisis_type == "LIQUIDITY_DROP":
            # 2. 위기 발생: 유동성 급락 (시스템 리스크)
            liquidity = {"current_ratio": 0.15, "safe_min": 0.3}
            event_stream.append(self._generate_event("WARNING", liquidity, timestamp_offset=1))
            event_stream.append(self._generate_event("CRITICAL", {"cause": "Major market exit detected"}, timestamp_offset=2))

        # 3. 복구 상태 (Recovery) - 가상의 시간 경과 후 복구 과정을 추가하여 서사적 긴장감을 높임
        recovery = {"action": "Automated mitigation initiated"}
        event_stream.append(self._generate_event("RECOVERY", recovery, timestamp_offset=5))
        event_stream.append(self._generate_event("NORMAL", {"status": "System stabilizing"}))

        return event_stream


def run_api_simulation(crisis_type: str) -> str:
    """
    API 엔드포인트를 시뮬레이션하는 함수 (실제 POST 요청을 대체).
    """
    service = CrisisSimulatorService()
    event_list = service.simulate_crisis(crisis_type)
    # API 응답 형식에 맞게 JSON 문자열로 반환
    return json.dumps({"status": "success", "events": event_list})

# 테스트 실행 예시 (실제 API 호출 대신 사용)
if __name__ == "__main__":
    print("\n--- [LATENCY_HIGH Crisis Simulation Test] ---")
    latency_json = run_api_simulation("LATENCY_HIGH")
    print(latency_json)

    print("\n--- [LIQUIDITY_DROP Crisis Simulation Test] ---")
    liquidity_json = run_api_simulation("LIQUIDITY_DROP")
    print(liquidity_json)