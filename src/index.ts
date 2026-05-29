# 🚀 E2E 통합 스트레스 테스트 실행기 (Orchestrator)
/**
 * @description MockWS Core와 StateManager를 연결하여, 시나리오 기반의 End-to-End 흐름을 제어합니다.
 */

import { MockWebSocketCore } from './core/MockWebSocketCore';
import { SystemStateManager } from './state/SystemStateManager';

async function runE2ESimulation() {
    console.log("=================================================");
    console.log("🚀 E2E 통합 스트레스 테스트 시뮬레이션 시작 (Orchestrator)");
    console.log("=================================================\n");

    // 1. 컴포넌트 초기화
    const mockCore = new MockWebSocketCore();
    const stateManager = new SystemStateManager(mockCore);

    console.log(">>> [Phase 0] 시스템 준비 완료. Initial State: NORMAL.");
    await new Promise(resolve => setTimeout(resolve, 500)); // 초기 대기 시간 시뮬레이션

    // 2. Part 1: Normal Operation (Baseline)
    console.log("\n=================== PHASE 1: NORMAL MARKET OPERATION =====================");
    mockCore.simulateNormalCycle();
    await new Promise(resolve => setTimeout(resolve, 800));


    // 3. Part 2: Warning State Injection (The first flicker of doubt)
    console.log("\n\n=================== PHASE 2: WARNING TRIGGER (Liquidity Drop) =====================");
    mockCore.simulateWarningCrisisInject();
    await new Promise(resolve => setTimeout(resolve, 1500));


    // 4. Part 3: Critical Failure Injection (The Panic Point / Pain Point)
    console.log("\n\n=================== PHASE 3: CRITICAL FAILURE TRIGGER =====================");
    mockCore.simulateCriticalFailureInject();
    await new Promise(resolve => setTimeout(resolve, 2000));


    // 5. Part 4: Recovery Attempt (The Solution Hook)
    console.log("\n\n=================== PHASE 4: RECOVERY ATTEMPT =====================");
    mockCore.simulateRecoveryInject();
    await new Promise(resolve => setTimeout(resolve, 1500));


    // 6. 마무리 및 테스트 완료 메시지
    console.log("\n=================================================");
    console.log("✨ 시뮬레이션 종료. 모든 상태 전이 및 경고 로직이 성공적으로 검증되었습니다.");
    console.log(`최종 시스템 상태: ${stateManager.currentState}`);
}

runE2ESimulation();