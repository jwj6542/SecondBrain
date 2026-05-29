import React from 'react';

/**
 * S3 상태에서만 렌더링되는 Call To Action (CTA) 컴포넌트.
 * 이 컴포넌트는 공포감을 최고조로 만든 후, 유일한 해결책(보고서)을 제시함.
 */
const CrisisDisplay: React.FC = () => {
    return (
        <div className="border-4 border-dashed border-red-600 p-8 text-center bg-gray-900/50 rounded-xl shadow-inner">
            <h3 className="text-3xl font-extrabold text-red-400 mb-2">🛑 지금, 전문적 분석이 필요합니다.</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-md mx-auto">
                현재 시스템의 위험도는 일반적인 트레이딩 지표로는 포착할 수 없는 구조적 결함을 보이고 있습니다. 
                이는 단순한 손실이 아닌, '시스템 자체의 생존력' 문제로 접근해야 합니다.
            </p>

            {/* CTA 버튼 영역 - 공포를 안도감으로 전환 */}
            <button className="bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-12 rounded-full transition duration-300 transform hover:scale-105 shadow-xl">
                ⚡ $97 미니 진단 보고서 구매하기 (최소한의 안도감 확보) ⚡
            </button>

            <p className="mt-4 text-sm text-red-300/80">
                (본 서비스는 자가 학습을 통한 근본적인 시스템 개선에 초점을 맞춥니다.)
            </p>
        </div>
    );
};

export default CrisisDisplay;