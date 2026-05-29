import React, { useState, useEffect } from 'react';
// Mock API Contract를 사용하여 데이터를 불러옴
import { fetchRiskIndexData } from '../api/mockService';

// ---------------------------------------------
// 1. 타입 정의 (Robustness Check)
// ---------------------------------------------

type WidgetState = 'LOADING' | 'SAFE' | 'WARNING' | 'CRISIS';

interface RiskData {
    timestamp: string;
    riskIndex: number; // 핵심 지표
    capitalPreservationScore: number; // 자본 보존 점수
    systemResilienceRatio: number; // 시스템 복원력 비율 (MDRR)
}

// ---------------------------------------------
// 2. 상수 정의 (Business Logic Centralization)
// ---------------------------------------------

const WARNING_THRESHOLD = 0.65; // 예시 임계치: Risk Index가 0.65 이상이면 Warning
const CRISIS_THRESHOLD = 0.85;  // 예시 임계치: Risk Index가 0.85 이상이면 Crisis

/**
 * PoC Widget 컴포넌트: 시스템적 생존력 지표를 보여주고 상태 변화를 감지하는 핵심 로직을 담당합니다.
 */
const PoCWidget: React.FC = () => {
    // 상태와 데이터 저장
    const [riskData, setRiskData] = useState<RiskData | null>(null);
    const [widgetState, setWidgetState] = useState<WidgetState>('LOADING');
    const [isLoading, setIsLoading] = useState(true);

    /**
     * 리스크 데이터를 가져와서 위젯의 상태를 결정하는 핵심 로직 (State Change Handler)
     */
    const analyzeRiskData = (data: RiskData) => {
        let newState: WidgetState;
        if (data.riskIndex >= CRISIS_THRESHOLD) {
            newState = 'CRISIS';
        } else if (data.riskIndex >= WARNING_THRESHOLD) {
            // 🚨 여기가 CEO가 지시한 Warning 상태 진입 로직입니다.
            console.log("⚠️ [STATE CHANGE]: 경고(WARNING) 상태 진입 감지! Risk Index:", data.riskIndex);
            newState = 'WARNING';
        } else if (data.capitalPreservationScore < 0.7) {
             // 지수만으로 판단하기 어려울 경우, 보조 지표 사용 가능
             console.log("🟠 [STATE CHANGE]: 주의(PRE-WARNING) 상태 감지.");
             newState = 'SAFE'; // 임시 처리
        } else {
            newState = 'SAFE';
        }
        setWidgetState(newState);
        setRiskData(data);
    };

    /**
     * API 호출 및 상태 분석을 담당하는 useEffect Hook
     */
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Mock Service를 통해 데이터를 가져옵니다.
                const data: RiskData = await fetchRiskIndexData();
                analyzeRiskData(data);
            } catch (error) {
                console.error("Error fetching risk data:", error);
                setWidgetState('CRISIS'); // 에러 발생 시 최대 위험 상태로 가정
                setRiskData({ timestamp: new Date().toString(), riskIndex: 1.0, capitalPreservationScore: 0.0, systemResilienceRatio: 0.0 });
            } finally {
                setIsLoading(false);
            }
        };

        // 초기 로딩 시 실행 (실제 운영 환경에서는 폴링 인터벌 설정 필요)
        fetchData();
    }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 데이터를 불러오도록 합니다.

    // ---------------------------------------------
    // 3. 상태별 렌더링 로직 (Structural Skeleton)
    // ---------------------------------------------

    const renderContent = () => {
        if (isLoading) {
            return <div className="widget-content loading">⚙️ 데이터 분석 중...</div>;
        }

        if (!riskData) return null; // 데이터가 없으면 아무것도 표시하지 않음.

        switch (widgetState) {
            case 'SAFE':
                return (
                    <div className="widget-content safe">✅ 안정적입니다. 시스템은 자본 보존 원칙을 잘 유지하고 있습니다.</div>
                );
            case 'WARNING':
                // 🚨 WARNING 상태 진입 시, 공포를 극대화하는 구조적 스켈레톤 구현
                return (
                    <div className="widget-content warning">
                        <h2>⚠️ 경고: 시스템 위험 레벨 감지!</h2>
                        <p>현재 시장의 변동성이 통제 가능한 범위를 벗어나고 있습니다. 즉각적인 점검이 필요합니다.</p>
                        {/* [DATA BINDING POINT 1]: 실시간 리스크 지수 시각화 영역 */}
                        <div className="metric-card critical">
                            <h3>🚨 실시간 위험 지표 (Risk Index)</h3>
                            <p>{riskData.riskIndex.toFixed(2)}</p>
                            {/* 이 자리에 디자인팀이 그래프/미터기를 넣을 예정입니다. */}
                        </div>
                        {/* [DATA BINDING POINT 2]: 핵심 조언 및 CTA 유도 영역 */}
                        <div className="metric-card warning-hint">
                            <h3>💡 코다리 분석: 무엇을 해야 할까요?</h3>
                            <p>시스템적 위험에 대한 정밀 진단이 필요합니다. **$97 미니 보고서**를 통해 근본 원인을 파악하세요.</p>
                            {/* 이 자리에 CTA 버튼 로직이 들어갈 것입니다. */}
                        </div>
                    </div>
                );
            case 'CRISIS':
                 return (
                    <div className="widget-content crisis">🔥 치명적 위험! 즉시 거래를 중단하고 안전 모드로 전환해야 합니다.</div>
                );
            default:
                return null;
        }
    };

    // 최종 JSX 반환 구조
    return (
        <div className={`poc-widget widget-${widgetState.toLowerCase()}`}>
            <header>PoC Widget: 시스템적 생존력 지표</header>
            {renderContent()}
        </div>
    );
}

export default PoCWidget;