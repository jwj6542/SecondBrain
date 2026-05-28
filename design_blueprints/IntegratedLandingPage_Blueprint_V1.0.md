# 🌐 통합 랜딩 페이지 최종 설계 사양서 (The Conversion Funnel Blueprint)
## 🎯 목적 및 정의
이 문서는 '붕괴 시그널 예측 서비스'의 마케팅 웹사이트에 삽입될 모든 컴포넌트(Hero, PoC Widget, Pain Point 설명, CTA 등)가 사용자 여정(User Journey)에 따라 어떻게 순차적으로 작동해야 하는지 정의합니다. 개발팀은 이 청사진을 기준으로 프론트엔드 코딩을 진행해야 합니다.

## 🗺️ 전체 구조 및 흐름 (The Flow)
1.  **Hero Section (Hook & Problem):** 공포 자극 $\to$ 제품 소개.
2.  **Pain Point/Why Us?:** 기존 방식의 한계 제시 $\to$ '시스템 회복력' 개념 도입.
3.  **PoC Widget Demo:** 구조적 결함 감지 $\to$ 개입 신호 시뮬레이션 (핵심 증명).
4.  **Solution/Benefit:** 이 시스템이 주는 구체적인 가치 설명.
5.  **CTA Block ($97 Mini Report):** 가장 강력한 구매 유도 지점 및 마감 임박 알림.

---

## 🧱 섹션별 상세 명세 (Section-by-Section Specs)

### 1. Hero Section (스크롤 시 자동 연출)
*   **[Visual Element]**: 메인 헤드라인과 함께, 배경에 잔잔한 '시장 변동성 지표'가 그래프로 움직이는 애니메이션 필수.
*   **[Interaction]**: 사용자가 스크롤을 내릴 때(On Scroll), 슬로건이 텍스트가 아닌 *점진적으로 채워지며* (Typewriter effect) 다음 섹션으로 전환되는 느낌 부여.

### 2. PoC Widget Demo Section (핵심 컴포넌트 - 가장 중요)
*   **[입력값/데이터]**: 가상의 '위험 지수(Risk Index)' 데이터를 시뮬레이션하여 보여줍니다.
    *   **State A (Normal):** 낮은 변동성 $\to$ 게이지가 녹색 영역에 머무름. (안전함)
    *   **State B (Warning/RED Alert Trigger):** 갑작스러운 시장 급변동 발생 시뮬레이션. $\to$ 게이지가 빨간색으로 '급격히' 하강하며, 경고음(Sound Asset required)이 발생합니다. **(사운드 디자인 명세 추가)**
    *   **State C (Intervention/Recovery):** 시스템이 개입하여 지표를 안정화시키는 과정 시각화. $\to$ 그래프가 급격히 평탄화되며, 'System Intervention Detected' 메시지가 팝업됩니다. **(애니메이션 로직 명세 필수)**
*   **[개발 요구사항]**: Widget은 사용자의 마우스 오버/클릭에 따라 State A $\to$ B $\to$ C가 순차적으로 작동하는 데모 루프를 가져야 합니다.

### 3. CTA Block ($97 Mini Report)
*   **[Visual Element]**: 긴장감이 최고조에 달했을 때 (PoC Widget의 Recovery 과정 직후), 시선을 가장 많이 끌 수 있는 대비색(High Contrast Color)을 사용합니다.
*   **[Interaction/Logic]**: "지금 바로 $97 미니 진단 보고서 받기" 버튼은 단순히 링크가 아니며, 클릭 전 **'구매 혜택 목록 (3가지 핵심 질문)'**이 펼쳐지면서 구매의 필요성을 재차 강조해야 합니다.

---
## ✨ 개발자 참고 사항 및 자산 매트릭스
1.  **데이터 연동:** PoC Widget에 사용되는 모든 지표(VIX, Drawdown Rate 등)는 실제 트레이딩 데이터와 동일한 포맷으로 시각화되어야 하며, 주석 처리된 가짜 데이터가 아닌 '실제 시스템 로직'을 따릅니다.
2.  **애니메이션 타이밍:** PoC Widget의 State B $\to$ C 전환은 3초 이내에 강력하고 직관적인 임팩트를 주어야 합니다. (Timing is everything.)