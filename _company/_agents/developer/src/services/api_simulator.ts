/**
 * @module api_simulator
 * PoC Widget을 위한 Mock API Endpoints 제공. 실제 백엔드와 통신하는 것처럼 동작하지만,
 * 개발 및 테스트 단계에서 원하는 상태 전이(State Transition)를 강제하여 검증 가능하게 함.
 */

// 💡 핵심: 모든 데이터는 '시스템 자본 보존 능력'에 초점을 맞춘 지표여야 합니다.
export type State = 'NORMAL' | 'FAILURE' | 'RECOVERY';

interface MarketData {
    timestamp: number;
    marketPair: string; // 예: BTCUSD, ETHUSD 등 실제 트레이딩 페어
    resilienceIndexScore: number; // 시스템 복원력 지수 (RSI) - 0~100 사이의 값
    capitalPreservationRatio: number; // 자본 보존 비율 (%)
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface StatePayload {
    state: State;
    data: MarketData;
    message: string;
}

/**
 * @description 가상의 상태 기반 시장 데이터 시뮬레이터.
 * 이 함수는 API 호출을 흉내 내며, 외부 트리거에 의해 state가 결정됩니다.
 */
export const getSimulatedState = (currentState: State): Promise<StatePayload> => {
    console.log(`[API Mock] 요청 상태: ${currentState}`);

    let data: MarketData;
    let message: string;

    switch (currentState) {
        case 'NORMAL':
            // [Trigger Point 1/3: 정상 상태 데이터 바인딩 시작점]
            data = {
                timestamp: Date.now(),
                marketPair: "BTCUSD",
                resilienceIndexScore: Math.min(95, Math.random() * 10 + 85).toFixed(2), // 85~95 (안정적)
                capitalPreservationRatio: (Math.random() * 3 + 97).toFixed(2), // 97% 이상
                riskLevel: 'LOW'
            };
            message = "시스템은 정상 작동 중이며, 자본 보존 원칙에 따라 안정적인 포지션을 유지하고 있습니다.";
            break;

        case 'FAILURE':
            // [Trigger Point 2/3: 블랙 스완 발생 시 데이터 강제 주입]
            data = {
                timestamp: Date.now(),
                marketPair: "BTCUSD",
                resilienceIndexScore: (Math.random() * 10 + 1).toFixed(2), // 1~10 (위기!)
                capitalPreservationRatio: (Math.random() * 5 + 70).toFixed(2), // 70% 이하로 급락
                riskLevel: 'HIGH'
            };
            message = "🚨 경고! 시장의 변동성 임계치를 초과했습니다. 시스템적 위험 신호가 감지되었습니다.";
            break;

        case 'RECOVERY':
             // [Trigger Point 3/3: 복구 로직 작동 및 데이터 바인딩]
            data = {
                timestamp: Date.now(),
                marketPair: "BTCUSD",
                resilienceIndexScore: (Math.random() * 15 + 40).toFixed(2), // 40~55 (복구 과정)
                capitalPreservationRatio: (Math.random() * 10 + 80).toFixed(2), // 상승 시작
                riskLevel: 'MEDIUM'
            };
            message = "✅ 시스템의 자본 보존 로직이 작동했습니다. 위험은 감소하고 안정화가 진행 중입니다.";
            break;

        default:
            throw new Error("유효하지 않은 상태 값입니다.");
    }

    // 실제 API 지연 시간 흉내 (UX 개선 목적)
    return new Promise(resolve => setTimeout(() => resolve({ state: currentState as State, data: data, message: message }), 500));
};