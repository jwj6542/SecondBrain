import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import RiskMonitor from '../components/dashboard/RiskMonitor';
import PositionOverview from '../components/dashboard/PositionOverview';
import StrategyLog from '../components/dashboard/StrategyLog';
import RealtimeChart from '../components/dashboard/RealtimeChart';
import { Settings, ShieldCheck, Database, Sliders, Info, Server, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState<any>({
    trading_active: false,
    paper_trading: true,
    uptime: '00:00:00',
    total_balance: 100000.0,
    total_asset: 100000.0,
    unrealized_pnl: 0.0,
    daily_realized_pnl: 0.0,
    daily_loss_percent: 0.0,
    open_positions: []
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [chartData, setChartData] = useState<any[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // API 설정 입력 상태
  const [configInput, setConfigInput] = useState<any>({
    trading_active: false,
    paper_trading: true,
    binance: { api_key: '', secret_key: '', leverage: 3, risk_percent: 1.0 },
    hantec: { login: '', password: '', server: '', risk_percent: 1.0 },
    daily_loss_limit_percent: 3.0,
    timeframe: '1m'
  });

  // 1초 단위 실시간 데이터 폴링
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStatus = await fetch('/api/status');
        if (resStatus.ok) {
          const data = await resStatus.json();
          setStatus(data);
        }
        
        const resLogs = await fetch('/api/logs');
        if (resLogs.ok) {
          const data = await resLogs.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard status:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1.5초 단위 선택된 심볼 차트 데이터 폴링
  useEffect(() => {
    const fetchChart = async () => {
      try {
        const resChart = await fetch(`/api/chart/${selectedSymbol}`);
        if (resChart.ok) {
          const data = await resChart.json();
          setChartData(data);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };

    fetchChart();
    const interval = setInterval(fetchChart, 1500);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // 설정 로드
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setConfigInput(data);
        }
      } catch (err) {
        console.error('Error loading config:', err);
      }
    };
    loadConfig();
  }, [showSettingsModal]);

  // 자동매매 시작/종료 토글
  const handleToggleTrading = async () => {
    const action = status.trading_active ? 'stop' : 'start';
    try {
      const res = await fetch(`/api/${action}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        // 갱신
        const resStatus = await fetch('/api/status');
        if (resStatus.ok) {
          const statusData = await resStatus.json();
          setStatus(statusData);
        }
      }
    } catch (err) {
      console.error(`Error toggling trading ${action}:`, err);
    }
  };

  // API 설정 저장
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configInput)
      });
      if (res.ok) {
        setShowSettingsModal(false);
        // 저장 시 실시간 봇 상태 재시작 유무 자동 동기화
        const resStatus = await fetch('/api/status');
        if (resStatus.ok) {
          const statusData = await resStatus.json();
          setStatus(statusData);
        }
      }
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* 1. 사이드바 */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tradingActive={status.trading_active}
        onToggleTrading={handleToggleTrading}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* 메인 뷰포트 영역 */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* 2. 상단 헤더 */}
        <Header 
          tradingActive={status.trading_active} 
          paperTrading={status.paper_trading} 
          uptime={status.uptime} 
        />

        {/* 3. 메인 콘텐츠 스크롤 영역 */}
        <main className="flex-grow p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                🤖 JABIS QUANT SYSTEM
              </h1>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mt-1.5">
                볼린저밴드 & RSI 더블비 역추세 전략 기반 자동매매
              </p>
            </div>
            
            {/* 심볼 셀렉터 퀵 칩스 */}
            <div className="flex flex-wrap gap-2">
              {['XAUUSD', 'US100', 'WTI', 'BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'SOL/USDT'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border shadow-sm ${
                    selectedSymbol === sym
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 4. 리스크 관리 현황 (가장 중요) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sliders size={18} className="text-indigo-600" />
                리스크 모니터링 & 자산 지표 (Risk Control Panel)
              </h2>
              <RiskMonitor
                totalBalance={status.total_balance}
                totalAsset={status.total_asset}
                unrealizedPnl={status.unrealized_pnl}
                dailyRealizedPnl={status.daily_realized_pnl}
                dailyLossPercent={status.daily_loss_percent}
                dailyLossLimit={configInput.daily_loss_limit_percent}
              />
            </div>

            {/* 5. 실시간 경고 및 로그 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <StrategyLog logs={logs} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 6. 실시간 지표 분석 차트 */}
            <div className="lg:col-span-2">
              <RealtimeChart symbol={selectedSymbol} chartData={chartData} />
            </div>

            {/* 7. 포지션 통합 테이블 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <PositionOverview 
                positions={status.open_positions} 
                onSelectSymbol={setSelectedSymbol}
                selectedSymbol={selectedSymbol}
              />
            </div>
          </div>
        </main>
      </div>

      {/* 8. API 설정 모달 다이얼로그 */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* 모달 헤더 */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 text-indigo-400 rounded-xl">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">API 연동 및 트레이딩 매개변수 설정</h3>
                  <p className="text-[10px] text-slate-400 font-medium">실시간 해외선물(한텍) 및 코인선물(바이낸스) 연동</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2 transition"
              >
                &times;
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <form onSubmit={handleSaveConfig} className="p-6 space-y-6">
              {/* 모의투자 토글 */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Info size={14} /> 모의투자 가상 매매 (Paper Trading)
                  </h4>
                  <p className="text-[10px] text-amber-700 leading-tight">활성화 시 실제 거래소 주문 없이 $100,000의 가상 자금으로 전략을 안전하게 테스트합니다.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={configInput.paper_trading}
                    onChange={(e) => setConfigInput({ ...configInput, paper_trading: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A. 바이낸스 선물 세팅 */}
                <div className="space-y-4 border-r border-slate-100 pr-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Database size={14} className="text-indigo-600" />
                    바이낸스 API 세팅 (Binance Futures)
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">API Key</label>
                      <input
                        type="text"
                        disabled={configInput.paper_trading}
                        value={configInput.binance.api_key}
                        onChange={(e) => setConfigInput({
                          ...configInput,
                          binance: { ...configInput.binance, api_key: e.target.value }
                        })}
                        placeholder={configInput.paper_trading ? '모의투자 모드 작동 중' : '입력해 주세요.'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Secret Key</label>
                      <input
                        type="password"
                        disabled={configInput.paper_trading}
                        value={configInput.binance.secret_key}
                        onChange={(e) => setConfigInput({
                          ...configInput,
                          binance: { ...configInput.binance, secret_key: e.target.value }
                        })}
                        placeholder={configInput.paper_trading ? '••••••••••••••••' : '입력해 주세요.'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">레버리지</label>
                        <input
                          type="number"
                          value={configInput.binance.leverage}
                          onChange={(e) => setConfigInput({
                            ...configInput,
                            binance: { ...configInput.binance, leverage: parseInt(e.target.value) }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">1회 진입 리스크 (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={configInput.binance.risk_percent}
                          onChange={(e) => setConfigInput({
                            ...configInput,
                            binance: { ...configInput.binance, risk_percent: parseFloat(e.target.value) }
                          })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* B. 한텍마켓 MT5 세팅 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Server size={14} className="text-indigo-600" />
                    한텍마켓 API 세팅 (MT5 브로커)
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">MT5 계정 ID (Login)</label>
                      <input
                        type="text"
                        disabled={configInput.paper_trading}
                        value={configInput.hantec.login}
                        onChange={(e) => setConfigInput({
                          ...configInput,
                          hantec: { ...configInput.hantec, login: e.target.value }
                        })}
                        placeholder={configInput.paper_trading ? '모의투자 모드 작동 중' : '계정 ID 입력'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">비밀번호 (Password)</label>
                      <input
                        type="password"
                        disabled={configInput.paper_trading}
                        value={configInput.hantec.password}
                        onChange={(e) => setConfigInput({
                          ...configInput,
                          hantec: { ...configInput.hantec, password: e.target.value }
                        })}
                        placeholder={configInput.paper_trading ? '••••••••••••••••' : '비밀번호 입력'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">브로커 서버명 (Server)</label>
                      <input
                        type="text"
                        disabled={configInput.paper_trading}
                        value={configInput.hantec.server}
                        onChange={(e) => setConfigInput({
                          ...configInput,
                          hantec: { ...configInput.hantec, server: e.target.value }
                        })}
                        placeholder={configInput.paper_trading ? '모의투자 모드 작동 중' : '예: HantecMarkets-Live'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">한텍 1회 진입 리스크 (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={configInput.hantec.risk_percent}
                        onChange={(e) => setConfigInput({
                          ...configInput,
                          hantec: { ...configInput.hantec, risk_percent: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 리스크 차단 설정 */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">일일 손실 허용 한도 (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={configInput.daily_loss_limit_percent}
                    onChange={(e) => setConfigInput({
                      ...configInput,
                      daily_loss_limit_percent: parseFloat(e.target.value)
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">전략 적용 타임프레임</label>
                  <select
                    value={configInput.timeframe}
                    onChange={(e) => setConfigInput({ ...configInput, timeframe: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="1m">1분봉 (1m) — 퀵 단타 추천</option>
                    <option value="5m">5분봉 (5m)</option>
                    <option value="15m">15분봉 (15m)</option>
                  </select>
                </div>
              </div>

              {/* 모달 풋터 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
                >
                  설정 저장 및 반영
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;