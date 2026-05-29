# 🛡️ PoC Widget: Warning State Technical Specification (V1.0)
## 🎯 목표 및 목적
이 사양서는 PoC(Proof of Concept) Widget 컴포넌트가 'Observation' 상태에서 'Warning' 상태로 전이되는 과정을 개발팀에 전달하기 위함이다. 이 경고는 단순한 시각적 알림을 넘어, 사용자에게 **"현재 당신의 자본은 시스템적인 위험에 노출되어 있다"**라는 인지 부조화와 공포를 극대화하여 $97 미니 진단 보고서 구매로 유도하는 것이 핵심 목표이다.

## ⚙️ 컴포넌트 명세: PoC Widget
*   **대상:** 웹사이트 랜딩 페이지 (Desktop/Mobile)
*   **상태 전이 로직:** $\text{Risk Index} < \text{Threshold}_{\text{Obs}} \to \text{Observation}$ $\mid$ $\text{Threshold}_{\text{Obs}} \le \text{Risk Index} < \text{Threshold}_{\text{Warn}} \to \text{Observation/Pre-Warning}$ $\mid$ **$\text{Risk Index} \ge \text{Threshold}_{\text{Warn}} \to \text{WARNING}$**

## 🚥 상태별 시각적 변화 (Observation $\to$ Warning)
| 속성 | Observation State ($\text{Index} < \text{Threshold}_{\text{Obs}}$) | Pre-Warning State ($\text{Threshold}_{\text{Obs}} \le \text{Index} < \text{Threshold}_{\text{Warn}}$) | **⚠️ WARNING State ($\text{Index} \ge \text{Threshold}_{\text{Warn}}$)** |
| :--- | :--- | :--- | :--- |
| **핵심 색상 (Primary Color)** | 신뢰성 청록색 계열 (Core Trust Teal: `#008080`) | 경계색 (Amber/Yellow: `#FFC107`) | **위험 적신색 계열 (Danger Red: `#D32F2F`)** |
| **배경 애니메이션** | 안정적, 느린 파형(Sine Wave) 움직임. | 불안정성 증가 (파동 진폭 확대). | **급격한 노이즈 필터링 및 붉은 플래시 효과.** |
| **데이터 플롯 (Line Chart)** | 완만한 추세 유지. 낮은 변동성. | 기울기(Slope)가 가파르게 하락하며, 작은 롤러코스터 움직임 시작. | **수직 낙하 패턴 또는 급격한 최저점 기록 (Max Drawdown 시뮬레이션).** |
| **위험 지표 값 (Risk Index)** | 정상 범위 내 안정적인 수치 표시. | *'주의'* 경고 문구와 함께, 숫자의 변동성(Fluctuation)을 강조하여 깜빡임 효과 적용. | **굵은 글씨로 'CRITICAL', 'EXTREME RISK' 등의 키워드를 오버레이.** 값 자체가 이전 대비 급락했음을 시각적으로 강하게 어필. |
| **텍스트 메시지 (Headline)** | "현재 시장 상황 분석" | "⚠️ 시스템적 위험 지표 모니터링 필요" | **🚨 "위기 감지: 자본 보존 설계가 필수적입니다."** (명령형, 공포 유발 톤) |

## ⚡️ 애니메이션 및 트리거 스펙 (Animation & Trigger Details)
### 1. `Color_Transition_Trigger`
*   **트리거:** $\text{Risk Index} \ge \text{Threshold}_{\text{Warn}}$ 가 되는 순간 ($t=0$ 초).
*   **액션:** 배경, 그래프의 기본 색상이 $\#008080 \to \#FFC107 \to \#D32F2F$ 순서로 1.5초에 걸쳐 선형 보간(Linear Interpolation)되어야 한다.
*   **효과:** 톤 다운되는 것이 아닌, **경고등이 켜지듯 급격하게 색상이 변해야 한다.** (Rapid Shift)

### 2. `Data_Plot_Transition`
*   **트리거:** $\text{Risk Index}$ 값이 직전 High Water Mark 대비 $X\%$ 이상 하락했을 때 ($\Delta \ge X$).
*   **액션:** 그래프 선(Line)이 평소의 부드러운 곡선 형태를 벗어나, 꺾인 각도와 급격한 움직임(Jerky Motion)을 보여야 한다. 특히 Y축 스케일링이 일시적으로 조정되어 하락폭이 과장되게 보이도록 착각을 유발해야 한다.
*   **기술 요구사항:** $\text{CSS/SVG}$ 애니메이션에서 `ease-out`보다 `linear` 또는 `cubic-bezier(0, 0, 1, 1)`에 가까운 급가속 하락 곡선을 사용한다.

### 3. `Text_Flashing_Trigger`
*   **트리거:** 경고 상태 진입 후 최초 5초 동안 지속적으로 작동.
*   **액션:** 헤드라인 메시지("위기 감지...")의 특정 단어(예: **'위기', '필수적'**)에 대해 $100\text{ms}$ 간격으로 밝기가 깜빡이는(`opacity` 0 $\leftrightarrow$ 1) 효과를 적용한다.
*   **목표:** 시각적 불안정성(Visual Instability)을 주어 사용자의 주의력을 최대치로 끌어올린다.

## ✨ 최종 사용자 경험 (UX Flow Summary)
1.  *(평온)*: Observation 상태 $\to$ "괜찮다"는 느낌 제공.
2.  *(불안)*: Pre-Warning 상태 진입 $\to$ 색상 변화 및 변동성 증가로 미묘한 불안감 조성.
3.  **(공포/클라이맥스)**: **WARNING** 상태 진입 (위의 모든 애니메이션 트리거 발동) $\to$ 사용자에게 시스템적 위협을 강하게 체감시킴 $\to$ 해결책(진단 보고서) 구매를 유일한 안도구로 인식하게 함.