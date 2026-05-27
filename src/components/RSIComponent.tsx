// RSI Component: System Resilience Index Visualization
import React, { useState, useEffect, useCallback } from 'react';
import './RSIComponent.css'; // Styling handled separately
import { useSimulationContext } from '../context/SimulationContext';

/**
 * @typedef {'CRISIS' | 'STABLE' | 'RECOVERING'} SystemState
 */

const RSIComponent = () => {
    // Context에서 시뮬레이터 데이터와 현재 상태를 가져옵니다.
    const { simulateCrisis, currentData, setSystemState } = useSimulationContext();
    
    /** @type {[number, React.Dispatch<React.SetStateAction<number>>]} */
    const [currentRsiValue, setCurrentRsiValue] = useState(50); 
    const [currentState, setCurrentState] = useState('STABLE');

    // === 핵심 로직: 상태 기반 RSI 업데이트 ===
    useEffect(() => {
        if (currentState === 'CRISIS') {
            // 위기 시뮬레이션 시작: 즉각적인 값 하락과 빨간 경고를 트리거
            setCurrentRsiValue(prev => Math.max(10, prev - 5));
            const crisisTimer = setInterval(() => {
                if (currentState === 'CRISIS') {
                    setCurrentRsiValue(prev => Math.max(10, prev - 3));
                } else {
                    clearInterval(crisisTimer);
                }
                // 실제 환경에서는 API 호출을 통해 데이터 업데이트를 유도합니다.
            }, 500);

            return () => clearInterval(crisisTimer);
        } else if (currentState === 'STABLE') {
            // 정상 상태: 부드러운 값 변동과 초기화된 녹색/청록색 톤 유지
             const stableInterval = setInterval(() => {
                setCurrentRsiValue(prev => Math.min(90, prev + (Math.random() - 0.5) * 2));
            }, 1000);
            return () => clearInterval(stableInterval);

        } else if (currentState === 'RECOVERING') {
            // 복구 과정: 위기에서 벗어나 안정적으로 회복하는 애니메이션 구현
             const recoveryInterval = setInterval(() => {
                setCurrentRsiValue(prev => Math.min(95, prev + 7)); // 가파른 상승을 시뮬레이션
            }, 300);
            return () => clearInterval(recoveryInterval);
        }
    }, [currentState]);

    // === 사용자 상호작용 핸들러 ===
    const handleCrisisTrigger = useCallback(() => {
        if (currentState !== 'CRISIS') {
            setCurrentState('CRISIS');
            simulateCrisis(); // Context의 시뮬레이터 함수 호출
        }
    }, [currentState, simulateCrisis]);

    const handleRecoveryAttempt = useCallback(() => {
        // 사용자가 시스템 점검/개선 조치를 취하는 상황을 가정합니다.
        if (currentState === 'CRISIS') {
            setCurrentState('RECOVERING'); 
        } else {
            alert("먼저 위기 상태를 트리거해야 복구 과정이 시작됩니다.");
        }
    }, [currentState]);

    // --- JSX Render Logic ---
    return (
        <div className={`rsi-container ${currentState.toLowerCase()}`}>
            <h2>System Resilience Index (RSI)</h2>
            
            {/* 1. 경고/상태 표시 영역 */}
            <div className="alert-panel">
                <p>{currentState === 'CRISIS' ? "🚨 CRITICAL ALERT: 자본 보존 임계치 이탈!" : 
                                  currentState === 'RECOVERING' ? "⚙️ System Recovery in Progress..." : 
                                  "✅ 시스템 정상 가동 중. 리스크 모니터링 활성화."}</p>
            </div>

            {/* 2. 애니메이션 그래프 및 게이지 영역 */}
            <div className="visualization-area">
                <div className="rsi-chart-placeholder">
                    {/* 실제 그래프 라이브러리 (e.g., Chart.js)가 여기에 통합됩니다. */}
                    <p>Graph Visualization Placeholder: {currentRsiValue.toFixed(1)}</p>
                </div>
                <div 
                    className="rsi-gauge" 
                    style={{ width: `${Math.max(0, Math.min(100, currentRsiValue * 2))}%` }}
                >
                    {/* 게이지 바 */}
                </div>
            </div>

            {/* 3. 상호작용 버튼 */}
            <div className="controls">
                <button onClick={handleCrisisTrigger} disabled={currentState === 'CRISIS'}>
                    위기 발생 시뮬레이션 (Crisis)
                </button>
                <button onClick={handleRecoveryAttempt} disabled={currentState !== 'CRISIS'} style={{ marginLeft: '10px', backgroundColor: '#3498db' }}>
                    복구 절차 실행 (Recover)
                </button>
            </div>

        </div>
    );
};

export default RSIComponent;