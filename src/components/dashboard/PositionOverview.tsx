import React from 'react';

const PositionOverview = () => {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">현재 오픈 포지션 요약</h3>
        {/* 여기에 트레이딩 심볼별 상태를 표시하는 그래프나 KPI가 들어갑니다. */}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              <th scope="col" class="px-6 py-3">Symbol</th>
              <th scope="col" class="px-6 py-3">Direction</th>
              <th scope="col" class="px-6 py-3 text-right">Size (Lots)</th>
              <th scope="col" class="px-6 py-3 text-right">Entry Price</th>
              <th scope="col" class="px-6 py-3 text-right">Current PnL</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {/* 예시 데이터 행 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">XAUUSD</td>
              <td className="px-6 py-4 whitespace-nowrap">Long</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">1.5</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">$2300.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600">+ $1,200</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">BTCUSDT</td>
              <td className="px-6 py-4 whitespace-nowrap">Short</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">0.5</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">$68,000.00</td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-red-600">- $350</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PositionOverview;