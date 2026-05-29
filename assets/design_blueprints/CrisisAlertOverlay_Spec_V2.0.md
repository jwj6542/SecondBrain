# 🚨 Crisis Alert Overlay: 애니메이션 로직 사양서 (v2.0)

## 🎯 목적
단순한 시각적 꾸밈(Decorative Effect)이 아닌, **시스템 데이터 이상 감지(Anomaly Detection)**와 **기술적 위기 경고**가 발생했을 때만 발동하는 고신뢰성 애니메이션 시스템을 정의한다. 이 효과는 사용자에게 '현재 상황은 통계적 변동성을 넘어선 시스템적 오류 영역에 진입했다'는 공포와 긴장감을 기술적으로 주입하는 것이 목표다.

## ⚙️ 작동 트리거 (Trigger Conditions)
애니메이션은 다음 세 가지 조건이 **모두** 충족될 때만 발동한다:
1. **`System_State == CRITICAL_FAILURE`**: PoC Widget의 핵심 지표(예: Drawdown Rate, Volatility Index)가 95백분위수 이상으로 급격히 하락/상승할 때 (기술적 임계치 초과).
2. **`Anomaly_Flag == TRUE`**: 백엔드 API에서 `DataStreamError` 또는 `ThresholdBreach(Severity: High)` 코드가 반환될 때.
3. **`UI_Focus == PRIMARY`**: 사용자가 PoC Widget의 메인 시각화 영역에 집중하고 있을 때 (즉, 시스템이 가장 중요한 순간).

## ⏱️ 애니메이션 로직 및 타이밍 (Keyframe & Timing)

| 상태 | 트리거 | 효과명 | Keyframe/Timing 지침 |
| :--- | :--- | :--- | :--- |
| **Initial** | `Anomaly_Flag == TRUE` 감지 시 | **[1단계] Warning Glow** | 0.0s: (Invisible) $\to$ 0.2s: 전체 화면에 낮은 강도의 청록색(Teal Green, #008080) 노이즈 오버레이가 부드럽게 퍼짐. `opacity: 0`에서 `opacity: 0.4`로 선형 증가 (Duration: 200ms). |
| **Peak** | 데이터 임계치(Threshold) 초과 확정 시 | **[2단계] Glitch & Flicker Burst** | **0.3s ~ 1.5s 구간에 집중 발동.**<br>• **Glitch:** 화면 전체가 수평/수직으로 3~5회 빠르게 왜곡되며, 주변 UI 요소들이 순간적으로 비정상적인 색상(Magenta #FF00FF 또는 Cyan #00FFFF)의 사각형 블록으로 깜빡임. (Duration: ~10ms per glitch).<br>• **Flicker:** 배경에 포함된 스캔라인 패턴이 무작위로 강도와 간격이 변하며, 마치 전력 공급이 불안정한 듯한 플리커 효과를 3회 이상 반복함. (Frequency: 8Hz $\to$ 15Hz). |
| **Resolution** | 사용자가 'Patch/Report 구매' CTA 클릭 시 / 시스템 복구 시작 시 | **[3단계] Stabilization Fade Out** | 1.6s ~ 2.5s 동안, 과도했던 노이즈와 색상이 점진적으로 사라지며(Duration: 900ms), 배경은 안정적인 '신뢰 청록색'으로 돌아옴. 마지막에는 미세한 '데이터 흐름' 사운드와 함께 UI가 정상 상태로 복구되는 시각적 신호를 제공함. |

## 📐 디자인 시스템 적용 지침
*   **노이즈 패턴:** 배경의 모든 요소에 공통적으로 낮은 주파수의 무작위 노이즈(Random Noise) 레이어를 깔아, 애니메이션이 없는 순간에도 '모니터링되고 있음'을 암시한다.
*   **색상 코드 (Color Codes):** 위기 상황에서는 **Magenta (#FF00FF)**와 **Cyan (#00FFFF)**를 강조 색상으로 사용하며, 이는 정상 상태의 신뢰 청록색(#008080)과 극명한 대비를 이루어야 한다.
*   **개발 지침:** 이 애니메이션은 CSS Keyframes 또는 WebGL 셰이더를 사용하여 구현되어야 하며, 단순한 `opacity` 변화로는 절대 대체할 수 없다.