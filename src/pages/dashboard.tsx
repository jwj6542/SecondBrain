import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import RiskMonitor from '../components/dashboard/RiskMonitor';
import PositionOverview from '../components/dashboard/PositionOverview';
import StrategyLog from '../components/dashboard/StrategyLog';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      {/* 타이틀 영역 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📈 자동매매 통합 운영 대시보드</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. 리스크 모니터링 (가장 중요) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-red-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6l-3 3m0 0l3-3m-3 3h12M17 15H7" /></svg> 리스크 관리 현황 (Risk Monitor)</h2>
          <RiskMonitor /> {/* 컴포넌트 Placeholder */}
        </div>

        {/* 2. 실시간 경고/로그 */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.5-1.36 2.5-3H13c0 1.64 1.36 3 3 3z"/></svg> 시스템 경고 및 로그 (Alert Log)</h2>
          <StrategyLog /> {/* 컴포넌트 Placeholder */}
        </div>
      </div>

      {/* 전체 포지션 현황 (차트와 테이블 결합) */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-8v8m-4-8v8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg> 포지션 및 트렌드 차트 (Position & Trend Chart)</h2>
        <div className="min-h-[300px] border p-4 flex items-center justify-center bg-gray-50">
            {/* 여기에 Candlestick/Line Chart 컴포넌트를 통합합니다. */}
            [Chart Library Placeholder: 실시간 데이터 API 연결 필요]
        </div>
      </div>

    </DashboardLayout>
  );
};

export default DashboardPage;