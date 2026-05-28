// src/components/RecoveryWidget.tsx - Premium Monitoring Service PoC Widget (React/TypeScript)
import React, { useState, useEffect, useMemo } from 'react';
// 실제 환경에서는 데이터를 API 호출 또는 Redux Store에서 가져와야 합니다.
// 여기서는 로컬 스키마 파일을 직접 참조합니다.
import RecoverySchema from '../data/RecoveryEventLog_Schema.json'; 

/**
 * @typedef {Object} DataPoint - 로그 데이터의 개별 지점 (시간, 값 등)
 * @typedef {Array<DataPoint>} LogHistory - 시간 순서로 정렬된 전체 이벤트 로그 배열
 */


// --- Utility Functions ---
/**
 * 가상의 데이터를 로드하고 전처리합니다.
 * 실제 환경에서는 이 함수가 비동기 API 호출을 처리해야 합니다.
 * @returns {LogHistory} 구조화된 데이터 히스토리
 */
const loadAndProcessData = (schema) => {
    // 🚨 중요: JSON 스키마를 기반으로 시뮬레이션 데이터를 생성하거나 필터링합니다.
    console.log("Loading and processing Recovery Event Log data...");
    
    // 임시 데이터 구조화 및 Mocking 로직을 넣습니다.
    return [
        { time: 'T-4h', risk_index: 0.2, capital_ratio: 0.95, status: 'Normal' }, // 초기 상태
        { time: 'T-2h', risk_index: 0.7, capital_ratio: 0.8, status: 'Warning' },
        // --- CRISIS POINT (Red Alert) ---
        { time: 'T-1h', risk_index: 0.95, capital_ratio: 0.6, status: 'Crisis' }, // 시스템 위험 임계치 돌파 지점
        { time: 'T-30m', risk_index: 0.88, capital_ratio: 0.55, status: 'Critical' },
        // --- RECOVERY START POINT (Yellow Alert) ---
        { time: 'T-15m', risk_index: 0.7, capital_ratio: 0.65, status: 'RecoveryStart' }, // 자동 복구 메커니즘 작동 시작 지점
        { time: 'T-10m', risk_index: 0.4, capital_ratio: 0.8, status: 'Improving' },
        // --- CAPITAL PRESERVATION COMPLETE (Green Alert) ---
        { time: 'T-5m', risk_index: 0.2, capital_ratio: 1.0, status: 'Stable' } // 자본 보존 완료 지점
    ].filter(p => p); // 유효성 검사 필터

}


/**
 * 핵심 리스크 시각화 위젯 컴포넌트 (Proof-of-Concept)
 * 이 컴포넌트는 Pitch Deck의 스토리텔링을 위해 설계되었습니다.
 */
