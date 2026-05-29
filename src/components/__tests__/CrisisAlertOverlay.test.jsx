import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useMockWebSocket from '../../hooks/useMockWebSocket';
import CrisisAlertOverlay from '../CrisisAlertOverlay/CrisisAlertOverlay';

// Mocking the hook to simulate external state control for testing purposes.
jest.mock('../../hooks/useMockWebSocket', () => ({
    __esModule: true,
    default: jest.fn(), // Mocked default export
}));


describe('🔥 CrisisAlertOverlay Component E2E Integration Test', () => {
    let mockUseMockWebSocket;

    beforeEach(() => {
        // 테스트 전후로 모킹된 훅의 상태를 초기화합니다.
        mockUseMockWebSocket = require('../../hooks/useMockWebSocket').default;
        jest.clearAllMocks();
    });


    // --- TEST CASE 1: Normal State (기본 작동 검증) ---
    it('should NOT render critical overlay when system is operating normally', () => {
        // Mock Hook Setup: 정상 상태로 강제 설정
        mockUseMockWebSocket.mockReturnValue({
            state: { isCriticalFailure: false, severityCode: 'OK' },
            triggerError: jest.fn(),
        });

        // 컴포넌트 렌더링 시, 외부로부터의 state를 Mocking하여 전달합니다.
        render(<CrisisAlertOverlay isCriticalFailure={false} severityCode="OK" />);

        // 검증: 'CRITICAL FAILURE'라는 텍스트가 DOM에 존재하지 않아야 함
        expect(screen.queryByText(/CRITICAL FAILURE/i)).toBeNull();
    });


    // --- TEST CASE 2: Critical State Trigger (핵심 기능 테스트) ---
    it('should render full alert overlay and apply animation when critical threshold is breached', async () => {
        const MOCK_ERROR = 'THRESHOLD_BREACH_95P';

        // Mock Hook Setup: 위기 상황을 시뮬레이션하는 함수를 준비합니다.
        mockUseMockWebSocket.mockReturnValue({
            state: { isCriticalFailure: true, severityCode: MOCK_ERROR },
            triggerError: jest.fn(),
        });
        
        // 1. 초기 렌더링 (위기 발생)
        render(<CrisisAlertOverlay isCriticalFailure={true} severityCode={MOCK_ERROR} />);

        // 검증 A: 'CRITICAL FAILURE' 메시지가 나타나야 함 (텍스트 확인)
        expect(screen.getByText(/SYSTEM CRITICAL FAILURE DETECTED/i)).toBeInTheDocument();
        
        // 검증 B: 애니메이션 클래스가 DOM에 적용되어야 함 (CSS 연동 확인)
        const overlayElement = screen.getByRole('alert'); // role을 가정하고 쿼리합니다.
        expect(overlayElement).toHaveClass('crisis-active');

    });


    // --- TEST CASE 3: State Transition and Recovery Flow (E2E 통합 흐름 테스트) ---
    it('should transition from active alert back to normal state after simulated recovery', async () => {
        const MOCK_ERROR = 'API_TIMEOUT';

        // 이 테스트는 시간 지연(setTimeout)을 다루므로 jest.useFakeTimers()를 사용합니다.
        jest.useFakeTimers(); 

        // 초기 상태: 위기 발생 (테스트 시작점)
        mockUseMockWebSocket.mockReturnValue({
            state: { isCriticalFailure: true, severityCode: MOCK_ERROR },
            triggerError: jest.fn(),
        });

        // 컴포넌트 렌더링 및 초기 상태 확인
        render(<CrisisAlertOverlay isCriticalFailure={true} severityCode={MOCK_ERROR} />);
        expect(screen.getByText(/CRITICAL FAILURE/i)).toBeInTheDocument();


        // 시간 경과 시뮬레이션 (5초 후 복구)
        await act(async () => {
            jest.advanceTimersByTime(5001); // 500ms + 여유시간
        });

        // 상태가 정상으로 돌아왔다고 가정하고 컴포넌트 강제 리렌더링 (실제 앱에서는 Context/State 변화로 처리됨)
        mockUseMockWebSocket.mockReturnValue({
            state: { isCriticalFailure: false, severityCode: 'OK' }, // Mocked state change
            triggerError: jest.fn(),
        });

        // 리렌더링 후 검증: 애니메이션과 경고 메시지가 사라져야 함
        const container = screen.getByRole('alert'); 
        expect(container).not.toHaveClass('crisis-active');
        expect(screen.queryByText(/CRITICAL FAILURE/i)).toBeNull();

    });
});