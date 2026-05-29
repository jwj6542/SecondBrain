# ⚙️ Mock WebSocket Core (The Simulation Engine)
/**
 * @description 실제 데이터 스트림 대신, 통제된 시나리오 기반의 데이터를 발행하는 코어 모듈.
 * E2E 테스트 및 PoC Widget 데모 환경을 구축합니다.
 * 이 클래스는 외부 API 호출 없이 내부적으로 상태를 제어할 수 있습니다.
 */

export type WSMessage = {
    timestamp: number;
    type: 'data' | 'warning' | 'critical'; // 메시지 타입 정의
    payload: Record<string, any>;         // 실제 데이터 (유동성, 스프레드 등)
};

/**
 * MockWebSocketCore 클래스. 데이터 스트림을 에미트합니다.
 */
export class MockWebSocketCore {
    private listeners: ((message: WSMessage) => void)[];

    constructor() {
        console.log("✅ [MockWS] Core Initialized. Ready to simulate system events.");
    }

    /** 리스너를 등록하여, 시스템 상태 변화에 반응하는 로직을 연결합니다. */
    public on(event: 'message', callback: (message: WSMessage) => void): () => void {
        this.listeners.push(callback);
        console.log(`✅ [MockWS] Event listener registered for message.`);
        return () => { 
            // Cleanup function (실제 환경에서 유용)
            const index = this.listeners.indexOf(callback);
            if (index !== -1) {
                this.listeners.splice(index, 1);
                console.log(`⚠️ [MockWS] Listener removed.`);
            }
        };
    }

    /** 모든 리스너에게 메시지를 발행합니다. */
    private emit(message: WSMessage): void {
        const messageClone: WSMessage = { ...message }; // 원본 보호
        this.listeners.forEach(callback => callback(messageClone));
    }

    /** 📊 Step 1: Normal Operation 시뮬레이션 (기본 상태) */
    public simulateNormalCycle(): void {
        const message: WSMessage = {
            timestamp: Date.now(),
            type: 'data',
            payload: {
                liquidity_index: Math.random() * 0.2 + 0.8, // 0.8 ~ 1.0 (정상 범위)
                credit_spread_delta: Math.random() * 0.05 + 0.01, // 정상 변동폭
                market_volatility: 'LOW'
            }
        };
        this.emit(message);
    }

    /** 🚨 Step 2: Warning State 강제 주입 (임계치 경고) */
    public simulateWarningCrisisInject(): void {
        console.warn("\n\n=========================================");
        console.warn("🔥 [MOCK INJECT] WARNING STATE TRIGGERED: Liquidity approaching critical.");
        console.warn("=========================================\n");

        const message: WSMessage = {
            timestamp: Date.now(),
            type: 'warning', // 경고 타입으로 명시적 분류
            payload: {
                liquidity_index: 0.5 + Math.random() * 0.1, // 0.5 ~ 0.6 (위험 범위)
                credit_spread_delta: 0.2 + Math.random() * 0.1, // 증가된 스프레드
                market_volatility: 'MEDIUM'
            }
        };
        this.emit(message);
    }

    /** 💀 Step 3: Critical Failure 강제 주입 (시스템 오류) */
    public simulateCriticalFailureInject(): void {
        console.error("\n\n=========================================");
        console.error("💥 [MOCK INJECT] CRITICAL FAILURE TRIGGERED: Systemic Risk Detected!");
        console.error("=========================================\n");

        const message: WSMessage = {
            timestamp: Date.now(),
            type: 'critical', // 치명적 오류 타입으로 명시적 분류
            payload: {
                liquidity_index: Math.random() * 0.1,  // 매우 낮음 (0 ~ 0.1)
                credit_spread_delta: 0.5 + Math.random() * 0.2, // 극단적으로 높음
                market_volatility: 'CRITICAL'
            }
        };
        this.emit(message);
    }

    /** ✅ Step 4: Recovery/Patch 시뮬레이션 (복구 성공) */
    public simulateRecoveryInject(): void {
         console.log("\n\n=========================================");
         console.log("🛡️ [MOCK INJECT] RECOVERY ATTEMPT: Applying Patch & Stabilizing...");
         console.log("=========================================\n");

        const message: WSMessage = {
            timestamp: Date.now(),
            type: 'data', // 복구 후에는 다시 일반 데이터 흐름을 따라야 함
            payload: {
                liquidity_index: 0.9 + Math.random() * 0.1, // 안정화된 높은 값
                credit_spread_delta: 0.05 + Math.random() * 0.02, // 정상 변동폭으로 복귀
                market_volatility: 'NORMAL'
            }
        };
        this.emit(message);
    }
}