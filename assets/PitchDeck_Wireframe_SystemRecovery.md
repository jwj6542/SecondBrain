# Premium Monitoring Service: 시스템 복원력 시뮬레이터 와이어프레임 (v1.0)

## 🎯 개요
*   **목표:** 기능 나열이 아닌, '위기 $\to$ 자가 복구'의 서사적 증명.
*   **핵심 경험:** 사용자 인터랙션 기반 스토리보드 전개.
*   **활용 데이터 소스:** stress_test_event_schema.json (코다리 제공)

## 📐 섹션별 디자인 가이드라인

### 1. Global KPI Snapshot (좌측 상단)
*   **제목:** 자본 보존 지수 (Capital Preservation Index: CPI)
*   **디자인:** 대형 게이지 차트. 목표 범위(Green Zone)가 가장 넓게 보이도록 시각화.
*   **텍스트 오버레이:** "Max Drawdown 대비 회복력 $98\%$"

### 2. Time-Series Resilience Graph (중앙 메인)
*   **유형:** Multi-line Area Chart.
*   **색상 규칙:**
    *   기본 상태: Teal Gradient (`#004D40` $\to$ `#388E3C`)
    *   위기 발생: Crimson Red Line/Area Fill (Failure Point)
    *   복구 진행: Orange $\to$ Forest Green Transition Area
*   **인터랙션 정의:**
    1.  마우스 오버 시: 해당 시간대의 `max_drawdown` 값과 `current_risk_score`를 툴팁으로 즉시 표시.
    2.  클릭 시: 우측의 [이벤트 상세 분석] 패널을 완전히 열어 스토리보드 모드로 전환.

### 3. 이벤트 상세 분석 및 스토리보드 (우측 사이드바/모달)
*   **제목:** [Timestamp] - 시스템 자가 복구 과정 디테일
*   **디자인 구조:** 타임라인 기반의 수직 플로우(Vertical Flow). 애니메이션으로 연출될 내용임을 명시.

| 단계 | 제목 (Heading) | 설명 텍스트 (Body Copy) | 시각 요소/애니메이션 (Visual Element) |
| :--- | :--- | :--- | :--- |
| **FAILURE** | 시스템 오류 감지: $X\%$ 낙폭 발생 | "외부 시장 충격으로 인해 초기 자본이 급감했습니다. 일반적인 트레이딩 시스템은 이 지점에서 마비됩니다." | 빨간색 배경의 'ERROR' 텍스트 오버레이. 그래프 하락 애니메이션(강제). |
| **FAILOVER** | 자동 복구 로직 작동 (Failover) | "저희 시스템은 사전에 정의된 $N$개의 안전 모듈을 순차적으로 가동하여 자본 흐름을 임시 안정화합니다." | 주황색/노란색 경고 애니메이션. 'Process Initiated' 배지 표시. |
| **RECOVERY** | 리스크 조정 및 회복 (Stabilization) | "리스크 지표를 기반으로 포트폴리오의 비중을 재조정하고, 안전 자산에 대한 선제적 할당을 실행합니다." | Green Gradient로 상승하는 그래프 애니메이션. 'Process Step 1 $\to$ Process Step 2' 순차 진행 박스. |
| **SUCCESS** | 안정 상태 도달 (Certainty Achieved) | "자본 보존 설계가 성공적으로 작동하여, 시스템은 초기 대비 $Y\%$의 손실을 방어하며 정상화되었습니다." | 녹색 배경에 'STABLE STATE REACHED' 배지와 함께 평탄한 Green Area 그래프 유지. |

---
**[핵심 액션 포인트]**
*   이 와이어프레임은 반드시 **인터랙티브 프로토타입(Figma)**으로 구현되어야 하며, 중앙의 클릭-우측 패널 전환 플로우가 핵심 성공 지표입니다.