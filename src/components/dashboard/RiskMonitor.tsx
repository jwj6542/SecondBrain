import React from 'react';
import { ShieldCheck, ShieldAlert, TrendingDown, Wallet } from 'lucide-react';

interface RiskMonitorProps {
  totalBalance: number;
  totalAsset: number;
  unrealizedPnl: number;
  dailyRealizedPnl: number;
  dailyLossPercent: number;
  dailyLossLimit: number;
}

const RiskMonitor: React.FC<RiskMonitorProps> = ({
  totalBalance,
  totalAsset,
  unrealizedPnl,
  dailyRealizedPnl,
  dailyLossPercent,
  dailyLossLimit
}) => {
  // 손실 퍼센트가 제한에 도달한 수준에 따라 경고 단계 산정
  const lossRatio = dailyLossPercent / dailyLossLimit;
  let statusColor = 'bg-emerald-500';
  let borderStyle = 'border-emerald-100';
  let textColor = 'text-emerald-700';
  let descText = '안전 범위. 리스크 제어가 완벽히 유지되고 있습니다.';
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-500 animate-bounce" />;

  if (lossRatio > 0.8) {
    statusColor = 'bg-rose-600';
    borderStyle = 'border-rose-200';
    textColor = 'text-rose-700';
    descText = '위험! 일일 손실 차단 임계값에 도달하여 자동 정지 직전입니다.';
    icon = <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />;
  } else if (lossRatio > 0.4) {
    statusColor = 'bg-amber-500';
    borderStyle = 'border-amber-200';
    textColor = 'text-amber-700';
    descText = '주의. 실현 손실이 증가하고 있어 포지션 진입을 축소합니다.';
    icon = <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      {/* 리스크 진단 바 */}
      <div className={`p-5 rounded-2xl border ${borderStyle} bg-slate-50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300`}>
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h4 className="text-sm font-bold text-gray-800">실시간 리스크 자동 진단 결과</h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{descText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-bold text-xs bg-white px-3 py-1.5 rounded-full border shadow-sm">
          🛡️ 포지션당 최대 리스크 설정: <span className="text-indigo-600">1% 고정 적용</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {/* 카드 1: 일일 손실률 진행바 및 상태 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
              <span>📊 일일 손실 진행률</span>
              <span className="font-mono text-rose-500 font-bold">{dailyLossPercent.toFixed(2)}% / {dailyLossLimit}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                style={{ width: `${Math.min(lossRatio * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className={`mt-3 text-xs font-bold ${textColor} text-left`}>
            {dailyLossPercent > 0 ? `일일 누적 손실: -$${Math.abs(dailyRealizedPnl).toLocaleString()}` : '오늘 누적 실현 손실 없음.'}
          </p>
        </div>

        {/* 카드 2: 미실현 손익 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">🎭 미실현 손익 (PnL)</span>
            <TrendingDown className={`w-4 h-4 ${unrealizedPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
          </div>
          <h3 className={`text-2xl font-black font-mono tracking-tight mt-2 ${unrealizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-gray-500 mt-2">보유 중인 실시간 포지션들의 평가 수익</p>
        </div>

        {/* 카드 3: 총 평가자산 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">💰 총 평가 자산</span>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black font-mono text-slate-800 mt-2">
            ${totalAsset.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-2">여유 잔고: ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitor;