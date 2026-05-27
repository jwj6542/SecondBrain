// LiveDemoScript.tsx - 시스템 복원력 시연 데모의 메인 오케스트레이터
import React, { useState, useCallback } from 'react';
import RSIComponent from './RSIComponent'; // 이미 완성된 컴포넌트 가정
import RecoveryAnimation from './RecoveryAnimation'; // 복구 애니메이션 로직

// 🚨 상태 정의: 공포(Pain) -> 안도(Relief) -> 확신(Certainty)의 흐름을 관리합니다.
type DemoState = 'NORMAL' | 'CRISIS_FEAR' | 'RECOVERY_RELIEF' | 'CERTAINTY';

const LiveDemoScript: React.FC = () => {
    // 초기 상태는 평상시 (Normal)로 설정하여 안정성을 보여줍니다.
    const [currentState, setCurrentState] = useState<DemoState>('NORMAL');
    const [isCrisisActive, setIsCrisisActive] = useState(false);

    // ⚡️ 상태 전이 로직 핸들러
    const handleTriggerCrisis = useCallback(() => {
        console.log("--- [STATE CHANGE] Normal -> Crisis (Fear) ---");
        setCurrentState('CRISIS_FEAR');
        setIsCrisisActive(true);
    }, []);

    const handleStartRecovery = useCallback(() => {
        if (!isCrisisActive) return; // 위기 상태가 아니면 복구 시작 불가
        console.log("--- [STATE CHANGE] Crisis -> Recovery (Relief) ---");
        setCurrentState('RECOVERY_RELIEF');
        // 실제 애플리케이션에서는 여기서 슬라이더 조작 이벤트 등을 처리해야 함
    }, [isCrisisActive]);

    const handleAchieveCertainty = useCallback(() => {
        console.log("--- [STATE CHANGE] Recovery -> Certainty (Certainty) ---");
        setCurrentState('CERTAINTY');
        setIsCrisisActive(false);
        // 최종 목표 달성 시, 모든 지표가 안정화된 상태로 고정됩니다.
    }, []);

    // 🎨 UI 구조: 현재 상태에 따라 보여주는 요소와 메시지가 달라집니다.
    return (
        <div className="demo-container p-8 bg-white shadow-2xl rounded-lg max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#008080]">🛡️ 자본 보존 시스템 시뮬레이터 (V3.0)</h1>

            {/* 1. 상태별 안내 메시지 */}
            <div className={`p-4 rounded-lg mb-6 transition-all duration-500 ${
                currentState === 'CRISIS_FEAR' ? 'bg-red-100 border-l-4 border-red-600 text-red-800' : 
                currentState === 'CERTAINTY' ? 'bg-green-100 border-l-4 border-green-600 text-green-800' : 
                'border-l-4 border-[#008080] bg-gray-50'
            }`}>
                <p className="font-semibold">현재 시스템 상태: {currentState.replace('_', ' ')}</p>
                <p>{currentState === 'CRISIS_FEAR' ? "🚨 위험 경고! 시장의 과도한 변동성으로 자본 손실 임계점에 근접했습니다. 수동 개입이 필요합니다." : 
                 currentState === 'RECOVERY_RELIEF' ? "📈 시스템 복원력이 작동 중입니다. 안정화 과정을 지켜보세요." : 
                 "✅ 시스템 정상 가동. 시장의 노이즈를 필터링하고 자본 보존을 설계합니다."}</p>
            </div>

            {/* 2. 핵심 컴포넌트 통합 영역 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl shadow-inner">
                    {/* RSI 컴포넌트가 현재 상태를 받아와서 색상과 로직을 변경합니다. */}
                    <RSIComponent currentState={currentState} isCrisisActive={isCrisisActive} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    {/* 복원 애니메이션 컴포넌트를 통해 시스템의 회복력을 시각화합니다. */}
                    <RecoveryAnimation isActive={isCrisisActive && currentState !== 'CERTAINTY'} />
                </div>
            </div>

            {/* 3. 사용자 인터랙션 및 스토리텔링 버튼 */}
            <div className="flex justify-between gap-4">
                <button 
                    onClick={handleTriggerCrisis} 
                    disabled={currentState === 'CRISIS_FEAR' || currentState === 'NORMAL'}
                    className={`px-6 py-3 text-lg font-bold rounded transition duration-200 ${
                        currentState === 'NORMAL' ? 'bg-red-600 hover:bg-red-700' : 
                        'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    위기 발생 시뮬레이션 (공포 $\to$)
                </button>

                <button 
                    onClick={handleStartRecovery} 
                    disabled={!isCrisisActive || currentState === 'CERTAINTY'}
                    className={`px-6 py-3 text-lg font-bold rounded transition duration-200 ${
                        (isCrisisActive && currentState !== 'CERTAINTY') ? 'bg-[#008080] hover:bg-[#009999]' : 
                        'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    복구 과정 시뮬레이션 (안도 $\to$)
                </button>

                 <button 
                    onClick={handleAchieveCertainty} 
                    disabled={currentState !== 'RECOVERY_RELIEF'}
                    className={`px-6 py-3 text-lg font-bold rounded transition duration-200 ${
                        currentState === 'RECOVERY_RELIEF' ? 'bg-green-600 hover:bg-green-700' : 
                        'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    시스템 안정화 및 확신 (확신)
                </button>
            </div>
        </div>
    );
};

export default LiveDemoScript;