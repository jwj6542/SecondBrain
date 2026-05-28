# 🧪 PoC Widget End-to-End 통합 테스트 계획서 (The Resilience Test Plan)
## 🎯 목표 및 범위 정의
이 문서는 랜딩 페이지의 핵심 증명 도구인 PoC Widget의 전체 사용자 여정(User Journey)을 포괄하는 통합 테스트 케이스를 제공합니다.
**테스트 목표:** '데이터 기반 구조적 결함 감지'부터 '전문가 개입 신호 제시'까지 모든 상태 변화와 API 바인딩 지점이 완벽하게 작동하며, 외부 오류에도 시스템 복원력(Resilience)을 유지함을 입증하는 것입니다.

## 🚀 테스트 환경 구축 우선순위 (Priority Setup Checklist)
테스트를 진행하기 위해 필요한 선행 작업입니다. 순서대로 준비해야 합니다.

| Priority | 컴포넌트/인터페이스 | 기술적 요구사항 | 비고 및 검증 항목 |
| :--: | :--- | :--- | :--- |
| **P1 (Critical)** | **API Mocking Service** | VIX, 시장 변동성(Volatility), 가격 데이터 스트림을 시뮬레이션할 수 있는 백엔드 서비스 구축. | API Call 지연/끊김 상황 모의 테스트가 필수적입니다. |
| **P2 (High)** | **State Machine Logic Layer** | 'Normal $\to$ RED $\to$ INTERVENE' 상태 전환 로직을 담당하는 서버 측 로직 레이어 구현. | 프론트엔드와 백엔드의 상태 계약(Contract) 정의가 필요합니다. |
| **P3 (Medium)** | **Front-End State Binding** | React/Vue 등 실제 프레임워크에 API 응답 데이터를 바인딩하고 UI를 렌더링하는 로직 구현. | 애니메이션 자산 키트의 타이밍(Timing)과 데이터 업데이트 주기를 동기화해야 합니다. |

---
## 🏗️ 핵심 테스트 시나리오 (Test Scenarios)
### Scenario 1: 정상 상태 유지 및 초기 Hook (Baseline Test)
*   **목표:** 시스템이 안정적일 때의 기본 UI/UX와 API 응답을 확인합니다.
*   **Pre-condition:** VIX 지수가 역사적 평균 범위 내에 있음. 시장 데이터는 일반적인 추이를 보임.
*   **테스트 흐름:**
    1.  사용자가 페이지 진입 $\to$ PoC Widget이 '정상' 상태를 표시함.
    2.  **API 호출:** `GET /api/v1/signal_status?market=...` (Expected Response: `STATUS: NORMAL`, `SCORE: 0-10`)
    3.  **검증 포인트:** UI가 안정적이고 지표 변화가 미미함을 보여주어 신뢰도를 높이는 것이 목표입니다.

### Scenario 2: 구조적 결함 감지 (The RED Signal - Core Test)
*   **목표:** 시장의 비정상적인 변동성(붕괴 시그널)을 정확히 포착하고, 사용자에게 경고를 주는 과정을 검증합니다.
*   **Pre-condition:** 외부 API Mocking Service가 **급격한 VIX 스파이크 및 가격 이탈** 데이터를 강제 주입함.
*   **테스트 흐름:**
    1.  시장 변동성 임계값(Threshold) 초과 감지 $\to$ 시스템 내부 플래그 변경.
    2.  **API 호출:** `GET /api/v1/signal_status?market=...` (Expected Response: `STATUS: RED`, `SCORE: 90-100`, `DEVIATION: High`)
    3.  **검증 포인트:** 애니메이션 키트가 '붕괴 감지' 시퀀스를 정확한 타이밍에 재생하는지, UI의 경고 메시지가 데이터와 연동되는지 확인합니다.

### Scenario 3: 개입 신호 및 복원력 증명 (Intervention Signal - Ultimate Test)
*   **목표:** 시스템이 결함 감지를 넘어 '전문가의 개입' 단계로 전환하여 해결책을 제시하는 과정을 검증합니다. (가장 중요한 단계)
*   **Pre-condition:** `RED` 상태 진입 후, 시간 경과 또는 특정 조건 충족에 따라 개입 로직이 발동됨.
*   **테스트 흐름:**
    1.  시스템 내부 복원력 알고리즘 실행 $\to$ '개입 신호' 데이터 생성.
    2.  **API 호출 (Write/Post):** `POST /api/v1/intervene?strategy=...` (Body: 추천 포지션, 위험 관리 레벨 등)
    3.  **검증 포인트:** PoC Widget이 단순한 경고를 넘어 '다음 행동'을 구체적으로 제시하는 UI 컴포넌트를 띄우는지, 이 데이터가 CTA 블록의 논리적 기반이 되는지를 확인합니다.

---
## 💥 통합 스트레스 및 예외 테스트 (Non-Functional Testing)
이 섹션은 제품의 신뢰도(Trustworthiness)를 증명하기 위해 필수입니다.

1.  **API 연결 끊김 테스트:** `GET` 요청 도중 API가 갑자기 응답을 중단했을 때, Widget이 '오류' 메시지를 띄우는 것이 아니라 **"현재 데이터 스트림 불안정: 잠시 후 재연결 시도합니다."와 같은 사용자 친화적 회복 안내**를 보여주는지 검증.
2.  **데이터 유형 불일치 테스트:** API가 숫자를 보내야 할 곳에 문자열을 보냈거나, 날짜 포맷이 깨졌을 때 (e.g., `{"score": "High"}`), 시스템 전체가 크래시되지 않고 해당 컴포넌트만 에러 핸들링 메시지를 띄우는지 검증.
3.  **동시 접속자 테스트:** 다수의 사용자가 동시에 Widget을 사용하는 상황에서, 백엔드 서버의 병목 현상(Bottleneck)이나 데이터 무결성 문제가 발생하는지 부하 테스트를 진행해야 합니다.