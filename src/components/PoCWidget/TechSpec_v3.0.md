# ⚙️ PoC Widget: 기술적 구현 사양서 (Technical Specification v3.0)

**[작성 목적]**
본 문서는 Designer가 제공한 인터랙티브 데모 블루프린트(V3.0)를 기반으로, 프론트엔드 개발팀이 `PoCWidget` 컴포넌트를 **실시간 데이터 바인딩 및 상태 전이 로직**에 따라 구현할 수 있도록 하는 최종 기술 명세서입니다. 단순 UI 정의가 아닌, 시스템적 안정성을 코드로 증명하는 데 초점을 맞춥니다.

---

## 🎯 1. 아키텍처 개요: State Machine 기반 설계
PoC Widget은 **상태 머신(State Machine)** 패턴을 핵심으로 사용해야 합니다. 데이터 변화에 따라 컴포넌트의 전체 로직과 UI가 매끄럽게 전환되어야 하며, 각 상태는 명확한 입력(Input) 트리거와 출력(Output Action)을 가져야 합니다.

### 1.1. 정의된 상태 (States)
| State ID | 이름 | 설명 및 목표 | 필수 데이터 바인딩 | 트랜지션 조건 (Trigger) |
| :---: | :---: | :--- | :--- | :--- |
| `INITIAL` | 초기 로딩/준비 | 컴포넌트 마운트. 백그라운드에서 환경 데이터 수집 및 유효성 검사 수행. | N/A (Loading State) | ✅ Data Source Ready |
| `OBSERVATION` | 정상 관찰 상태 | 시장 데이터를 평온하게 보여줌. 시스템적 경고가 없음. 목표: 사용자의 주의를 유지하며 배경 정보를 제공하는 것이 주 목적. | `LiveMarketData`, `CapitalPreservationMetric` (정상 범위) | ⚠️ Warning Threshold Breach |
| `WARNING` | 위기 경고 상태 | 핵심 지표(예: 변동성, 자본 보존율)가 사전에 정의된 임계치($T_{warn}$)를 벗어남. 공포감 유발 시작. **'분석 필요성'을 제시.** | `LiveMarketData`, `CapitalPreservationMetric` (임계치 초과), `AnomalyScore` (증가 추세) | 🚨 Crisis Threshold Breach / ⚙️ User Interaction |
| `ANALYSIS_NEEDED` | 분석 개입 요구 상태 | 가장 중요한 단계. 위기 경고를 넘어, 시스템적 문제가 발생했음을 명확히 인지시킴. '이것을 알기 위해선 전문가의 도움이 필요하다'는 논리를 구조화하여 $97 보고서 CTA로 유도함. | `SystemFailureIndicator` (실패 지표), `RequiredAnalysisType`, `InterventionPrompt` (핵심 문구) | 🟢 User Conversion / 🔴 System Recovery |
| `RECOVERY` | 시스템 복원/안정화 | 위기 상황을 진단하고, 사용자가 보고서 구매 등의 조치를 취했을 때. '통제 가능한 상태'로 전환됨을 강조. | `RecoveryProgressMetric`, `ConfidenceScore` (회복 속도) | 📈 Stabilization Achieved |

---

## ⚙️ 2. 데이터 인터페이스 및 바인딩 로직 (Data Contracts)
모든 컴포넌트는 다음의 표준화된 Props/API를 통해 데이터를 받아야 합니다. 이는 테스트 용이성을 극대화합니다.

### 2.1. 핵심 상태 데이터 구조 (`PoCState`)
```typescript
interface PoCState {
    // 시스템 전역 시간 (UTC 기준)
    timestamp: string; 
    // 현재 시스템의 논리적 상태 (위에서 정의한 State ID 중 하나)
    currentState: 'INITIAL' | 'OBSERVATION' | 'WARNING' | 'ANALYSIS_NEEDED' | 'RECOVERY';
    // 자본 보존 지표 (핵심 판매 지표)
    capitalPreservationMetric: number; // 예: 0.95 (1.0에 가까울수록 좋음)
    anomalyScore: number;          // 최근 데이터 변동성 및 이상치 점수 (0.0 ~ 1.0)
    isThresholdBreached: boolean;  // 임계값(T_warn 또는 T_crisis)을 벗어났는지 여부
    errorDetails?: string;         // 오류 발생 시 상세 설명 (Failure Case용)
}
```

