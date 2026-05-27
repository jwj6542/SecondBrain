import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, Area } from 'recharts';

interface RealtimeChartProps {
  symbol: string;
  chartData: any[];
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({ symbol, chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[350px] bg-slate-950 rounded-2xl border border-slate-900 text-slate-400 p-8">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="font-semibold text-sm tracking-wide">실시간 트레이딩 차트 데이터를 불러오는 중...</p>
        <p className="text-xs text-slate-600 mt-2">자동매매 가동 시 시뮬레이션 봉 데이터가 누적되기 시작합니다.</p>
      </div>
    );
  }

  // 데이터 포맷팅
  const formattedData = chartData.map((d: any) => ({
    time: d.time.split(' ')[1] || d.time,
    Price: parseFloat(d.close.toFixed(4)),
    Upper: parseFloat(d.bb_h?.toFixed(4) || 0),
    Lower: parseFloat(d.bb_l?.toFixed(4) || 0),
    Upper44: parseFloat(d.bb44_h?.toFixed(4) || 0),
    Lower44: parseFloat(d.bb44_l?.toFixed(4) || 0),
    SMA20: parseFloat(d.sma20?.toFixed(4) || 0),
    RSI: parseFloat(d.rsi?.toFixed(2) || 0)
  }));

  // y축 마진 및 범위 최소최대 계산
  const prices = formattedData.map(d => d.Price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
          📈 실시간 가격 & 더블 볼린저 밴드 다이어그램 — <span className="text-indigo-400 font-mono uppercase">{symbol}</span>
        </h3>
        <span className="text-xs font-mono font-semibold text-slate-500">지표 설정: BB(20, 2) & BB(44, 2) / SMA(20) / RSI(14)</span>
      </div>

      {/* 1. 가격 & 볼린저 밴드 차트 */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="bbArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.05} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bbArea44" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.03} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
            <YAxis stroke="#475569" fontSize={10} domain={[minPrice, maxPrice]} tickLine={false} width={60} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
            
            {/* 볼린저 밴드 채우기 (Upper ~ Lower 사이 공간 셰이딩) */}
            <Area type="monotone" dataKey="Upper" stroke="none" fill="url(#bbArea)" />
            <Area type="monotone" dataKey="Upper44" stroke="none" fill="url(#bbArea44)" />
            
            {/* 볼린저 밴드 20선 (기본) — 상단/하단 */}
            <Line type="monotone" dataKey="Upper" stroke="#f43f5e" strokeWidth={1.2} dot={false} strokeDasharray="3 3" name="BB 20 Upper" />
            <Line type="monotone" dataKey="Lower" stroke="#10b981" strokeWidth={1.2} dot={false} strokeDasharray="3 3" name="BB 20 Lower" />

            {/* 볼린저 밴드 44선 (더블비) — 상단/하단 */}
            <Line type="monotone" dataKey="Upper44" stroke="#c084fc" strokeWidth={1.5} dot={false} name="BB 44 Upper" />
            <Line type="monotone" dataKey="Lower44" stroke="#22d3ee" strokeWidth={1.5} dot={false} name="BB 44 Lower" />
            
            {/* 중단선: SMA 20 이동평균선 */}
            <Line type="monotone" dataKey="SMA20" stroke="#facc15" strokeWidth={1.5} dot={false} strokeDasharray="6 3" name="SMA 20" />
            
            {/* 실제 가격 종가선 */}
            <Line type="monotone" dataKey="Price" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 1 }} activeDot={{ r: 6 }} name="Close Price" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 2. RSI 보조지표 차트 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>RSI (Relative Strength Index)</span>
          <span className="font-mono text-indigo-400">최근 RSI: {formattedData[formattedData.length - 1]?.RSI}</span>
        </div>
        <div className="h-[90px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis dataKey="time" hide />
              <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} tickLine={false} ticks={[30, 50, 70]} width={60} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              
              {/* 과매수 / 과매도 레퍼런스 라인 */}
              <ReferenceLine y={70} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" label={{ value: '과매수 (70)', fill: '#ef4444', fontSize: 9, position: 'insideTopLeft' }} />
              <ReferenceLine y={30} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" label={{ value: '과매도 (30)', fill: '#10b981', fontSize: 9, position: 'insideBottomLeft' }} />
              
              <Line type="monotone" dataKey="RSI" stroke="#818cf8" strokeWidth={1.8} dot={false} name="RSI(14)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RealtimeChart;
