/**
 * @fileoverview PoC Widget Engine과 Mocking Service 간의 통합 테스트 스위트.
 * 목표: 성공, 경고, 위기(Crisis), 그리고 모든 실패/예외 상황에서의 시스템 복원력 검증.
 */

import { PoCWidgetEngine } from '../services/PoCWidgetEngine';
// 가상의 API 클라이언트 역할을 하는 MockingService를 임포트한다고 가정합니다.
import * as MockingService from './MockingService'; 

describe('🚀 [Integration Test Suite] Resilience Testing (통합 테스트)', () => {
    let widgetEngine: PoCWidgetEngine;

    beforeAll(() => {
        widgetEngine = new PoCWidgetEngine();
        // 초기화 및 환경 설정 로직...
    });

    afterEach(() => {
        jest.clearAllMocks(); // MockingService 호출 기록 초기화
    });

    describe('✅ 1. 정상 작동 시나리오 (Success Path)', () => {
        it('정상 데이터 수신 시, 위기 경보가 발생하지 않고 안정적인 상태를 유지해야 한다.', async () => {
            // Mocking Service 설정을 'Normal' 모드로 설정
            MockingService.setSimulationMode('NORMAL'); 

            const result = await widgetEngine.processData(await MockingService.fetchMarketData());

            expect(result).toHaveProperty('status', 'STABLE'); // 상태는 안정적이어야 함
            expect(result).not.toHaveProperty('crisis_alert'); // 경고가 없어야 함
        });
    });

    describe('⚠️ 2. 조건부 변화 시나리오 (State Transition)', () => {
        it('VIX 임계치 초과 데이터를 받으면, 엔진은 즉시 "Warning" 상태로 전환해야 한다.', async () => {
            // Mocking Service 설정을 'WARNING' 모드로 설정 (VIX spike 데이터 주입)
            MockingService.setSimulationMode('WARNING'); 

            const result = await widgetEngine.processData(await MockingService.fetchMarketData());

            expect(result).toHaveProperty('status', 'PRE_ALERT'); // PRE_ALERT 상태 확인
            expect(result).toHaveProperty('warning_message'); // 경고 메시지 존재 확인
        });

        it('위기 발생 조건이 충족되면, 엔진은 즉시 "CRISIS" 상태로 전환하며 복구 로직을 시작해야 한다.', async () => {
            // Mocking Service 설정을 'CRISIS' 모드로 설정 (Black Swan 데이터 주입)
            MockingService.setSimulationMode('CRISIS'); 

            const result = await widgetEngine.processData(await MockingService.fetchMarketData());

            expect(result).toHaveProperty('status', 'CRISIS'); // 위기 상태 확인
            expect(result).toHaveProperty('resilience_score'); // 복원력 지수 측정 시작 확인
        });
    });

    describe('💣 3. 시스템 실패 시나리오 (Resilience Test)', () => {
        it('API 서버가 다운되어 호출이 실패할 경우, 엔진은 에러 처리를 하고 이전의 안정 상태를 유지해야 한다.', async () => {
            // Mocking Service 설정을 'API_FAIL' 모드로 설정 
            MockingService.setSimulationMode('API_FAIL'); 

            const result = await widgetEngine.processData(await MockingService.fetchMarketData());

            expect(result).toHaveProperty('status', 'ERROR_HANDLED'); // 에러 처리 상태 확인
            expect(result).not.toHaveProperty('crisis_alert'); // 경고를 내보내지 않아야 함 (과잉 반응 방지)
        });

        it('네트워크 연결이 끊기거나 타임아웃될 경우, 엔진은 재연결 로직을 수행하고 사용자에게 명확히 알려야 한다.', async () => {
            // Mocking Service 설정: 실제로 Promise가 Reject되도록 강제 (Network Timeout Simulation)
            MockingService.setSimulationMode('TIMEOUT'); 

            await expect(widgetEngine.processData(await MockingService.fetchMarketData())).rejects.toThrow(/Connection Timed Out/); 
            // 실제로는 catch 블록에서 처리 후, 재연결 시도 로그를 남겨야 함을 검증해야 함.
        });
    });
});