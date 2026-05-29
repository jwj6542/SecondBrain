from abc import ABC, abstractmethod
from typing import Dict, Any

class State(ABC):
    """추상 기반 클래스: 모든 상태는 이 인터페이스를 따라야 합니다."""
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def get_current_state_info(self) -> Dict[str, Any]:
        """현재 상태의 사용자에게 보여줄 핵심 정보와 메시지를 반환합니다."""
        pass

    @abstractmethod
    def check_transition(self, data: Dict[str, float]) -> 'State' or None:
        """외부 데이터를 기반으로 다음 유효한 상태를 검사하고 반환합니다.
           None을 반환하면 현재 상태 유지입니다.
        """
        pass

# 구현 예시 (Normal State)
class NormalState(State):
    def __init__(self):
        super().__init__("NORMAL")
        self.message = "시장 상황은 안정적입니다. 리스크 관리가 필요합니다."

    def get_current_state_info(self) -> Dict[str, Any]:
        return {
            "state": self.name, 
            "level": "🟢", 
            "message": self.message,
            "risk_score": "Low Risk Zone"
        }

    def check_transition(self, data: Dict[str, float]) -> 'State' or None:
        """VIX 지표를 체크하여 Warning 상태로 전이할지 확인합니다."""
        vix = data.get('vix', 0.0)
        volatility = data.get('volatility', 0.0)

        # 트리거 정의 (PRD 기반): VIX가 임계치를 넘거나 변동성이 급증할 때
        if vix >= 20.0 or volatility > 0.25:
            print(f"[TRANSITION] Normal -> Warning triggered by VIX ({vix:.2f})")
            # 실제 구현에서는 다음 상태 객체를 반환합니다. (WarningState())
            return "WARNING_TRIGGERED" # Mock return for structure clarity
        
        return None