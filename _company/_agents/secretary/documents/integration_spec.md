# 🔗 통합 명세서 (Integration Specification) - v0.1

## 📋 목적
개발팀이 발행하는 구조화된 시스템 이벤트(JSON Stream)를 디자인팀의 애니메이션 엔진이 실시간으로 수신하고, 기술적 트리거에 기반하여 시각적인 경고/상태 변화를 발동시키기 위한 명확한 매핑 지침을 정의합니다.

## 📐 데이터 소스 (Developer Output 기준)
개발자님의 `StateOrchestratorService`가 발행하는 이벤트 스트림 JSON 구조:
\`\`\`json
{
  "timestamp": "YYYY-MM-DDTHH:MM:SS",
  "severity": ["INFO", "WARNING", "ERROR", "CRITICAL"],
  "state": "STATE_CODE", // 예: LOW_LIQUIDITY, API_DISCONNECTED
  "message": "상태 변화에 대한 설명 메시지",
  "data_trigger": 0.05 // (추가) 임계치 이탈률 또는 리스크 지표 수치
}
\`\`\`

## ✨ 애니메이션 매핑 로직 (Designer Output 기준)
| JSON `severity` | 조건 트리거 (`data_trigger`) | 발동 효과 (Effect) | 지속 시간 (Duration) | 비주얼 목표 / 연출 가이드 |
| :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | 1.0 초과, 또는 특정 코드를 포함할 때 | Full-screen Glitch + Red Flicker + Shake | 0.5초 (최소) | 시스템 전체가 다운된 듯한 느낌. 화면이 깨지는 효과를 주어 강한 공포감 유발. |
| **ERROR** | 0.3 ~ 1.0 사이의 데이터 이상 감지 시 | Alert Overlay Fade-in + Red/Black Flash | 1.0초 | '연결 끊김', '데이터 무효화' 등 기술적 실패를 강조하는 플리커 사용. |
| **WARNING** | 0.05 ~ 0.3 사이의 데이터 이상 감지 시 | Subtle Glitch + Yellow-Red Pulsing Border | 2.0초 (경고 지속 시간) | '주의', '임계치 근접' 등 관찰이 필요한 상태를 강조. 가장 자주 사용되어야 하는 패턴. |
| **INFO** | 정상 작동 시 | None / Subtle Teal Glow | N/A | 배경에 신뢰감을 주는 은은한 파란색(Trust Teal)의 미세한 빛 효과만 유지. |

## 🛠️ 통합 검증 체크리스트 (Action Items)
1. [ ] **[Developer]** 위 네 가지 `severity`에 대응하는 JSON 로그 출력이 테스트 가능하도록 API를 수정/확인합니다.
2. [ ] **[Designer]** 각 `severity`별 애니메이션의 Keyframe과 타이밍이 이 명세서와 정확히 일치함을 최종 확인합니다.
3. [ ] **[CEO 지시]** 통합된 시나리오(예: 평상시 $\to$ Warning 발생 $\to$ Critical Error로 전이)를 정의하여, 위의 모든 상태 변화가 순차적으로 테스트될 수 있도록 요청합니다.