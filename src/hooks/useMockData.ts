// Mocking Service: 실시간, 변동성 데이터 흐름 시뮬레이션
import { useState, useEffect } from 'react';

type SystemMetrics = {
    timestamp: number;
    vixIndex: number; // VIX Spike를 시뮬레이션할 지표
    correlationCoefficient: number; // 상관관계 붕괴 지표
    systemHealthScore: number; // 종합 건강 점수 (0-100)
};

// 가상의 초기 상태 정의
const initialMetrics: SystemMetrics = {
    timestamp: Date.now(),
    vixIndex: 15,
    correlationCoefficient: 0.7,
    systemHealthScore: 92,
};

/**
 * 실시간으로 변동하는 시스템 지표를 시뮬레이션하는 커스텀 훅.
 * 실제 API 호출을 대체하며, 시간 경과에 따른 스트레스 테스트 데이터를 제공합니다.
 */
const useMockData = (initialMetrics: SystemMetrics) => {
    const [metrics, setMetrics] = useState<SystemMetrics>(initialMetrics);

    useEffect(() => {
        // 1초마다 데이터 업데이트를 시뮬레이션
        const intervalId = setInterval(() => {
            setMetrics(prevMetrics => {
                let newVix = prevMetrics.vixIndex + (Math.random() - 0.5) * 2; // 작은 랜덤 변동
                let newCorr = prevMetrics.correlationCoefficient + (Math.random() - 0.5) * 0.01;

                // 스트레스 테스트 시나리오 강제 주입 로직 (예시: 특정 시간에 VIX 급상승 및 상관관계 붕괴)
                const now = Date.now();
                let simulatedVix, simulatedCorr, scoreDelta;

                if (Math.random() < 0.05) { // 5% 확률로 '위기' 발생 시뮬레이션
                    simulatedVix = Math.min(40, prevMetrics.vixIndex + 10 * Math.random()); // VIX 급상승
                    simulatedCorr = Math.max(-0.5, prevMetrics.correlationCoefficient - (Math.random() * 0.2)); // 상관관계 붕괴
                    scoreDelta = -(Math.random() * 5); // 점수 하락
                } else {
                    simulatedVix = Math.max(10, newVix);
                    simulatedCorr = Math.min(0.9, newCorr);
                    scoreDelta = (Math.random() - 0.5) * 2; // 점수 안정화/소폭 상승
                }

                const newHealthScore = Math.max(10, prevMetrics.systemHealthScore + scoreDelta).toFixed(0);

                return {
                    timestamp: now,
                    vixIndex: parseFloat(simulatedVix.toFixed(2)),
                    correlationCoefficient: parseFloat(simulatedCorr.toFixed(3)),
                    systemHealthScore: parseInt(newHealthScore),
                };
            });
        }, 1000); // 1초마다 데이터 업데이트

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, []);

    return metrics;
};

export default useMockData;