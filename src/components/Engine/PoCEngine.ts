// 데이터 시뮬레이션 및 모든 지표 계산을 전담하는 모듈 (가정된 백엔드/로직)
import { SimulationData } from './PoCWidget.tsx'; // 타입 참조

/**
 * 시스템의 현재 상태를 판단하기 위해 가상의 시장 데이터를 분석하고 핵심 지표를 반환합니다.
 */
export const PoCEngine = {
    runAnalysis: (): SimulationData => {
        // 시뮬레이션 로직: 시간에 따라 Drawdown과 Volatility를 점진적으로 악화시키도록 설계
        const timeElapsed = Math.random() * 10; // 0~10 사이의 가상 시간 경과

        let cumulativeDrawdown: number;
        let volatilityIndex: number;

        // 시뮬레이션 흐름 제어 (예시: 5초 후 Warning 발생)
        if (timeElapsed < 3) {
            cumulativeDrawdown = Math.random() * 0.01 + 0.005; // 낮은 리스크
            volatilityIndex = Math.random() * 0.1 + 0.05;  // 안정적 변동성
        } else if (timeElapsed < 7) {
             cumulativeDrawdown = Math.random() * 0.03 + 0.02; // Warning 직전
             volatilityIndex = Math.random() * 0.2 + 0.15;  // 변동성 증가
        } else {
            // Crisis 상태를 유도하는 데이터 폭발 (이 부분이 가장 중요함)
            cumulativeDrawdown = Math.random() * 0.15 + 0.1; // Drawdown 급증
            volatilityIndex = Math.random() * 0.3 + 0.25;  // 변동성 임계치 초과
        }

        return {
            cumulativeDrawdown: parseFloat(cumulativeDrawdown.toFixed(4)),
            volatilityIndex: parseFloat(volatilityIndex.toFixed(4)),
            threshold: {
                low: 0.01, // S0 -> S1 임계치
                mid: 0.03, // S1 -> S2 임계치
                high: 0.1, // S2 -> S3 임계치 (Critical)
                medium: 0.15,
                critical: 0.1,
            }
        };
    }
};