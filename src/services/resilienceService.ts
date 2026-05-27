/**
 * @module resilienceService
 * @description 시스템 복원력 지수(RSI) 계산 및 애니메이션 파라미터 제공 서비스 레이어.
 * 모든 프론트엔드 및 백엔드가 이 모듈을 통해 '복원력' 개념에 접근해야 합니다.
 */

/**
 * 가상의 스트레스 테스트 데이터를 기반으로 시스템 복원력을 시뮬레이션합니다.
 * @param initialValue 초기 RSI 값 (예: 10)
 * @param crisisMagnitude 위기 발생의 강도 (스파이크 크기, 예: -30)
 * @returns {object} 복원력 관련 데이터 구조
 */
export const simulateResilience = (initialValue: number, crisisMagnitude: number): { peakRsi: number; recoverySteps: Array<{ step: number; rsi: number; stabilityFactor: number }>; } => {
    // 1. 위기 발생 시점의 최대 낙폭(Peak) 계산 (최소값으로 설정)
    const peakRsi = Math.min(initialValue, initialValue + crisisMagnitude);

    let currentRsi = peakRsi;
    const recoverySteps: Array<{ step: number; rsi: number; stabilityFactor: number }> = [];

    // 2. 복구 과정 시뮬레이션 (예시: 5단계의 안정화 과정을 거침)
    for (let i = 1; i <= 5; i++) {
        // Recovery Factor 계산: 매 단계마다 이전보다 높은 값으로 회복하는 경향을 반영합니다.
        const recoveryRate = Math.pow(0.9, i); // 안정화가 느려지도록 감쇠 효과 적용
        currentRsi += (1 - recoveryRate) * 5; // 목표치에 도달하기 위해 점진적으로 상승
        
        recoverySteps.push({
            step: i,
            rsi: Math.max(20, currentRsi), // RSI는 최소치를 유지하도록 보장
            stabilityFactor: (i / 5) * 100 + 10, // 안정화 계수는 증가하는 형태로 정의
        });
    }

    return { peakRsi: peakRsi, recoverySteps };
};

/**
 * 애니메이션을 위한 주요 파라미터들을 제공합니다. (Designer가 참조할 사양서)
 * @param crisisLevel 위기 수준 ('High', 'Medium', 'Low')
 * @returns {object} 색상 팔레트 및 임팩트 강도 정의
 */
export const getCrisisAesthetics = (crisisLevel: 'High' | 'Medium' | 'Low'): { primaryColor: string; warningOpacity: number; animationDurationMs: number } => {
    switch (crisisLevel) {
        case 'High':
            return { 
                primaryColor: '#8B0000', // 진한 빨강 (공포감 극대화)
                warningOpacity: 1.0, 
                animationDurationMs: 2000 // 긴 시간 동안 경고 유지
            };
        case 'Medium':
            return { 
                primaryColor: '#FF8C00', // 주황색 (주의 단계)
                warningOpacity: 0.7, 
                animationDurationMs: 1500
            };
        default:
            return { primaryColor: '#3CB371', warningOpacity: 0.2, animationDurationMs: 800 }; // 청록색 (안정감)
    }
};

export type ResilienceData = {
    peakRsi: number;
    recoverySteps: Array<{ step: number; rsi: number; stabilityFactor: number }>;
};