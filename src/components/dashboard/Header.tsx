import React from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

interface HeaderProps {
  tradingActive: boolean;
  paperTrading: boolean;
  uptime: string;
}

const Header: React.FC<HeaderProps> = ({ tradingActive, paperTrading, uptime }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
      {/* 왼쪽 메인 문구 */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Cpu size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">실시간 통합 모니터링 컨트롤</h2>
          <p className="text-xs text-gray-500 font-medium">실시간 포지션 및 볼린저 밴드 다이어그램 감시</p>
        </div>
      </div>

      {/* 오른쪽 상태 패널 */}
      <div className="flex items-center gap-4">
        {/* 모의투자 배지 */}
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm border ${
          paperTrading 
            ? 'bg-amber-50 text-amber-700 border-amber-200' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${paperTrading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          {paperTrading ? '⚠️ 모의투자(Paper) 활성' : '💰 실거래(Real Account)'}
        </span>

        {/* 봇 가동시간 */}
        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-tight flex items-center gap-2">
          <Activity size={14} className={tradingActive ? 'text-emerald-500 animate-pulse' : 'text-slate-400'} />
          UPTIME: {uptime}
        </span>

        {/* 라이브 상태 배지 */}
        <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${
          tradingActive 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'bg-slate-300 text-slate-600'
        }`}>
          {tradingActive ? 'RUNNING' : 'STOPPED'}
        </span>
      </div>
    </header>
  );
};

export default Header;
