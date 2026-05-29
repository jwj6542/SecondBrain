# 🧠 System State Manager (The Brain)
/**
 * @description MockWebSocketCore에서 들어오는 원시 데이터를 받아, 비즈니스 로직에 따라 시스템의 현재 상태를 판단하는 모듈.
 * '왜' 위기인지 알려주는 추론 계층입니다.
 */

import { MockWebSocketCore, WSMessage } from '../core/MockWebSocketCore';

export type SystemState = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'RECOVERING';

/**
 * 시스템의 현재 상태를 관리하고 경고 로직을 수행합니다.
 */
export class SystemStateManager {
    private currentState: SystemState = 'NORMAL';
    private core: MockWebSocketCore;

    constructor(core: MockWebSocketCore) {
        this.core = core;
        // 코어의 메시지 이벤트에 자신을 연결하여, 모든 데이터 흐름을 관찰합니다.
        this.core.on('message', this.handleIncomingMessage);
    }

    /** 상태 초기화 및 보고 */
    public get currentState(): SystemState {
        return this.currentState;
    }

    private handleIncomingMessage = (message: WSMessage): void => {
        // 비동기 처리를 위해 실제 환경에서는 Worker Thread 사용을 고려해야 함.
        const newState = this.determineNewState(message);

        if (newState !== this.currentState) {
            console.log(`\n>>> [STATE CHANGE DETECTED] ${this.currentState} -> ${newState}`);
            this.currentState = newState;
            this.executeStateAction(message, newState);
        } else if (['WARNING', 'CRITICAL'].includes(newState)) {
             // 상태 변화가 없더라도, 위기 상황에서는 매번 경고 메시지를 출력하여 긴장감을 유지해야 함.
             console.log(`[System Status] ${String(newState)}: 재확인 필요.`);
        }
    }

    /** 🔍 핵심 비즈니스 로직: 데이터 기반 상태 판별 */
    private determineNewState(message: WSMessage): SystemState {
        const payload = message.payload;
        let state: SystemState = 'NORMAL';

        // 1. 치명적 오류 체크 (Critical Failure)
        if (payload.liquidity_index < 0.2 || payload.credit_spread_delta > 0.4) {
            state = 'CRITICAL';
        } 
        // 2. 경고 상태 체크 (Warning Threshold)
        else if (payload.liquidity_index < 0.5 || payload.credit_spread_delta > 0.15) {
            state = 'WARNING';
        } 
        // 3. 복구 중 상태 체크 (Recovery)
        else if (message.type === 'data' && this.currentState === 'CRITICAL') {
             // 코어에서 Recovery Inject가 들어왔을 때만 임시로 RECOVERING으로 처리
            state = 'RECOVERING';
        } 
        // 4. 정상 상태 유지
        else if (message.type === 'data' && payload.liquidity_index >= 0.7) {
             state = 'NORMAL';
        }

        return state;
    }


    /** 📢 상태 변화에 따른 액션 수행 (UI/API 연동 지점) */
    private executeStateAction(message: WSMessage, newState: SystemState): void {
        let output = '';
        switch(newState) {
            case 'NORMAL':
                output = `[OK] 시스템 안정. LIX=${payload?.liquidity_index.toFixed(2)}, Spread=${payload?.credit_spread_delta.toFixed(3)}. 정상 트레이딩 지속 가능.`;
                break;
            case 'WARNING':
                // 🚨 경고 발생: 사용자에게 즉각적인 불안감 조성 (Pain Point)
                output = `[⚠️ WARNING] 시스템 이상 감지! 유동성 지표 하락 (${payload?.liquidity_index.toFixed(2)}). 신용 스프레드 이탈 주의. 리스크 관리 필요.`;
                break;
            case 'CRITICAL':
                // 💀 위기 발생: 패닉 상태 유도 및 해결책 제시 시점 (The Hook)
                output = `[🚨 CRITICAL FAILURE] 시스템 복구 임계치 도달! 현재 데이터로는 시장 리스크를 추적할 수 없음. 즉각적인 전문 보고서가 필수입니다!`;
                break;
            case 'RECOVERING':
                // ✅ 복구 진행: 해결책 제시의 당위성을 높임
                output = `[✅ STABILIZING] 시스템 안정화 단계 진입. 데이터는 정상화 추세를 보이나, 원인 분석이 필요합니다.`;
                break;
        }

        console.log("-------------------------------------------------");
        console.log(`📊 [STATE HANDLER OUTPUT] 현재 상태: ${newState}`);
        console.log(output);
        console.log("-------------------------------------------------\n");
    }
}