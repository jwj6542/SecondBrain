import React, { useState, useEffect } from 'react';
// API 시뮬레이터 및 기타 컴포넌트 임포트 가정
import { getSimulatedDataPoint, setSystemState } from '../services/api_simulator'; 
import CrisisView from './CrisisView';
import AnalysisView from './AnalysisView';
import RecoveryView from './RecoveryView';

// 정의된 상태 상수 (Enum 역할)
const STATUS = {
    CRISIS: 'crisis',       // 초기 공포 자극 단계
    ANALYSIS: 'analysis',   // 시스템 분석 및 원리 설명 단계
    RECOVERY: 'recovery'    // 해결책(시스템 복구) 제시 단계
};

/**
 * PoC Widget의 메인 컴포넌트. 3단계 상태 전이를 관리합니다.
 * 이 컴포넌트는 모든 비즈니스 로직과 상태 관리를 담당하는 핵심입니다.
 */
const PoCWidget: React.FC = () => {
    // 현재 시스템 상태를 관리 (Crisis -> Analysis -> Recovery)
    const [currentStatus, setCurrentStatus] = useState(STATUS.CRISIS); 
    const [dataHistory, setDataHistory] = useState([]);

    // API 시뮬레이터와 연동하여 주기적으로 데이터 업데이트 및 상태 변화를 트리거합니다.
    useEffect(() => {
        let interval;
        if (currentStatus === STATUS.CRISIS) {
            // 위기 상황: 2초마다 데이터를 강제 업데이트하며 '빨간 경고' 유지
            interval = setInterval(() => {
                const dataPoint = getSimulatedDataPoint(true); // Crisis Mode Data
                setDataHistory((prev) => [...prev, dataPoint]);
            }, 2000);

        } else if (currentStatus === STATUS.ANALYSIS) {
            // 분석 단계: 3초 간격으로 데이터가 점진적으로 안정화되는 시뮬레이션
            interval = setInterval(() => {
                const dataPoint = getSimulatedDataPoint(false, true); // Analysis Mode Data
                setDataHistory((prev) => [...prev, dataPoint]);
            }, 3000);

        } else if (currentStatus === STATUS.RECOVERY) {
            // 복구 단계: 데이터가 정상 수준으로 수렴하는 시뮬레이션
            interval = setInterval(() => {
                const dataPoint = getSimulatedDataPoint(false, false); // Recovery Mode Data
                setDataHistory((prev) => [...prev, dataPoint]);
            }, 1000);

        } else {
            clearInterval(interval);
        }

        // 클린업 함수: 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(interval);
    }, [currentStatus]);


    /**
     * 상태 전이 로직 실행 함수. 
     * 실제 UI의 버튼 클릭이나 외부 이벤트에 의해 호출되어야 합니다.
     */
    const handleTransition = (nextStatus: typeof STATUS[keyof typeof STATUS]) => {
        console.log(`[PoCWidget] Status Transition triggered: ${currentStatus} -> ${nextStatus}`);
        setCurrentStatus(nextStatus);
        // 상태 변경 시 API 스위트에도 신호를 보내어 전체 시스템에 영향을 주도록 합니다.
        setSystemState(nextStatus); 
    };

    // 현재 상태에 따라 적절한 View 컴포넌트를 렌더링합니다. (핵심 분기점)
    const renderContent = () => {
        switch (currentStatus) {
            case STATUS.CRISIS:
                return <CrisisView onNextClick={() => handleTransition(STATUS.ANALYSIS)} />;
            case STATUS.ANALYSIS:
                return <AnalysisView onNextClick={() => handleTransition(STATUS.RECOVERY)} data={dataHistory} />;
            case STATUS.RECOVERY:
                return <RecoveryView data={dataHistory} />;
            default:
                return <div>Error: Unknown State</div>;
        }
    };

    return (
        <div className="poc-widget p-6 border-4 border-red-700 bg-gray-900 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-red-400">PoC Widget: 시스템 복원력 시뮬레이터</h2>
            {/* 상태 표시 영역 */}
            <div className={`p-3 rounded-lg text-center mb-8 ${currentStatus === STATUS.CRISIS ? 'bg-red-900/70' : currentStatus === STATUS.ANALYSIS ? 'bg-yellow-900/70' : 'bg-green-900/70'} transition duration-500`}>
                <p className="text-lg font-semibold">현재 시스템 상태: {currentStatus.toUpperCase()} ({['CRISIS', 'ANALYSIS', 'RECOVERY'][Object.keys(STATUS).indexOf(currentStatus)]})</p>
            </div>

            {/* 렌더링된 핵심 내용 */}
            <div className="min-h-[400px] relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default PoCWidget;