import { SystemState, ApiResponse } from '../core/types/SystemStateType';

/**
 * 핵심 시스템 상태 시뮬레이션 서비스 레이어 (Simulation Service Layer)
 * PoC Widget과 모든 프론트엔드 요소가 호출하게 될 중앙 백엔드 API 모방 코드입니다.
 */
class SimulationService {

    // [1] 현재 시스템 상태 조회: 가장 최근의 단일, 중요한 상태를 반환합니다.
    /** @api/system/status/current */
    static getCurrentStatus(): ApiResponse<SystemState> {
        console.log("-> Calling /api/system/status/current: Retrieving real-time core status...");
        // 실제로는 DB나 캐시(Redis)에서 최신 상태를 가져옵니다.
        const dummyState = { 
            timestamp: new Date().toISOString(), 
            systemId: 'CoreEngine', 
            status: 'STABLE', // 테스트 목적상 STABLE로 시작합니다.
            metricName: 'Overall_Resilience_Index', 
            value: Math.floor(Math.random() * 90) + 70, // 70~150 사이의 높은 값으로 가정
            description: "System stability confirmed. Resilience Index is high.", 
            isAlertTriggered: false 
        };

        return { success: true, message: "Current system state retrieved successfully.", data: [dummyState] };
    }

    // [2] 스트레스 테스트 기록 스트리밍: 시퀀스 데이터 흐름을 모방합니다.
    /** @api/system/history/stream */
    static streamHistoricalData(durationSeconds: number): ApiResponse<SystemState[]> {
        console.log(`-> Calling /api/system/history/stream: Simulating ${durationSeconds}s historical data.`);
        // 실제로는 WebSocket 연결을 통해 시간 순서대로 이벤트를 푸시합니다.
        const history: SystemState[] = [
            { timestamp: new Date(Date.now() - 30000).toISOString(), systemId: 'CoreEngine', status: 'STABLE', metricName: 'Liquidity_Depth', value: 120, description: "Initial stability.", isAlertTriggered: false },
            { timestamp: new Date(Date.now() - 15000).toISOString(), systemId: 'RiskMonitor', status: 'WARNING', metricName: 'Latency_Deviation', value: 45, description: "Warning: Latency deviation detected.", isAlertTriggered: true }, // 경고 발생
            { timestamp: new Date(Date.now() - 5000).toISOString(), systemId: 'CoreEngine', status: 'CRITICAL', metricName: 'Capital_Reserve', value: 12, description: "CRITICAL: Capital reserve hit threshold!", isAlertTriggered: true }, // 임계치 하락 (PoC 위기)
            { timestamp: new Date().toISOString(), systemId: 'CoreEngine', status: 'RECOVERY', metricName: 'Capital_Reserve', value: 50, description: "System successfully stabilized. Recovery initiated.", isAlertTriggered: false } // 복구 완료
        ];
        return { success: true, message: `Successfully streamed ${history.length} historical events.`, data: history };
    }

    // [3] 외부 이벤트 강제 주입 (Fault Injection)
    /** @api/system/simulate/inject */
    static injectFault(faultType: 'DATA_GAP' | 'SPIKE'): ApiResponse<SystemState> {
        console.log(`-> Calling /api/system/simulate/inject: Injecting ${faultType} fault.`);
        if (faultType === 'DATA_GAP') {
            return { success: true, message: "Data gap successfully injected. System status transitioned to WARNING.", data: [{ 
                timestamp: new Date().toISOString(), systemId: 'CoreEngine', status: 'WARNING', metricName: 'Missing_Data_Point', value: 0, description: "Data Gap Detected - Manual intervention required.", isAlertTriggered: true 
            }]};
        } else if (faultType === 'SPIKE') {
            return { success: false, message: "Error: Spike injection failed due to insufficient API privileges.", errorCode: 403 };
        }
        return { success: false, message: "Invalid fault type specified." };
    }

    // [4] 정기적인 시스템 자가 진단
    /** @api/system/health/check */
    static checkSystemHealth(): ApiResponse<{ isHealthy: boolean; warnings: SystemState[] }> {
        console.log("-> Calling /api/system/health/check: Running automated health diagnostics.");
        const isHealthy = Math.random() > 0.2; // 80% 확률로 정상 작동 가정

        if (!isHealthy) {
            return { success: true, message: "System Health Check found anomalies.", data: [{
                timestamp: new Date().toISOString(), systemId: 'HealthMonitor', status: 'WARNING', metricName: 'Core_Integrity', value: 15, description: "Minor integrity warning detected. Monitor advised.", isAlertTriggered: true
            }] };
        } else {
             return { success: true, message: "System Health Check passed. All systems nominal.", data: null };
        }
    }

    // [5] 보고서 생성 요청 (판매 흐름의 최종 단계)
    /** @api/system/report/request */
    static requestReport(contextId: string): ApiResponse<any> {
        console.log(`-> Calling /api/system/report/request: Generating report for context ${contextId}.`);
        // 실제로는 서버에서 복잡한 로직을 돌려 보고서를 생성하고 URL을 반환합니다.
        return { success: true, message: "Report generation request accepted. A detailed analysis will be available shortly.", data: { reportUrl: "/reports/premium-analysis" } };
    }

}

export default SimulationService;