// 핵심 위젯 컴포넌트: 상태 로직 및 시각적 피드백 구현
import React, { useState, useEffect } from 'react';
import useMockData from '../hooks/useMockData';
import './PoCWidget.css'; // CSS 파일이 필요합니다

type SystemMetrics = {
    timestamp: number;
    vixIndex: number;
    correlationCoefficient: number;
    systemHealthScore: number;
};

// 1. 상태 정의 (State Machine)
type WidgetState = 'Normal' | 'Warning' | 'Critical' | 'Recovery';

/**
 * 데이터 기반으로 시스템의 현재 위험 상태를 판단하는 로직입니다.
 */
const determineState = (metrics: SystemMetrics): { state: WidgetState; message: string } => {
    // 1차 조건: 종합 건강 점수 확인
    if (metrics.systemHealthScore < 40) return { state: 'Critical', message: "🚨 시스템 임계치 이탈! 즉각적인 자본 보존 조치가 필요합니다." };
    // 2차 조건: VIX 지표 폭발 여부 확인
    if (metrics.vixIndex > 30 || metrics.correlationCoefficient < 0.4) {
        return { state: 'Critical', message: "🔥 구조적 붕괴 임박! 변동성 및 상관관계가 통제 범위를 벗어났습니다." };
    }
    // 3차 조건: 경고 수준 진입 (VIX 상승 또는 점수 하락)
    if (metrics.systemHealthScore < 70 || metrics.vixIndex > 20) {
        return { state: 'Warning', message: "⚠️ 시스템 불안정 감지. 리스크 관리를 강화하고 모니터링을 지속해야 합니다." };
    }
    // 기본 상태
    return { state: 'Normal', message: "✅ 정상 작동 범위 내에 있습니다. 자본 보존 원칙을 유지하세요." };
};

/**
 * 글리치 효과를 시뮬레이션하는 컴포넌트 (CSS 애니메이션 의존)
 */
const GlitchEffect = () => (
    <div className="glitch-overlay"></div>
);


const PoCWidget: React.FC = () => {
    // Mocking Service 연결
    const metrics = useMockData({ timestamp: Date.now(), vixIndex: 15, correlationCoefficient: 0.7, systemHealthScore: 92 });
    
    // 상태 계산 및 변화 감지
    const [currentState, setCurrentState] = useState<{ state: WidgetState; message: string }>({ state: 'Normal', message: '' });

    useEffect(() => {
        const newStateInfo = determineState(metrics);
        setCurrentState(newStateInfo);
    }, [metrics]);


    // 상태에 따른 스타일 및 효과 결정 로직
    const getStatusStyles = (state: WidgetState) => {
        switch (state) {
            case 'Normal': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' }; // Green
            case 'Warning': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' }; // Yellow/Amber
            case 'Critical': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' }; // Red - 고강도 경고 배경
            default: return { color: '#6B72HD', bg: 'rgba(107, 114, 208, 0.1)' };
        }
    };

    const statusStyle = getStatusStyles(currentState.state);

    return (
        <div className="poc-widget-container">
            {/* 🚨 글리치 효과는 Critical 상태에만 적용하여 공포감을 극대화합니다 */}
            {currentState.state === 'Critical' && <GlitchEffect />}
            
            <div className="status-indicator" style={{ backgroundColor: statusStyle.bg, border: `2px solid ${statusStyle.color}` }}>
                <h3 style={{ color: statusStyle.color }}>[ {currentState.state} 상태 ]</h3>
                <p>{currentState.message}</p>
            </div>

            {/* 실시간 지표 테이블 */}
            <div className="metrics-panel">
                <h4>📊 핵심 시스템 지표 (Mock Data)</h4>
                <table className="data-table">
                    <tr>
                        <th>VIX Index</th>
                        <td style={{ color: metrics.vixIndex > 25 ? 'red' : '#3B82F6' }}>{metrics.vixIndex}</td>
                    </tr>
                    <tr>
                        <th>상관관계 계수 (ρ)</th>
                        <td style={{ color: metrics.correlationCoefficient < 0.5 ? 'orange' : '#10B981' }}>{metrics.correlationCoefficient}</td>
                    </tr>
                     <tr>
                        <th>종합 건강 점수</th>
                        <td style={{ color: metrics.systemHealthScore < 60 ? 'red' : '#1D4ED8' }}>{metrics.systemHealthScore} / 100</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default PoCWidget;