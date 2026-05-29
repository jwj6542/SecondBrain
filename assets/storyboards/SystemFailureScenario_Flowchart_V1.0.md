# ⚙️ 시스템 실패 시나리오 조건부 흐름도 (Storyboard Spec V1.0)

**[목적]**: PoC Widget의 기술적 가치를 극대화하고, 사용자의 불안감(Pain Point)을 체계적으로 증폭시킨 후, $97 보고서를 통한 '시스템 복구' 과정을 설득력 있게 연출한다.
**[주요 키워드]**: 유동성 급감 (Liquidity Drop), 신용 스프레드 이탈 (Credit Spread Deviation), 시장 리스크 (Systemic Risk).
**[총 예상 길이]**: 4:00 ~ 5:30 분량의 핵심 시퀀스.

---

## 🎬 Part 1: 안정적인 오프닝 및 기대감 조성 (Time: 00:00 - 01:00)
*   **목표**: 현재의 트레이딩 방식이 '불완전하다'는 공통적 문제 인식을 심어준다.
*   **분위기**: 차분함 $\to$ 의문 제기 (Dark Tone 유지).

| Timecode | 시각 요소 / 화면 구성 | 시스템 로그 출력 (PoC Widget) | 내레이션/대사 (톤앤매너: 전문가적, 위협적) |
| :--- | :--- | :--- | :--- |
| 00:00 - 00:30 | [A] 일반적인 차트 화면 (수많은 지표들). 다양한 트레이더들이 거래하는 모습의 모션 그래픽. | `[INFO]: Market Monitoring Active.`<br>`[STATUS]: Standard Volatility Profile.` | "대부분의 분석은 가격 움직임에만 집중합니다. 물론 중요하죠. 하지만 시장이 진짜로 무너지는 지점은, 차트가 보여주지 않는 곳에서 시작됩니다." |
| 00:30 - 01:00 | [B] PoC Widget UI 등장 (Observability Panel). 평소에는 모든 로그가 `[OK]` 상태를 표시. 리스크 지표(유동성, 스프레드)들이 미세하게 움직이는 애니메이션 강조. | `[INFO]: Liquidity Index: 0.98...`<br>`[INFO]: Credit Spread Delta: Normal.` | "우리는 이 패널을 통해 '보이지 않는' 시스템의 건강 상태를 모니터링합니다. 이게 바로, 진짜 리스크 관리입니다." (자신감 고조) |

## 🎬 Part 2: 경고 단계 진입 및 불안감 증폭 (Time: 01:00 - 02:30)
*   **목표**: PoC Widget의 핵심 기능(리스크 감지)을 발동시켜, 기존 방식으로는 대응 불가능한 '위험' 상황을 연출한다.
*   **분위기**: 긴장감 $\uparrow$ (경고음/붉은색 강조).

| Timecode | 시각 요소 / 화면 구성 | 시스템 로그 출력 (PoC Widget) | 내레이션/대사 |
| :--- | :--- | :--- | :--- |
| 01:00 - 01:30 | [A] 평온하던 패널의 일부 지표(유동성, 스프레드)에 노란색 경고 오버레이가 점진적으로 퍼진다. 배경 사운드가 낮게 깔리는 톤으로 변조된다. | `[WARN]: Liquidity Index dropping below threshold (0.95).` <br>`[WARN]: Correlation Divergence detected.` | "자, 이제 시장 상황이 달라지고 있습니다. 평소에는 무시되던 작은 신호들. 유동성 지표가 급격히 떨어진다는 경고입니다." |
| 01:30 - 2:00 | [B] **Crisis Alert Overlay (Yellow/Orange)**가 화면 전체에 깜빡이며 강하게 표시된다. 주요 리스크 지표(예: 스프레드)의 값이 '급락'하는 그래프 애니메이션이 강조됨. | `[ALERT]: CRITICAL LIQUIDITY THRESHOLD BREACH.`<br>`[ERROR]: Market Depth Insufficient for current volume.` <br>*(디자이너 v2.0 사양에 따른 글리치/플리커 효과가 적용되어야 함)* | "이건 단순히 '하락장'이라는 단어로는 설명할 수 없는 문제입니다. 시스템 자체가 멈추기 직전의 불안정성입니다. 차트 지표만으로는 이 공포를 포착할 수 없습니다." (공포 유발 극대화) |
| 2:00 - 2:30 | [C] **Crisis Alert Overlay (Red)**가 화면을 완전히 장악한다. 모든 시스템 로그가 `[FATAL]` 메시지로 도배되며, '데이터 무결성' 관련 경고가 반복된다. | `[!!!]: SYSTEM STRESS LEVEL CRITICAL.`<br>`[FAIL]: Unable to validate underlying data structure.` <br>*(스크린에 붉은색 노이즈와 에러 코드가 난무하는 연출)* | "지금 시장은, 시스템적 위험(Systemic Risk) 구간에 진입했습니다. 당신의 현재 전략과 지식만으로는 이 혼란을 헤쳐나갈 수 없습니다." (가장 큰 Pain Point 제시) |

## 🎬 Part 3: 문제 제기 및 솔루션 연결 (CTA Trigger) (Time: 2:30 - 4:00+)
*   **목표**: 시스템의 불안정성이 곧 '정보의 부족'에서 오는 것임을 논리적으로 설득하고, $97 보고서를 유일한 해답으로 제시한다.
*   **분위기**: 절망 $\to$ 희미한 빛 (해결책).

| Timecode | 시각 요소 / 화면 구성 | 시스템 로그 출력 (PoC Widget) | 내레이션/대사 (톤앤매너: 안도감, 권위적 확신) |
| :--- | :--- | :--- | :--- |
| 2:30 - 3:00 | [A] 모든 경고와 에러가 갑자기 '정지'하며 화면이 어두워진다. (일시 정지 효과). 화질 저하/노이즈 제거 과정 연출. | `[PAUSED]: System Stability Check Required.`<br>`[STATUS]: Missing comprehensive risk data set.` | "우리가 직면한 문제는 기술적 문제가 아니라, '정보 구조'의 문제입니다. 당신에게는 이 시스템을 통제할 수 있는 기준 자체가 없는 겁니다." (문제의 본질 정의) |
| 3:00 - 3:45 | [B] 화면 한쪽에 $97 보고서 커버 이미지가 나타난다. 마치 **‘시스템 패치 파일’**처럼 디자인되고, 녹색/청록색(`--color-trust`)으로 안정화되는 애니메이션이 적용된다. | `[APPLYING PATCH]: Comprehensive Risk Modeling Module v1.0.`<br>`[SUCCESS]: System Integrity Restored.` | "진정한 생존력은 '지금 아는 것'이 아니라, 시스템의 근본적인 불안정성을 예측하고 대비하는 구조에 달려있습니다. 이 패치 파일을 통해... 비로소 시장을 통제할 기준을 얻게 됩니다." (솔루션 제시) |
| 3:45 - End | [C] 화면 전체가 청록색(`--color-trust`)으로 안정화되며, $97 보고서의 주요 내용(예: 리스크 지표 대시보드)이 깨끗하게 전면 노출된다. **CTA 버튼**이 명확히 강조됨. | `[COMPLETE]: Capital Preservation Protocol Activated.`<br>`[ACTION REQUIRED]: Purchase Report to continue monitoring.` | "지금, 시장의 위협 속에서 당신의 자본을 지킬 유일한 방법은, 시스템 자체를 재정립하는 것입니다. 더 이상 '운'에 맡기지 마십시오." (강력한 CTA) |

---