import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'ALERT' | 'WARN' | 'INFO' | 'DEBUG' | string;
  message: string;
}

interface StrategyLogProps {
  logs: LogEntry[];
}

const StrategyLog: React.FC<StrategyLogProps> = ({ logs }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">실시간 전략 실행 로그</h3>
        <span className="text-[10px] font-bold text-slate-400 tracking-wider">Live Logging (1s)</span>
      </div>

      <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 border border-slate-100 p-3 rounded-2xl bg-slate-50 shadow-inner">
        {logs.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-12">
            표시할 실시간 트레이딩 로그가 없습니다.
          </div>
        ) : (
          logs.map((log, index) => {
            let typeColor = 'text-blue-700 bg-blue-50 border-blue-400';
            let icon = <HelpCircle className="w-4 h-4 text-blue-500" />;

            if (log.type === 'ALERT') {
              typeColor = 'bg-red-50 border-red-200 border-l-4 border-l-red-500 text-red-900';
              icon = <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />;
            } else if (log.type === 'WARN') {
              typeColor = 'bg-amber-50 border-amber-200 border-l-4 border-l-amber-500 text-amber-900';
              icon = <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />;
            } else if (log.type === 'INFO') {
              typeColor = 'bg-white border-slate-100 border-l-4 border-l-indigo-500 text-slate-800 shadow-sm';
              icon = <CheckCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0" />;
            }

            return (
              <div 
                key={index} 
                className={`p-3 text-xs rounded-xl flex items-start gap-2.5 transition-all duration-200 border ${typeColor}`}
              >
                {icon}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase text-[10px] tracking-widest">{log.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="font-semibold leading-relaxed tracking-tight">{log.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StrategyLog;