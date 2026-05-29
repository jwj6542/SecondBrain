/**
 * PoC Widget State Machine Logic
 * 상태 전이 로직과 데이터 바인딩의 핵심을 담당합니다.
 */

// 1. 인터페이스 정의 (TechSpec에서 가져온 것)
interface PoCState {
    timestamp: string; 
    currentState: 'INITIAL' | 'OBSERVATION' | 'WARNING' | 'ANALYSIS_NEEDED' | 'RECOVERY';
    capitalPreservationMetric: number; 
    anomalyScore: number;          
    isThresholdBreached: boolean;  
    errorDetails?: string;         
}

// 2. 전역 임계치 정의 (이 값들은 실제 시장 데이터 분석을 통해 동적으로 결정되어야 함)
const THRESHOLDS = {
    WARN_CAPITAL_PRESERVATION: 0.98, // 경고 시작 지점
    CRISIS_CAPITAL_PRESERVATION: 0.90, // 개입 요구 지점
    ANOMALY_SCORE_THRESHOLD: 0.75     // 이상치 점수 임계치
};

/**
 * 상태 전이 함수 (State Transition Function)
 * @param currentState 현재 시스템 상태
 * @param data 새로운 입력 데이터 스트림
 * @returns 다음 PoCState 객체
 */
export const transitionState = (currentState: PoCState, data: any): PoCState => {
    let newState: 'OBSERVATION' | 'WARNING' | 'ANALYSIS_NEEDED' | 'RECOVERY';

    // --- [Critical Logic Check] ---
    if (data?.capitalPreservationMetric === undefined || isNaN(data.capitalPreservationMetric)) {
        console.error("🚨 ERROR: Missing critical data metric.");
        // 데이터가 아예 없거나 유효하지 않으면, 즉시 분석 개입 요구 상태로 강제 전환하여 실패를 방지합니다.
        return { 
            ...currentState, 
            currentState: 'ANALYSIS_NEEDED', 
            errorDetails: "데이터 스트림에 치명적인 결측이 감지되었습니다. 시스템 재점검이 필요합니다."
        };
    }

    // --- [State Transition Logic] ---
    if (data.capitalPreservationMetric < THRESHOLDS.CRISIS_CAPITAL_PRESERVATION || data.anomalyScore > THRESHOLDS.ANOMALY_SCORE_THRESHOLD) {
        newState = 'ANALYSIS_NEEDED'; // 최우선 실패/위기 트랜지션
    } else if (data.capitalPreservationMetric < THRESHOLDS.WARN_CAPITAL_PRESERVATION) {
        newState = 'WARNING';
    } else if (currentState === 'RECOVERY' && data.capitalPreservationMetric >= 0.99) {
        // Recovery 상태에서 충분히 회복되면 다시 안정화(Observation)로 돌아갈 수 있음
        newState = 'OBSERVATION';
    } 
    else {
        newState = 'OBSERVATION'; // 기본값: 정상 관찰
    }

    // 새로운 상태와 데이터를 조합하여 반환 (실제 구현에서는 복잡한 로직이 추가됨)
    return {
        timestamp: new Date().toISOString(),
        currentState: newState,
        capitalPreservationMetric: data.capitalPreservationMetric || currentState.capitalPreservationMetric,
        anomalyScore: data.anomalyScore || currentState.anomalyScore,
        isThresholdBreached: (newState === 'WARNING' || newState === 'ANALYSIS_NEEDED'),
    };
};

// 초기 상태 정의
export const initialPoCState: PoCState = { 
    timestamp: new Date().toISOString(), 
    currentState: 'INITIAL', 
    capitalPreservationMetric: 1.0, 
    anomalyScore: 0.0, 
    isThresholdBreached: false,
};