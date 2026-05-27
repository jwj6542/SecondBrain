import React from 'react';
import { ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

interface Position {
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  current_price: number;
  size: number;
  stop_loss: number;
  pnl: number;
  time: string;
}

interface PositionOverviewProps {
  positions: Position[];
  onSelectSymbol: (symbol: string) => void;
  selectedSymbol: string;
}

const PositionOverview: React.FC<PositionOverviewProps> = ({ positions, onSelectSymbol, selectedSymbol }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">실시간 보유 포지션</h3>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          총 오픈 포지션: {positions.length}개
        </span>
      </div>

      {positions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-center">
          <Compass className="w-10 h-10 text-gray-300 animate-spin mb-3" />
          <p className="font-semibold text-sm">현재 보유 중인 포지션이 없습니다.</p>
          <p className="text-xs text-gray-400 mt-1">지표 조건 충족 시 실시간으로 진입합니다.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th scope="col" className="px-6 py-4">상품 (Symbol)</th>
                  <th scope="col" className="px-6 py-4">진입 방향</th>
                  <th scope="col" className="px-6 py-4 text-right">계약 수량 (Size)</th>
                  <th scope="col" className="px-6 py-4 text-right">진입 가격</th>
                  <th scope="col" className="px-6 py-4 text-right">현재 가격</th>
                  <th scope="col" className="px-6 py-4 text-right">손절 기준선 (SL)</th>
                  <th scope="col" className="px-6 py-4 text-right">평가 손익 (PnL)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm font-medium text-slate-700">
                {positions.map((pos) => {
                  const isLong = pos.direction === 'LONG';
                  const isSelected = selectedSymbol === pos.symbol;
                  
                  return (
                    <tr 
                      key={pos.symbol}
                      onClick={() => onSelectSymbol(pos.symbol)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${isSelected ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-extrabold text-indigo-600 font-mono tracking-tight uppercase">{pos.symbol}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isLong 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isLong ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {pos.direction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-slate-600">{pos.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${pos.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${pos.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-rose-500">${pos.stop_loss.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-black ${
                        pos.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionOverview;