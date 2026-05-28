# 📄 Dev Handoff Spec: Recovery Widget Prototype (v1.0)

## 🎯 목표 및 범위
*   **목표:** API 기반의 상태 전이(State Transition) 로직을 시각적으로 증명하는 인터랙티브 컴포넌트 프로토타입 제작 가이드라인.
*   **핵심 원칙:** 디자인은 '기술적 우월성'과 '보험 상품 같은 안정감'을 동시에 전달해야 합니다.

## ⚙️ 1. API Input Contract Assumption (코다리님과의 합의 사항)
| Variable | Type | Description | Example Value (Crisis State) |
| :--- | :--- | :--- | :--- |
| `resilience_index` | float | 시스템 자본 보존 지수 (0.0 ~ 100.0). **핵심 KPI.** | $28.5$ |
| `current_volatility` | float | 현재 변동성 수치. | $35.2$ |
| `status_state` | enum | 현재 시스템의 상태 (NORMAL, WARNING, CRISIS, FAILURE). | `CRISIS` |
| `message_content` | string | 사용자에게 보여줄 경고 메시지 텍스트. | "시스템 복원력의 심각한 저하가 감지되었습니다." |
| `actionable_cta` | object | 필수 행동 지침 (버튼/링크). {text: '구매', url: '...'} | `{text: '즉시 미니 진단 보고서 구매', url: '/purchase'}` |

## 🎨 2. 컴포넌트 와이어프레임 및 디자인 시스템 가이드
### A. 핵심 지표 게이지 (The Gauge)
*   **구성:** 원형 게이지와 수치 표시기 (`{{resilience_index}}`).
*   **상태별 시각화 규칙:**
    *   **State 0 (Normal):** 배경 색상: `#28a745` (Safe Green). 게이지 바늘이 안정적인 영역에 위치.
    *   **State 1 (Warning):** 색상 전환: 노랑/주황 계열 (`#ffc107`). 게이지 하강 시작 및 경고 아이콘 활성화.
    *   **State 2 (Crisis):** **필수 규칙:** 색상을 강렬한 빨간색(`#dc3545`)으로 고정. 게이지 바늘이 최저점에 도달하는 애니메이션을 적용하며, 컴포넌트 주변에 미세한 떨림(Shake) 효과를 부여하여 위기감을 극대화합니다.
### B. 상태 전이 그래프 (The Curve - 가장 중요)
*   **구성:** 시간축 대비 `{{resilience_index}}`의 추이를 보여주는 꺾은선 그래프.
*   **상태별 배경 처리:**
    *   **State 0:** 평평하고 안정적인 곡선 형태 유지.
    *   **State 1:** 그래프 하단에 '경고 영역 (Warning Zone)'이라는 옅은 오렌지색 음영을 추가합니다. 이 영역의 경계가 명확해야 합니다.
    *   **State 2:** 그래프가 급격히 하강하며, **'Black Swan Event Zone'**이라는 강렬한 빨간색 배경음영이 발생해야 합니다. 이 구간은 기술적 위기 상황 자체를 시각화하는 핵심 요소입니다.
### C. 전문 경고 메시징 및 CTA (The Narrative)
*   **메시지 톤:** 감성적 호소보다 **기술 보고서 같은 냉철하고 권위적인 톤**을 유지합니다. ("~가 부족하다", "~에 대한 증명이 필요하다" 등).
*   **CTA 구현:** `{{actionable_cta}}` 변수를 받아, 크기와 색상이 가장 눈에 띄는 (Red/Orange 대비) 버튼으로 구현되어야 합니다. State 2에서는 이 CTA가 화면의 중앙 하단에 고정되거나 애니메이션 효과로 강조되어야 합니다.

## 🚀 3. 개발자에게 전달할 상호작용 시퀀스 다이어그램 (Flowchart Reference)
1.  **초기 로드:** $\to$ [State 0: NORMAL] 컴포넌트 전체가 안정적으로 표시됩니다. (Default View)
2.  **API 호출 & 데이터 수신:** 코다리님의 Mocking Service가 **Warning 데이터를 전송.**
3.  **상태 변화 트리거:** 프론트엔드가 `status_state` = WARNING을 감지하고, A, B, C 세 컴포넌트에 대한 CSS 클래스와 애니메이션 트랜지션(Transition)을 즉시 적용합니다. (시간차를 두고 진행되어야 함).
4.  **Critical Event:** Mocking Service가 **Crisis 데이터를 전송.** $\to$ 모든 요소에 `CRISIS` 스타일이 강제 적용되고, 그래프 배경은 빨간색으로 바뀌며, CTA 버튼의 애니메이션 효과(깜빡임 등)가 최대화됩니다.