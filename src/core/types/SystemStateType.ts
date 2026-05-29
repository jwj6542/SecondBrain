// SystemState 타입을 정의하여 전체 시스템의 데이터 무결성을 확보합니다.
export type SystemStatus = 'STABLE' | 'WARNING' | 'CRITICAL' | 'RECOVERY';

/**
 * 시스템에서 관찰되는 핵심 상태 기록 구조체.
 */
export interface SystemState {
    timestamp: string;           // UTC 시간 (ISO 8601 포맷 권장)
    systemId: string;             // 이벤트를 발생시킨 모듈/시스템 ID
    status: SystemStatus;         // 현재 시스템 상태 (STABLE, WARNING, CRITICAL, RECOVERY 중 택일)
    metricName: string;           // 관찰된 핵심 지표 이름 (예: 'Liquidity_Depth', 'Latency_Deviation')
    value: number;                // 해당 지표의 측정값
    description: string;          // 상태 변화가 사용자에게 의미하는 설명적 메시지
    isAlertTriggered: boolean;    // 크라이시스 경고 오버레이 발동 여부 플래그 (Frontend Trigger)
}

/**
 * API 호출의 일반적인 성공/실패 페이로드 구조.
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T[]; // 데이터 배열을 담거나, 단일 객체를 포함할 수 있습니다.
    errorCode?: number; // 실패 시 HTTP 상태 코드 매핑 에러 코드
}

// 테스트를 위해 임시 더미 데이터를 내보냅니다.
export const generateDummyState = (status: SystemStatus, metric: string, value: number, isAlert: boolean): SystemState => ({
    timestamp: new Date().toISOString(),
    systemId: 'CoreEngine',
    status: status,
    metricName: metric,
    value: Math.round(Math.random() * 100) + (status === 'CRITICAL' ? 50 : 0), // Critical 상태는 높은 값으로 강제 조정
    description: `System ${status} detected in metric ${metric}. Value is ${value}.`,
    isAlertTriggered: isAlert,
});