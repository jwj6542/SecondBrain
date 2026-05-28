import { MockData } from '../hooks/useMockData'; // 가정: useMockData에서 정의된 타입 사용

/**
 * 시스템의 상태 변화(State Transition)를 기록하고 관리하는 로거 서비스.
 * 이는 모든 중요 이벤트에 대한 불변성(Immutability)과 추적 가능성을 보장합니다.
 */
export class StateTransitionLogger {
    private history: Array<{ timestamp: number; state: string; reason: string; dataSnapshot: any }>;

    constructor() {
        this.history = [];
        console.log("⚙️ [StateTransitionLogger] Initialized. Logging service ready.");
    }

    /**
     * 새로운 상태 전이를 기록합니다.
     * @param {string} newState - 새로운 시스템 상태 (예: 'WARNING', 'CRITICAL').
     * @param {string} reason - 상태가 변경된 구체적인 원인 설명.
     * @param {any} dataSnapshot - 현재 데이터 스냅샷.
     */
    logTransition(newState: string, reason: string, dataSnapshot: any): void {
        const entry = {
            timestamp: Date.now(),
            state: newState,
            reason: reason,
            dataSnapshot: JSON.parse(JSON.stringify(dataSnapshot)), // 깊은 복사본 저장
        };
        this.history.push(entry);
        console.warn(`🚨 [STATE CHANGE] ${newState}: ${reason}. History size: ${this.history.length}`);
    }

    /**
     * 최근 N개의 상태 변화 히스토리를 가져옵니다.
     * @param {number} count - 조회할 기록 개수.
     */
    getHistory(count: number = 5): Array<any> {
        return this.history.slice(-count);
    }

    /**
     * 현재 시스템 상태를 요약하여 반환합니다.
     */
    getCurrentStateSummary(): string {
        if (this.history.length === 0) return "System Initialized: Normal";
        const last = this.history[this.history.length - 1];
        return `Last State: ${last.state} (${new Date(last.timestamp).toLocaleTimeString()})`;
    }
}

export const loggerInstance = new StateTransitionLogger(); // 싱글톤 인스턴스 사용