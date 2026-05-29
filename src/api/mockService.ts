// Mock API Contract: PoC Widget State Management and Data Simulation
import { EventEmitter } from 'events';

/**
 * @typedef {'NORMAL' | 'WARNING' | 'CRISIS'} SystemState
 * @typedef {object} MarketData
 * @property {number} volatilityIndex - 실시간 변동성 지수 (0-100)
 * @property {number} drawdownPercentage - 누적 최대 낙폭 (%)
 * @property {boolean} isAlertBlinking - 경고 신호 활성화 여부
 */

/**
 * PoC Widget의 모든 상태 전이와 가상 데이터 스트림을 관리하는 싱글톤 Mock Service.
 * 실제 백엔드 호출 없이, 테스트 용도로만 사용합니다.
 */
class MockMarketDataService extends EventEmitter {
    constructor() {
        super();
        this._state = 'NORMAL'; // 초기 상태: 정상
        console.log("⚡️ [Mock Market Data Service] Initialized.");
    }

    /**
     * 시스템의 가상 상태를 설정하고 이벤트 리스너를 발생시킵니다. (테스트용)
     * @param {SystemState} newState - 새로운 시스템 상태 ('NORMAL', 'WARNING', 'CRISIS').
     */
    setMockState(newState) {
        if (!['NORMAL', 'WARNING', 'CRISIS'].includes(newState)) {
            throw new Error("Invalid system state provided.");
        }
        this._state = newState;
        console.log(`[MOCK API] State transitioned to: ${newState}`);
        // 상태 변화를 전역적으로 알림
        this.emit('stateChange', this._state);
    }

    /**
     * 현재 가상 시장 데이터를 반환합니다. (Mock Data)
     * @returns {MarketData}
     */
    getCurrentMarketData() {
        let volatilityIndex;
        let drawdownPercentage;
        let isAlertBlinking = false;

        switch (this._state) {
            case 'NORMAL':
                volatilityIndex = Math.random() * 30 + 10; // 10 ~ 40
                drawdownPercentage = Math.random() * 5; // 0% ~ 5%
                break;
            case 'WARNING':
                volatilityIndex = Math.random() * 40 + 50; // 50 ~ 90
                drawdownPercentage = Math.random() * 10 + 7; // 7% ~ 17%
                isAlertBlinking = true;
                break;
            case 'CRISIS':
                volatilityIndex = Math.random() * 60 + 80; // 80 ~ 140 (극단적)
                drawdownPercentage = Math.random() * 25 + 20; // 20% ~ 45% (치명적)
                isAlertBlinking = true;
                break;
        }

        return {
            volatilityIndex: parseFloat(volatilityIndex.toFixed(2)),
            drawdownPercentage: parseFloat(drawdownPercentage.toFixed(2)),
            isAlertBlinking: isAlertBlinking,
        };
    }
}

// 싱글톤 인스턴스 사용 (전역 상태 관리)
export const marketDataService = new MockMarketDataService();