const RecoveryWidget: React.FC = () => {
    // 1. 상태 정의: 현재 보고서가 어느 단계에 초점을 맞출지 결정합니다.
    const [currentStage, setCurrentStage] = useState<'Crisis' | 'RecoveryStart' | 'Stable'>('Crisis');

    // 2. 데이터 로드 및 전처리 (useMemo를 사용하여 재렌더링 시 불필요한 계산 방지)
    const processedData = useMemo(() => {
        return loadAndProcessData(RecoverySchema);
    }, []);

    // 3. 현재 단계에 따라 강조할 데이터와 스타일을 결정합니다.
    const getStageConfig = (stage: typeof currentStage) => {
        switch (stage) {
            case 'Crisis':
                return { title: "🚨 위기 발생 지점 진단", description: "시장이 예상치 못한 충격(Black Swan)에 직면했을 때의 시스템 위험 노출도를 보여줍니다.", color: 'bg-red-700', highlightIndex: 2 }; // T-1h
            case 'RecoveryStart':
                return { title: "⚙️ 자가 복구 메커니즘 작동", description: "시스템이 자체 로직을 발동하여 리스크를 통제하고 회복하는 과정을 시뮬레이션합니다.", color: 'bg-yellow-600', highlightIndex: 4 }; // T-15m
            case 'Stable':
                return { title: "✅ 자본 보존 설계 완성", description: "최종적으로 핵심 리스크 지표가 안전 범위 내로 돌아와 자본이 성공적으로 보존되었음을 증명합니다.", color: 'bg-green-700', highlightIndex: 6 }; // T-5m
            default:
                return { title: "", description: "", color: "" };
        }
    };

    const config = getStageConfig(currentStage);
    const highlightedDataPoint = processedData[config.highlightIndex];


    // --- Rendering Logic ---
    return (
        <div className="p-8 bg-gray-50 rounded-xl shadow-2xl max-w-4xl mx-auto font-sans">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Premium Resilience Monitoring Service (PoC)
            </h1>
            <p className="text-lg text-gray-600 border-b pb-4 mb-8">
                위기(Crisis) 발생부터 자본 보존 완료까지, 시스템의 회복력을 정량적으로 증명합니다.
            </p>

            {/* 1. 단계 선택 인터랙션 (Pitch Deck용 컨트롤) */}
            <div className="flex justify-around mb-10 p-2 bg-white rounded-lg shadow-inner">
                {(['Crisis', 'RecoveryStart', 'Stable'] as const).map(stage => {
                    const isActive = currentStage === stage;
                    return (
                        <button 
                            key={stage} 
                            onClick={() => setCurrentStage(stage)}
                            className={`px-6 py-3 text-sm font-medium rounded-lg transition duration-200 ${
                                isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {stage.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    );
                })}
            </div>

            {/* 2. 현재 단계 요약 및 설명 */}
            <div className={`${config.color} p-6 rounded-lg mb-8 text-white shadow-xl transition duration-500`}>
                <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
                <p className="text-md opacity-90">{config.description}</p>
            </div>

            {/* 3. 시각화 영역 (Graph) */}
            <div className="bg-white p-6 border rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    주요 리스크 지표 변화 추이 (Risk Index vs. Time)
                </h3>
                
                {/* 그래프 시뮬레이션 컴포넌트 */}
                <div className="relative h-64 flex items-end justify-around p-2 border-b border-l">
                    {processedData.map((point, index) => {
                        // 포인트 높이와 색상을 리스크 지표(risk_index)에 따라 동적으로 계산합니다.
                        const heightRatio = point.risk_index * 100;
                        let colorClass = 'bg-blue-400';

                        if (point.status === 'Crisis' || point.status === 'Critical') {
                            colorClass = 'bg-red-600'; // 위기 시 빨간색 강조
                        } else if (point.status === 'RecoveryStart' || point.status === 'Improving') {
                            colorClass = 'bg-yellow-500'; // 복구 시작 시 노란색 강조
                        } else if (point.status === 'Stable') {
                             colorClass = 'bg-green-600'; // 안정화 완료 시 녹색 강조
                        }

                        // 현재 선택된 단계의 포인트에 가장 큰 효과를 줍니다.
                        const isHighlighted = index === config.highlightIndex;
                        const highlightStyle = isHighlighted ? 'ring-4 ring-offset-2 ring-indigo-300 scale-[1.1]' : '';

                        return (
                            <div key={index} className="flex flex-col items-center mx-6 relative">
                                {/* 실제 그래프 막대 */}
                                <div 
                                    className={`w-8 transition-all duration-700 ease-out ${highlightStyle}`} 
                                    style={{ height: `${heightRatio}%` }}
                                ></div>
                                
                                {/* 데이터 레이블 (시간) */}
                                <span className="text-sm mt-2 text-gray-500">{point.time}</span>

                                {/* 추가 정보 토스트/팁 구현 가능 영역 */}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 4. 하단 요약 (KPI Display) */}
            <div className="mt-8 flex justify-between text-center p-4 border-t pt-6">
                <div>
                    <p className="text-sm uppercase text-gray-500">최대 낙폭 지표</p>
                    <p className={`text-2xl font-bold ${currentStage === 'Crisis' ? 'text-red-600' : 'text-green-600'}`}>
                        {processedData.find(p => p.status === 'Critical')?.risk_index || 0} (최대)
                    </p>
                </div>
                <div>
                    <p className="text-sm uppercase text-gray-500">복원력 지수 (RSI)</p>
                    {/* 실제 로직은 복잡하므로 Mocking으로 보여줍니다. */}
                    <div className={`text-3xl font-bold ${currentStage === 'Stable' ? 'text-green-600' : 'text-gray-500'}`}>
                        {(currentStage === 'Crisis') ? 'LOW (Danger)' : 'HIGH (Safe)'}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RecoveryWidget;