### 2.2. 데이터 바인딩 로직 규칙
1. **실시간 업데이트 빈도:** `WARNING` 상태 진입 전까지는 5초 간격, `WARNING` 상태 이상으로는 1~3초 간격으로 데이터를 업데이트해야 합니다. (사용자 긴장감 유지 목적).
2. **임계치 계산:** 임계치는 고정값이 아니어야 하며, 시장의 평균 변동성($\sigma$)을 기반으로 동적으로 설정되어야 합니다. 예를 들어, $T_{warn} = \mu - 2\sigma$ 로 정의하는 것이 기술적 근거가 됩니다.
3. **상태 전이 우선순위:** `Crisis Threshold Breach`는 무조건 `ANALYSIS_NEEDED`로의 최우선 트랜지션을 유발해야 합니다.

---

## 🐛 3. 통합 테스트 스위트 명세 (The Resilience Test Plan)
가장 중요한 부분입니다. 이 테스트들은 단순히 "성공적인 흐름"만 검증하는 것이 아니라, **시스템이 깨질 수 있는 모든 지점(Failure Mode)**을 강제 주입하여 시스템의 '회복력' 자체를 코드로 증명해야 합니다.

### 3.1. 필수 테스트 케이스 (Test Coverage Matrix)
| Test Case ID | 시나리오 제목 | 입력 데이터 조건 | 기대 결과 (`Expected State`) | 검증 목표 |
| :---: | :---: | :---: | :---: | :---: |
| **TC-001** | 정상 흐름 (Happy Path) | `Observation` 상태, 모든 지표가 안정적. | `OBSERVATION` 유지, UI 업데이트 빈도 일정. | 기본 기능 구현 확인. |
| **TC-002** | 경고 발생 (Warning Trigger) | `AnomalyScore`가 $T_{warn}$를 초과함. | `WARNING` 상태로 트랜지션, 경고 시각화 요소 활성화, 데이터 업데이트 속도 증가. | 임계치 감지 및 초기 경보 발동 확인. |
| **TC-003** | **위기 상황 강제 주입 (Crisis Failure)** | `CapitalPreservationMetric`이 $T_{crisis}$ 이하로 급락하거나, 외부 API가 5초 이상 연결 끊김(Null Data)을 반환함. | **즉시 `ANALYSIS_NEEDED` 상태 진입.** 경고 메시지 외에 '데이터 신뢰성 부족' 경고 표시. | 가장 중요한 논리 흐름과 강제 전환 로직 검증. |
| **TC-004** | 예외: 데이터 결측 처리 (Data Gap) | `LiveMarketData`가 특정 시간대(예: 새벽 3시)에 연속으로 `null` 데이터를 반환함. | 시스템이 경고 없이, '데이터 수집 지연' 메시지를 표시하며 `OBSERVATION` 상태를 유지하거나, 제한된 기간 후 `WARNING`으로 전환해야 함. | 안정성과 결측치 처리 로직 검증 (가장 중요). |
| **TC-005** | 예외: 비정상적 스파이크 (Outlier Spike) | 지표 값이 물리적으로 불가능한 범위(예: 10,000% 상승)의 이상치를 단발성으로 수신함. | 시스템이 해당 데이터를 필터링하고(`Filter`), `AnomalyScore`를 일시적으로 높여 경고(Warning)로 유도하는 로직을 보여야 함. | 입력 데이터 검증 및 안정화 로직 검증. |
| **TC-006** | 복구 확인 (Recovery Check) | 사용자가 CTA 클릭 후, 시뮬레이션 데이터를 통해 `CapitalPreservationMetric`이 $T_{recovery}$ 이상으로 회복됨을 반영함. | `RECOVERY` 상태로 전환되며, '회복률' 지표가 점진적으로 상승하는 애니메이션 구현 확인. | 최종 판매 플로우의 완성도 검증. |

---
## 📝 개발팀 가이드라인 및 다음 단계 (Developer Handoff)

1. **핵심 모듈 분리:** `PoCWidget` 컴포넌트 내부에서 상태 전이 로직(`StateMachine.js`)과 데이터 시각화 로직(`DataVisualizer.js`)을 반드시 분리하세요.
2. **API Mocking 우선:** 실제 백엔드 API가 완성되기 전까지는, 위 테스트 케이스에 정의된 `PoCState` 인터페이스를 가진 **Mock Hook**을 사용하여 프론트엔드 개발을 진행해야 합니다.
3. **테스트 주도 개발 (TDD):** 이 Tech Spec과 테스트 스위트 명세서를 바탕으로 먼저 실패하는 테스트 코드를 작성한 후, 이를 통과시키는 방식으로 컴포넌트를 구축할 것을 강력히 권장합니다.