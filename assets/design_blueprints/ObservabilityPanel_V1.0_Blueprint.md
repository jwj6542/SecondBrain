# Observability Panel: System Resilience Trace Blueprint (v1.0)

## 🎯 디자인 목표
PoC Widget의 E2E 테스트 결과를 '기술적 증거'로 시각화하여, 시스템의 예측 능력을 넘어선 **블랙 스완 상황에서의 복원력(Resilience)**을 입증한다.

## 🎨 컬러 팔레트 (HEX)
*   Baseline/Safety: #0A3824 (딥 그린/네이비)
*   Stress Spike: #CC6633 (경고 오렌지)
*   Failure Point: #B02828 (강렬한 레드)
*   Recovery Path: #3399CC (신뢰 블루)

## 📐 구성 요소별 상세 사양

### 1. Overview Graph (상단 - 메인 스토리텔링 영역)
*   **유형:** 다중 지표를 통합한 시계열 그래프 (Time-Series Multi-Indicator Chart).
*   **애니메이션 요구사항:** Stress $\to$ Failure $\to$ Recovery 과정이 최소 5초 이상 걸쳐 점진적으로 연출되어야 함. 특히 Failure Point에서 시스템 전체가 일시적으로 어두워지는(Dimming) 효과를 주어 위기감을 극대화해야 함.
*   **핵심 지표:** Stability Index (S_i), Max Drawdown Rate, API Latency 등 복합적인 가상의 지표 3가지 필수 포함.

### 2. Observable Log & Fault Markers (중앙 - 기술적 증거 제시)
*   **트리거:** 그래프 상의 특정 시간(Time Stamp) 클릭 시 활성화.
*   **구조:** 타임라인 형식으로, 실패 발생 전/후의 이벤트 로그를 나열한다.
    *   `[시간]` $\rightarrow$ `[원인 컴포넌트]` $\rightarrow$ `[발생 오류] (Severity: CRITICAL)` $\rightarrow$ `[시스템 반응]`
*   **예시 로그:** `10:32:15 - API Gateway - Timeout Error (CRITICAL) -> Failover Module Activated. Latency Spike Detected.`

### 3. Recovery Mechanism Explained (하단/사이드 - 해결책 제시 및 CTA 연결)
*   **역할:** 시스템이 어떻게 문제를 해결했는지, 그 **과정(Process)**을 단계별로 설명한다.
*   **콘텐츠 흐름:**
    1.  **Problem Definition:** (What failed?) 실패 원인을 간결하게 요약.
    2.  **Solution Process:** (How did it recover?) 시스템이 자가 복구한 메커니즘(예: 백업 경로 우회, 지표 재계산)을 애니메이션 플로우 차트와 함께 설명.
    3.  **The Gap & CTA:** "위의 과정은 이론적 시뮬레이션입니다. 실제 시장에서 이러한 극한 상황에 대비하려면 $97 보고서가 필수적인 실전 가이드라인을 제공합니다."로 자연스럽게 연결한다.

---