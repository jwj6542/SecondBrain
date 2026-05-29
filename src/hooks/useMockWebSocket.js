import { useState, useEffect } from 'react';

/**
 * @hook useMockWebSocket
 * 실제 WebSocket 연결을 Mocking하여 시스템 상태 변화를 시뮬레이션합니다.
 * 이를 통해 컴포넌트가 외부 데이터 스트림에 반응하는지 테스트할 수 있습니다.
 * 
 * @param {boolean} initialFailure - 초기 강제 실패 여부 (테스트용).
 * @returns {{ state: object, triggerError: (code: string) => void }} 현재 시스템 상태와 오류 발생 트리거 함수.
 */
const useMockWebSocket = (initialFailure = false) => {
    // 시스템의 'Observability' 상태를 관리합니다.
    const [state, setState] = useState({
        isConnected: true,
        isCriticalFailure: initialFailure, // 초기 실패 플래그 설정 가능
        lastObservedData: null,
        errorMessage: '',
        severityCode: 'OK',
    });

    // 외부에서 오류를 강제 주입하는 함수 (테스트 핵심)
    const triggerError = (code) => {
        console.warn(`[MockWS] 🚨 Error Triggered: ${code}`);
        setState(prevState => ({
            ...prevState,
            isCriticalFailure: true,
            errorMessage: `DataStreamError [${code}]`,
            severityCode: code,
        }));

        // 5초 후 '복구' 시나리오를 자동 실행하여 테스트 흐름을 만듭니다.
        setTimeout(() => {
             console.info(`[MockWS] ✅ Recovery Simulated.`);
             setState(prevState => ({
                ...prevState,
                isCriticalFailure: false,
                errorMessage: '',
                severityCode: 'OK',
            }));
        }, 5000);
    };

    // 실제 연결 로직 대신 상태만 반환합니다.
    useEffect(() => {
        return () => {
            console.log("MockWebSocket cleanup complete.");
        };
    }, []);

    return { state, triggerError };
};

export default useMockWebSocket;