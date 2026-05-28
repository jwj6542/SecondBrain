# 🚀 Premium Monitoring Service: Production-Ready Design System Handoff Specification (v4.0)

**목표:** 이 문서는 디자인 목업을 넘어, 개발팀이 '자본 보존 설계'의 핵심인 `RecoveryWidget` 컴포넌트를 즉시 코딩하고 테스트할 수 있도록 하는 최종 기술 사양서(Technical Specification)이다. 모든 디자인 요소는 데이터와 상태 변화에 의해 구동되어야 한다.

---
## 1. Core Component Library (컴포넌트 정의 및 네이밍 컨벤션)

**규칙:** `[Component_Name]_[Functionality]_[State]` (예: `Gauge_VIX_Critical`)

### A. RecoveryWidget (핵심 컴포넌트)
*   **역할:** 시스템의 현재 리스크 상태와 과거 복원 과정을 시각적으로 증명하는 핵심 인터랙티브 요소.
*   **구성요소:**
    1.  **[Gauge_VIX]**: 실시간 변동성 지표 게이지. (데이터 바인딩 필수)
    2.  **[StatusIndicator]**: 현재 시스템 상태를 나타내는 색상/아이콘 (Normal, Warning, Critical).
    3.  **[RecoveryGraph]**: 자본 보존(Capital Preservation) 과정의 그래프 히스토리.
*   **State 정의:** Normal $\to$ Warning $\to$ Critical $\to$ Recovery

### B. Supporting Components (보조 컴포넌트)
1.  **Danger_Alert_Module:** 비정상 상태 발생 시 플래시 효과와 함께 팝업되는 경고 메시지 영역.
2.  **DataFlow_Visualization:** 데이터의 흐름(Input $\to$ Processing $\to$ Output)을 순환 화살표로 표현하는 애니메이션 경로.

---
## 2. State Transition Machine (상태 변화 로직 정의)

시스템은 외부 입력 데이터($VIX_{raw}$, $Correlation_{raw}$)에 의해 상태가 자동으로 전환되어야 한다. 이 전이 과정(Transition)을 가장 중요하게 구현한다.

| 현재 상태 (Source State) | 트리거 조건 (Trigger Condition/Data Binding) | 다음 상태 (Target State) | 발생 애니메이션 (Required Animation Logic) |
| :--- | :--- | :--- | :--- |
| **Normal** (청록색 계열) | $VIX_{raw}$가 임계치(T1) 초과 OR $Cor_{raw}$의 상관관계 급락 감지 | $\to$ Warning (황색 경고) | 게이지 색상이 부드럽게 노란색으로 전환되며, `Danger_Alert_Module`이 활성화된다. |
| **Warning** (황색 계열) | $VIX_{raw}$가 임계치(T2) 초과 AND 1시간 내 추세 악화 지속 | $\to$ Critical (적색 경보) | 게이지가 급격하게 붉은색으로 변하며, 화면 전체에 미세한 **글리치 효과(Glitch Effect)** 및 강력한 시각적 깜빡임이 발생한다. `Danger_Alert_Module`에서 "CRITICAL FAILURE DETECTED" 메시지가 송출된다. |
| **Critical** (적색 경보) | 외부 개입 로직 실행 / 데이터 정상화 감지 (시간 경과 또는 개입 API 호출) | $\to$ Recovery (회복/안정화) | `RecoveryGraph`가 꺾여 올라가는 애니메이션이 최대치로 발현된다. 배경의 글리치 효과가 서서히 줄어들며, 청록색 계열의 안전한 컬러 팔레트가 점진적으로 돌아오기 시작한다 (Anti-Climax Effect). |
| **Recovery** (청록색 계열) | 시스템 안정화 완료 및 지표 정상 수렴 | $\to$ Normal | 모든 애니메이션이 멈추고, `StatusIndicator`가 녹색 체크 마크를 표시하며 '시스템 재정비 완료' 메시지를 송출한다. |

---
## 3. Data Binding & Technical Specification (개발자 필수 가이드)

| 컴포넌트 / 기능 | 데이터 바인딩 포인트 (Input Variable) | 로직/규칙 (Binding Rule) | 결과물 (Output Action) |
| :--- | :--- | :--- | :--- |
| **[Gauge_VIX]** | `current_vix`: Float (0.5 ~ 100) | 값이 증가함에 따라 게이지의 색상(`Color: #008080` $\to$ `#FF6B6B`) 및 너비가 비선형적으로 커진다. | 시각적 변동성 표현, **CSS/JS 애니메이션** 트리거. |
| **[StatusIndicator]** | `system_state`: Enum (Normal, Warning, Critical) | `system_state` 값에 따라 배경색과 텍스트가 즉시 변경된다. | 페이지 전체의 **전역(Global)** 컬러 팔레트 조정 및 타이포그래피 강조. |
| **[RecoveryGraph]** | `history_data`: Array of (Time, Value) | Critical $\to$ Recovery 전이 시, 이 데이터를 기반으로 최솟값 대비 상승 곡선을 그려야 한다. | 그래프의 Y축은 반드시 '절대 손실액'이 아닌 '**보존 자산 가치(Preserved Capital)**'로 표시되어야 함. |
| **[Danger_Alert_Module]** | `is_critical`: Boolean | True일 경우, 무작위 주기로 미세한 진동/깜빡임을 발생시키고 텍스트를 오버레이 한다. | 사용자 공포(Fear) 극대화를 위한 인터랙티브 요소. (CSS: `@keyframes flicker`) |

---
## 4. Responsiveness & Accessibility (디바이스 가이드)

*   **Breakpoint:** 최소 768px 이상을 기준으로 디자인되었다.
*   **Mobile Optimization:** `RecoveryWidget`은 모바일 환경에서 **세로형(Vertical Stack)**으로 재배치되어야 한다. 그래프는 간결화된 라인 차트만 유지하고, 게이지 대신 백분율 감소폭을 큰 폰트로 표시한다.