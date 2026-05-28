import React, { useState, useEffect } from 'react';
import { getSimulatedState, State, MarketData } from '../services/api_simulator';

// --- Mocking Endpoint Simulation Component (UI 로직 분리) ---
const StatusIndicator: React.FC<{ score: number; level: string }> = ({ score, level }) => {
    let colorClass = 'bg-gray-400'; // 기본값
    if (level === 'LOW') colorClass = 'bg-green-500';
    else if (level === 'MEDIUM') colorClass = 'bg-yellow-500';
    else if (level === 'HIGH') colorClass = 'bg-red-600 animate-pulse';

    return <div className={`p-3 rounded-lg shadow-inner ${colorClass} text-white`}>
        <p className="text-sm opacity-80">위험 레벨</p>
        <h3 className="text-2xl font-bold">{level}</h3>
    </div>;
};

// --- 메인 컴포넌트: 상태 전이 로직 담당 ---
const ResilienceDashboard: React.FC = () => {
    // 초기 상태는 NORMAL로 설정하고, 이를 관리하는 state machine을 구현합니다.
    const [currentState, setCurrentState] = useState<State>('NORMAL');
    const [data, setData] = useState<MarketData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 상태를 강제로 변경하고 데이터를 가져오는 핵심 로직
    const handleStateTransition = async (newState: State) => {
        if (isLoading || currentState === newState) return;
        setIsLoading(true);
        setCurrentState(newState);
        try {
            // 🚀 API Mocking Endpoints 호출 지점!
            const result = await getSimulatedState(newState);
            setData(result.data);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 마운트 시 기본 데이터 로딩 및 상태 변화를 위한 useEffect 설정
    useEffect(() => {
        // 컴포넌트가 로드되면 1초 후 '위기'를 유도하여 데모 시작 (사용자 경험 최적화)
        const timer = setTimeout(() => handleStateTransition('FAILURE'), 1000);
        return () => clearTimeout(timer);
    }, []);


    // --- UI 렌더링 로직 ---

    const renderDashboardContent = () => {
        if (!data) return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;

        // 자본 보존 능력(CPR)에 따른 시각적 경고 표시 (애니메이션 트리거 지점)
        const isCrisis = data.resilienceIndexScore < 30; // 임계값 설정
        const crisisClass = isCrisis ? 'border-4 border-red-600 shadow-2xl animate-shake' : 'border-4 border-green-500';

        return (
            <div className={`p-8 rounded-xl transition-all duration-1000 ${crisisClass}`}>
                <h2 className="text-3xl font-extrabold mb-6">📈 실시간 시스템 복원력 지수 (RSI)</h2>
                <p className="mb-6 text-lg text-gray-600">현재 상태: <span className={`font-bold ${currentState === 'FAILURE' ? 'text-red-700' : 'text-green-700'}`}>{currentState}</span></p>

                {/* 1. 핵심 지표 게이지 (RSI) */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">시스템 복원력 지수 (RSI Score): {data.resilienceIndexScore}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-6 relative">
                        {/* 애니메이션 트리거: RSI 값에 따라 채워지는 게이지 */}
                        <div 
                            className={`h-6 rounded-full transition-all duration-1000 ease-out ${data.resilienceIndexScore > 50 ? 'bg-green-500' : data.resilienceIndexScore > 20 ? 'bg-yellow-500' : 'bg-red-600'}`}
                            style={{ width: `${Math.min(100, parseFloat(data.resilienceIndexScore) * 1.5)}%` }} // 최대 폭을 100%로 제한하고 시각적 충격을 주어 표현
                        ></div>
                    </div>
                </div>

                 {/* 2. 자본 보존율 및 리스크 레벨 모듈 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatusIndicator score={parseFloat(data.capitalPreservationRatio)} level={'N/A'} /> {/* Placeholder for CPR visualization */}
                     {/* 자본 보존 비율 (CPR) 시각화: 가장 중요! */}
                    <div className="p-3 rounded-lg shadow-inner bg-blue-500 text-white">
                        <p className="text-sm opacity-80">자본 보존율 (CPR)</p>
                        <h3 className="text-2xl font-bold">{data.capitalPreservationRatio}%</h3>
                    </div>
                     <StatusIndicator score={Math.random()} level={data.riskLevel} />
                </div>

                 {/* 3. 상태별 메시지 및 CTA */}
                <div className="p-4 bg-gray-50 rounded border-l-4" style={{ borderColor: currentState === 'FAILURE' ? '#dc2626' : '#16a34a' }}>
                    <p className="font-bold text-lg mb-1">🚨 시스템 분석 보고</p>
                    <p>{data.message}</p>
                </div>
            </div>;
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-2xl rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-2">✨ PoC Widget: 시스템 복원력 시뮬레이터</h1>

            {/* 상태 전이 트리거 버튼 */}
            <div className="flex justify-center space-x-6 mb-10 p-4 bg-gray-50 rounded-lg shadow-inner">
                <button 
                    onClick={() => handleStateTransition('NORMAL')} 
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-bold transition duration-200 ${currentState === 'NORMAL' ? 'bg-green-700 text-white shadow-md' : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-400'}`}
                >
                    [1] 정상 상태 (Normal)
                </button>
                <button 
                    onClick={() => handleStateTransition('FAILURE')} 
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-bold transition duration-200 ${currentState === 'FAILURE' ? 'bg-red-700 text-white shadow-md' : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-400'}`}
                >
                    [2] 위기 발생 (Failure)
                </button>
                <button 
                    onClick={() => handleStateTransition('RECOVERY')} 
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-bold transition duration-200 ${currentState === 'RECOVERY' ? 'bg-yellow-700 text-white shadow-md' : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-400'}`}
                >
                    [3] 복구 과정 (Recovery)
                </button>
            </div>

            {/* 메인 대시보드 영역 */}
            {isLoading ? (
                <div className="text-center text-xl p-10 animate-pulse">⚙️ 데이터 및 시스템 상태를 로딩 중입니다... 잠시만 기다려주세요.</div>
            ) : (
                renderDashboardContent()
            )}

             {/* CTA 블록: 여기서 $97 보고서 구매로 연결 */}
            <div className="mt-12 text-center p-6 border-t pt-8">
                 <p className="text-xl font-semibold mb-4">이러한 '시스템 복원력' 분석은 일반 트레이더가 절대 알 수 없습니다.</p>
                <button 
                    onClick={() => alert("진단 보고서 구매 페이지로 이동합니다.")}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-12 rounded-full text-lg transition duration-300 shadow-lg transform hover:scale-105"
                >
                    지금, 자본 보존 능력을 진단받기 ($97)
                </button>
            </div>

        </div>
    );
};

export default ResilienceDashboard;