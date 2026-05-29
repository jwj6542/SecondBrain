import React, { useState, useEffect, useCallback } from 'react';
import { StateMachine, IState } from './StateMachine';
import { PoCEngine } from '../Engine/PoCEngine'; // 가상의 엔진 경로
import CrisisDisplay from './CrisisDisplay'; // 경고 시각화 컴포넌트

// Mock 초기 상태 정의 (실제 타입으로 대체 필요)
type WidgetState = 'Normal' | 'Observation' | 'Warning' | 'Crisis';

const PoCWidget: React.FC = () => {
    // 1. State Machine 인스턴스 초기화 및 관리
    const [currentState, setCurrentState] = useState<IState>({ stateId: 'S0', description: '시스템 준비 중...' });
    const [isLoading, setIsLoading] = useState(true);

    // 2. 데이터 시뮬레이션 및 State 업데이트 주기 설정 (Interval)
    useEffect(() => {
        // 초기 로직 실행
        let intervalId: NodeJS.Timeout;
        
        // Simulate Data Fetching and Engine Running
        const runSimulationStep = async () => {
            setIsLoading(true);
            try {
                // 1단계: 엔진을 통해 가상 데이터와 지표 계산 (핵심 로직)
                const simulatedData = PoCEngine.runAnalysis(); // Engine에서 데이터를 받음
                
                // 2단계: State Machine에 데이터 전달하여 새 상태 결정
                const newState = StateMachine.process(currentState, simulatedData);

                // 3단계: 상태 업데이트 및 UI 리렌더링 유도
                setCurrentState(newState);

            } catch (error) {
                console.error("PoC Widget Simulation Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // 초기 로딩 후 1초 뒤부터 주기적으로 실행 시작
        const intervalId = setInterval(() => {
            runSimulationStep();
        }, 3000); // 3초마다 시뮬레이션 업데이트

        return () => clearInterval(intervalId);
    }, [currentState]);


    if (isLoading && !currentState.stateId) return <div className="p-4 text-center">PoC Widget Initializing...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl min-h-[500px] text-white">
            <h2 className="text-3xl font-bold mb-4 border-b border-red-700 pb-2">
                Premium Monitoring Service (PoC Widget)
            </h2>

            {/* 현재 상태 및 요약 정보 표시 영역 */}
            <div className={`p-4 rounded-lg transition-all duration-500 ${currentState.stateId === 'S3' ? 'bg-red-900/80 border border-red-600' : currentState.stateId === 'S2' ? 'bg-yellow-900/70 border border-yellow-600' : 'bg-gray-700'}`}>
                <p className="text-xl font-semibold text-sm uppercase tracking-widest">Current Status: {currentState.stateId}</p>
                <h3 className={`text-4xl mt-1 ${currentState.stateId === 'S3' ? 'text-red-400 animate-pulse' : currentState.stateId === 'S2' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {currentState.description}
                </h3>
            </div>

            <div className="mt-6 space-y-6">
                {/* 상태에 따라 다른 위젯을 렌더링 (핵심 판매 포인트) */}
                {currentState.stateId === 'S3' && <CrisisDisplay />} {/* CrisisDisplay는 CTA를 포함함 */}
                
                {/* 기타 지표 및 데이터 차트가 들어갈 자리 */}
                <div className="bg-gray-700 p-4 rounded">
                    {/* 여기에 Drawdown Rate, Volatility Chart 등 추가 예정 */}
                    <p className="text-sm text-gray-400">📊 Detailed Metrics: {JSON.stringify(currentState.metrics)}</p>
                </div>
            </div>
        </div>
    );
};

export default PoCWidget;