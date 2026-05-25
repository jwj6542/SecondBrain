import React from 'react';

const StrategyLog = () => {
  return (
    <>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 border p-2 rounded-md bg-gray-50">
            {/* 로그 항목 예시 */}
            {[
                { type: 'ALERT', message: '⚠️ 일일 손실률 3.1% 초과! 거래 자동 정지 (Max Daily Loss).' },
                { type: 'WARN', message: '🚨 포지션 XAUUSD의 RSI가 과매수 영역 진입. 청산 고려 필요.' },
                { type: 'INFO', message: '✅ 모든 시스템 정상 작동. EMA/RSI 조건 만족으로 신규 포지션 진입 (BTCUSDT Long).' },
                { type: 'DEBUG', message: '⚙️ 백테스트 완료: 과거 3개월간 최대 드로우다운 -2.1%.' },
            ].map((log, index) => (
                <div key={index} className={`p-2 text-sm rounded ${log.type === 'ALERT' ? 'bg-red-100 border-l-4 border-red-500' : log.type === 'WARN' ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-white border-l-4 border-gray-200'}`}>
                    <span className={`font-semibold mr-2 ${log.type === 'ALERT' ? 'text-red-700' : log.type === 'WARN' ? 'text-yellow-700' : 'text-blue-700'}`}>{log.type}:</span> 
                    {log.message}
                </div>
            ))}
        </div>
    </>
  );
};

export default StrategyLog;