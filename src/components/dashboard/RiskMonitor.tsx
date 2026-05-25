import React from 'react';

const RiskMonitor = () => {
  // API 호출을 통해 실시간 데이터를 받아와야 함 (백엔드 필수)
  const dailyLossRate = 2.8; // 예시 데이터
  const maxPositionRisk = 0.95; // 예시 데이터: 1% 제한 준수 확인
  const statusColor = dailyLossRate > 3 ? 'bg-red-600' : (dailyLossRate > 2.5 ? 'bg-orange-500' : 'bg-green-500');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      {/* 카드 1: 일일 손실률 */}
      <div className={`p-4 rounded-lg shadow-md ${statusColor} text-white`}>
        <p className="text-sm opacity-80 mb-1">📊 일일 손실률</p>
        <h3 className="text-3xl font-bold">{dailyLossRate.toFixed(2)}%</h3>
        <p className={`mt-1 text-xs ${statusColor === 'bg-red-600' ? 'text-white' : 'text-black'}`}>🚨 {dailyLossRate > 3 ? '위험! 일일 한도 초과 임박.' : '정상 범위.'}</p>
      </div>

      {/* 카드 2: 포지션당 최대 위험 */}
      <div className="p-4 rounded-lg shadow-md bg-white border">
        <p className="text-sm text-gray-500 mb-1">🛡️ 포지션당 최대 위험</p>
        <h3 className="text-2xl font-bold">{maxPositionRisk.toFixed(2)}%</h3>
        <p className={`mt-1 text-xs ${maxPositionRisk < 1 ? 'text-green-600' : 'text-red-500'}`}>✅ 1% 규칙 준수</p>
      </div>

      {/* 카드 3: 총 자본금 및 잔여 여력 */}
      <div className="p-4 rounded-lg shadow-md bg-white border">
        <p className="text-sm text-gray-500 mb-1">💰 총 자본금 / 남은 여력</p>
        <h3 className="text-2xl font-bold">$100,000 / $XX</h3>
        <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">자본금 조회</button>
      </div>
    </div>
  );
};

export default RiskMonitor;