import React from 'react';
import { LayoutDashboard, Settings, ShieldAlert, FileCode, Play, Square, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tradingActive: boolean;
  onToggleTrading: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  tradingActive,
  onToggleTrading,
  onOpenSettings
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between h-screen shadow-2xl z-10">
      {/* 로고 영역 */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
            <span className="font-bold text-xl tracking-wider text-white">J</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-100 to-white bg-clip-text text-transparent">JABIS ENGINE</h1>
            <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">BB-RSI Quant Bot</p>
          </div>
        </div>

        {/* 메뉴 네비게이션 */}
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            통합 대시보드
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <Settings size={18} />
            API 연동 설정
          </button>
        </nav>
      </div>

      {/* 하단 제어 & 봇 상태 요약 */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* 봇 가동 제어판 */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">봇 동작 제어</span>
            <span className={`flex h-2.5 w-2.5 relative`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tradingActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${tradingActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
          </div>

          <button
            onClick={onToggleTrading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
              tradingActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            {tradingActive ? (
              <>
                <Square size={16} fill="white" />
                자동매매 정지
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                자동매매 가동
              </>
            )}
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-slate-200">
            🤖
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">자비스 어드바이저</p>
            <p className="text-[10px] text-slate-500">Live Active Engine v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
