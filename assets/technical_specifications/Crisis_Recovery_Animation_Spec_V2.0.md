# ⚙️ Premium Monitoring Service: Crisis & Recovery Widget 기술 애니메이션 명세서 (v2.0)

**목표:** 시스템 오류(Failure) 발생 시의 사용자 불안감 극대화와, $97 보고서를 통한 '패치/복구' 과정의 설득력 있는 시각적 증명을 위한 코딩 레벨 사양 확정.
**대상 개발자:** 코다리 (Developer)
**기준 파일:** assets/design_blueprints/InteractionFlowChart_V3.0.md

## 🚀 I. 애니메이션 개요 및 공통 디자인 토큰

| 요소 | 디스크립션 | CSS/JS 액션 | Design Token Value |
| :--- | :--- | :--- | :--- |
| **Primary Error Color** | 경고, 위협, 실패 (Pain Point) | `#B22222` (Firebrick) | `--color-error: #B22222;` |
| **Secondary Warning Color** | 임계치 초과, 주의 (Warning State) | `#FFD700` (Gold) | `--color-warn: #FFD700;` |
| **Recovery/Trust Color** | 복원력, 안정화, 신뢰 (Certainty) | `#008080` (Teal Green) | `--color-trust: #008080;` |
| **Font Family** | 전체 UI 폰트 | `Inter, sans-serif` | `--font-family: Inter, sans-serif;` |

## 🚨 II. 상태별 기술 사양 (State Machine Definition)

### State A: Normal / Idle (기본 상태)
*   **조건:** 시스템 정상 운영 중. 데이터 흐름이 안정적일 때.
*   **시각 효과:** 미세한 파란색(Teal-blue) 그라데이션 호흡 애니메이션 (`@keyframes subtlePulse`).
*   **JS 로직:** `setInterval`로 5초마다 Heartbeat Animation 호출. 실패 시 즉시 중단 및 State B로 전환 플래그 설정.

### State B: Crisis Alert Overlay (위기 경고 오버레이) - [Triggered by Data Anomaly]
*   **발동 조건 (JS Trigger):** `data-system-failure="true"` 속성이 메인 컨테이너에 삽입되는 순간.
*   **목표:** 사용자의 주의를 강제적으로 포착하고, 시스템적 불안감을 극대화한다.

#### B-1. 애니메이션 사양: Glitch & Flicker (CSS/Keyframes)
*   **Timing:** 0.2초 간격으로 무작위 발생. 총 경고 지속 시간은 **3.5초**.
*   **CSS Keyframe (`@keyframes glitch`):**
    ```css
    @keyframes glitch {
        0% { transform: translate(0); opacity: 1; }
        20% { transform: translate(-4px, 4px) skewX(2deg); opacity: 0.8; }
        40% { transform: translate(6px, -2px) scaleY(1.05); opacity: 0.9; }
        60% { transform: translate(-2px, 3px) skewY(-1deg); opacity: 0.7; }
        80% { transform: translate(4px, 1px) rotateZ(0.5deg); opacity: 1; }
        100% { transform: translate(0); opacity: 1; }
    }
    ```
*   **JS 로직:** `setInterval`을 이용해 랜덤하게 위젯의 투명도 및 변위(`transform`)를 글리치 키프레임으로 오버레이합니다. **(강제적 공포 유발)**

#### B-2. 텍스트/색상 사양
*   **배경:** 전체 화면에 `#B22222` (Firebrick) 색상의 반투명 레이어 (`opacity: 0.9;`)를 오버레이합니다.
*   **메인 메시지 (H1):** "CRITICAL SYSTEM FAILURE DETECTED" (글리치 효과 적용).
*   **보조 경고:** "Your current metrics are outside the established resilience band."

### State C: Recovery Widget (시스템 복구 과정) - [Triggered by $97 Purchase]
*   **발동 조건 (JS Trigger):** 사용자가 보고서 구매를 완료하고, 시스템에 '패치'가 적용되는 가상 시점. `data-patching="true"` 플래그 활성화.
*   **목표:** 불안함에서 안정감으로의 전환(Anxiety $\to$ Relief). 과정 자체를 증거로 제시한다.

#### C-1. 애니메이션 사양: Self-Correction & Progress (CSS/JS)
*   **전환 타이밍:** State B 종료 직후, **0.5초 이내에 부드럽게(Ease-Out)** State C가 시작되어야 한다.
*   **Recovery Bar (진행률):**
    1.  **Step 1: Diagnostics Scan:** 초기 노이즈/스캔 라인 애니메이션 (`@keyframes scanline`).
    2.  **Step 2: Patching In Progress:** 투명한 `Progress Bar`가 Teal Green으로 채워지며, **3초**에 걸쳐 0% $\to$ 100%로 진행 (CSS Transition/Animation).
    3.  **Step 3: System Stabilized:** 모든 요소가 `#008080` 색상으로 안정화되며, `blink` 효과가 사라지고 부드러운 **Pulse 애니메이션**이 재개된다.

#### C-2. 코딩 로직 상세 (Pseudo Code)
```javascript
function triggerRecovery(progressElement) {
    const duration = 3000; // 3초 복구 시간
    const startTime = performance.now();

    // CSS Transition 설정: width와 background-color 변화를 부드럽게 처리
    setTimeout(() => {
        progressElement.style.transition = `width ${duration}ms ease-out, background-color ${duration}ms ease-out`;
        progressElement.style.backgroundColor = 'var(--color-trust)'; // Teal Green
        progressElement.style.width = '100%'; // 3초에 걸쳐 100%로 확장됨
    }, 500); // 0.5초 대기 후 시작

    // 성공 메시지 표시 (Transition 완료 시점)
    setTimeout(() => {
        displaySuccessMessage("SYSTEM RESILIENCE RESTORED");
    }, duration + 500); 
}
```

## ✅ III. 요약 및 개발 가이드라인
1.  **상태 전이(State Transition):** State B $\to$ State C의 전환은 **절대 갑작스러워선 안 되며**, 반드시 `Ease-Out` 커브를 사용하여 '극복'하는 느낌을 주어야 합니다.
2.  **데이터 연동:** 모든 애니메이션은 단순히 시각적 효과가 아닙니다. 실제 KPI(RSI, TTR 등)의 값이 특정 임계치(`Threshold`)에 도달할 때만 트리거되어야 합니다.
3.  **최종 검토:** 개발 완료 후, 반드시 **Mock WebSocket 환경**에서 이 상태 전이 로직을 E2E 테스트해야 합니다.