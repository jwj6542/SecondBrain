# 🎨 Premium Monitoring Service: Recovery Widget 디자인 시스템 사양서 (v1.0)

## 📄 문서 개요
이 문서는 '위기 $\to$ 복구' 과정의 인터랙티브 컴포넌트인 `RecoveryWidget`을 웹사이트에 실제 삽입(Production-Ready)하기 위한 최종 가이드라인이다. 모든 개발 요소는 **상태(State)**와 **애니메이션 로직**을 중심으로 정의된다.

## 🎨 I. 브랜드 & 타이포그래피 시스템
*   **Primary Color Palette (신뢰/안전):**
    *   `--color-safety`: #1A535C (딥 그린/네이비 계열, 안정성) - 주 배경 및 성공 상태.
    *   `--color-warning`: #FF6B6B (레드 오렌지, 경고/위험) - '경고 레드' 상태의 핵심 색상.
    *   `--color-intervention`: #FFE66D (골든 옐로우, 주의/개입) - '개입 신호 감지' 상태를 강조하는 액션 컬러.
    *   `--color-text-dark`: #333333 (본문 텍스트)
    *   `--color-background`: #F9F9F9 (밝은 배경)
*   **Typography:**
    *   **Headline (H1, H2):** Pretendard Bold, 32px ~ 48px. (Impact 강조 시 사용)
    *   **Body Text:** Pretendard Regular, 16px. (가독성 최우선)

## 🔄 II. 핵심 컴포넌트 정의: RecoveryWidget State Flow
`RecoveryWidget`은 다음 세 가지 상태를 순차적이고 인터랙티브하게 거쳐야 한다. 각 상태는 명확한 시각적 변화(Visual Shift)와 애니메이션 로직을 가져야 한다.

### 🔴 State 1: Warning (위기 발생 / Failure Point)
*   **핵심 메시지:** "시스템 과부하 감지. 임계치 이탈 위험." (Pain Point 자극)
*   **시각적 특징:** 전체 배경에 미세하고 빨간색 계열의 노이즈 패턴(Noise Overlay)을 오버레이한다. 모든 그래프 라인이 급격히 하락하는 애니메이션을 보여준다.
*   **UI/UX 요소:**
    1.  **메인 게이지:** `--color-warning`를 사용하여 0%로 수렴하는 모습을 표현. (실시간 데이터 피드 시뮬레이션)
    2.  **경고 아이콘:** 애니메이션되는 삼각형 경고 표시 (`<svg icon="warning" class="pulse">`).
    3.  **상호작용 포인트 (Interaction Point):** 사용자가 특정 '붕괴 지점'을 클릭하면, 다음 상태로의 전환이 시작된다는 시각적 힌트(예: 떨림 애니메이션)가 발생해야 한다.

### 🟡 State 2: Intervention Signal Detected (개입 신호 감지 / Actionable Insight)
*   **핵심 메시지:** "시스템 개입 신호 포착. 즉각적인 리스크 재평가 필요." (Solution의 존재 암시)
*   **시각적 특징:** 배경 노이즈 패턴이 멈추고, `--color-intervention`를 사용하여 '개입 경로' 또는 '안전 지점'을 따라 빛나는 선(Path of Light)이 그래프 위로 그려진다.
*   **UI/UX 요소:**
    1.  **인터벤션 게이지:** 이전에 하락했던 게이지가 일시적으로 멈추거나, 특정 기준선(Threshold Line)으로 '튕겨 오르는' 애니메이션을 구현한다.
    2.  **데이터 시각화:** 위험 지표와 함께 '개입 신호의 근거'를 보여주는 작은 차트(예: 스왑 비용 대비 리스크 감소율)가 팝업 형태로 나타나야 한다.

### 🟢 State 3: Stabilization Complete (안정화 완료 / Certainty)
*   **핵심 메시지:** "리스크 관리 프로세스 정상 작동. 자본 보존 성공." (궁극적 신뢰 및 구매 유도)
*   **시각적 특징:** 전체 화면의 색상이 `--color-safety` 딥 그린 계열로 부드럽게 전환된다. 모든 애니메이션이 점진적으로 느려지며 안정감을 준다.
*   **UI/UX 요소:**
    1.  **최종 게이지:** 게이지가 완전히 채워져 '안정화 완료'를 나타내는 녹색 배경과 텍스트가 표시된다. (성공 메시지)
    2.  **CTA 강조:** 이 섹션에 도달하면, 즉시 $97 미니 진단 보고서 구매 CTA 버튼이 가장 눈에 띄는 위치에 배치되어야 한다. 버튼은 `--color-safety`와 대비되는 밝고 명확한 색상으로 정의된다.

## 💻 III. 개발자 핸드오프 스펙 (Developer Handoff Spec)
*   **애니메이션 로직:** 모든 상태 전환(Transition)은 최소 `1.5s ~ 2.5s`의 시간을 두고 진행되어야 하며, 부드러운 **Ease-out Cubic Bézier Curve**를 적용하여 기술적인 느낌보다는 '유기적인 흐름'을 느끼게 한다.
*   **필수 컴포넌트:**
    *   `<Gauge status="warning/intervention/stable">` : 상태에 따라 색상과 값(`value`)이 동적으로 변경되어야 함.
    *   `<Indicator type="ripple|pulse" color="...">` : 경고와 개입 신호를 나타내는 시각적 효과 컴포넌트.
    *   `<Chart data-points="{...}">` : 상태에 맞는 핵심 지표(Drawdown, Volatility 등)를 표시하는 표준화된 차트 컴포넌트.