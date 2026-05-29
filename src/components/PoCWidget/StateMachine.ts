// IState 인터페이스 및 State Machine 로직 정의 (Designer 사양 기반)
import { SimulationData } from '../Engine/PoCEngine';

export interface IState {
    stateId: 'S0' | 'S1' | 'S2' | 'S3' | 'Action Required';
    description: string; // 사용자에게 보여줄 핵심 메시지
    colorClass: string;   // UI 색상 결정용
    metrics: any;         // 현재 상태의 측정 지표값
}

/**
 * PoC Widget의 중앙 제어 장치 (Controller)
 * 외부 데이터(SimulationData)를 받아 다음 상태(IState)로 전이시키는 역할.
 */
export const StateMachine = {
    process: (currentState: IState, data: SimulationData): IState => {
        let nextStateId: 'S0' | 'S1' | 'S2' | 'S3' | 'Action Required';
        let description: string;
        let colorClass: string;

        // 🚨 핵심 로직: 데이터 기반 상태 전이 결정 (Designer v3.0 사양 구현)
        if (data.cumulativeDrawdown > data.threshold.critical || data.volatilityIndex > data.threshold.high) {
            nextStateId = 'S3'; // Crisis 발생
            description = "🚨 시스템적 생존력 임계점 초과! 즉각적인 전문가 진단이 필요합니다.";
            colorClass = "bg-red-900/80 border-red-600";

        } else if (data.cumulativeDrawdown > data.threshold.mid || data.volatilityIndex > data.threshold.medium) {
            nextStateId = 'S2'; // Warning 발생
            description = "⚠️ 경고: 시스템에 이상 징후가 포착되었습니다. 리스크 관리에 집중해야 합니다.";
            colorClass = "bg-yellow-900/70 border-yellow-600";

        } else if (data.cumulativeDrawdown > data.threshold.low) {
            nextStateId = 'S1'; // Observation 발생
            description = "🔍 주의: 평소와 다른 변동성을 보입니다. 시장을 면밀히 관찰하세요.";
            colorClass = "bg-blue-900/60 border-blue-600";

        } else {
            nextStateId = 'S0'; // Normal 상태 유지
            description = "✅ 현재는 안정적입니다. 시스템은 정상 범위 내에서 작동 중입니다.";
            colorClass = "bg-gray-700";
        }


        return {
            stateId: nextStateId as any,
            description: description,
            colorClass: colorClass,
            metrics: data // 모든 지표를 첨부하여 디버깅 용이하게 함.
        };
    },
};

export type SimulationData = {
    cumulativeDrawdown: number;
    volatilityIndex: number;
    // ... 기타 필요한 지표들
};