import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. 사이드바 (메뉴 네비게이션) */}
      <Sidebar activeTab="dashboard" setActiveTab={() => {}} tradingActive={false} onToggleTrading={() => {}} onOpenSettings={() => {}} />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* 2. 헤더/탑바 (실시간 알림 및 사용자 정보 표시) */}
        <Header tradingActive={false} paperTrading={true} uptime="00:00:00" />
        
        {/* 실제 대시보드 내용이 들어갈 메인 컨테이너 */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;