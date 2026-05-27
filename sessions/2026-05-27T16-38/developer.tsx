// src/AppContainer.jsx (핵심 로직 및 스토리텔링 제어)
import React, { useState } from 'react';
import RiskDashboard from './components/RiskDashboard';
import { motion } from 'framer-motion';

/**
 * @description 전체 시나리오를 관리하고 사용자 인터랙션을 담당하는 메인 컴포넌트.
 */
const AppContainer = () => {
  // State Management for Storytelling Flow
  const [isCrisis, setIsCrisis] = useState(false); // Crisis state toggle
  const [recoveryRate, setRecoveryRate] = useState(0.85); // Researcher's variable

  // ----------------- SCENARIO HANDLERS -----------------
  
  // Stage 1: 공포 유발 (The Pain Point) - 강제로 위기 상태 진입
  const handleStartCrisis = () => {
    setIsCrisis(true);
  };

  // Stage 2: 좌절/전환점 (The Turning Point) - Recovery를 시도하는 단계
  const handleAttemptRecovery = () => {
    if (!isCrisis) return; // 이미 위기 상태가 아니라면 무시
    alert("고객에게 '시스템 복원력'의 필요성을 설명하고, 안전 매개변수 조정 과정으로 전환합니다.");
    // Recovery 로직은 Dashboard 컴포넌트 내부에서 애니메이션을 담당하도록 설계
    setIsCrisis(false); // 일단 Normal state로 돌아가며 회복 과정을 시작 (Mockup 상)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">🛡️ Premium Monitoring Service: 시스템 생존력 시뮬레이션</h1>
        <p className="text-lg text-red-600 mt-2">지금부터 3단계의 금융 위기 경험을 통해, 기존 시스템의 한계를 체험해 보십시오.</p>
      </header>

      {/* --- 스토리텔링 컨트롤 패널 (공포/좌절 단계) --- */}
      <div className="mb-10 p-6 bg-red-50 border-l-8 border-red-500 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎬 현빈의 판매 시나리오 흐름</h2>
        <div className="flex justify-center space-x-6">
          <motion.button 
            onClick={handleStartCrisis}
            className={`px-8 py-3 rounded-full font-bold transition duration-500 shadow-lg ${isCrisis ? 'bg-red-200 cursor-default' : 'bg-red-600 hover:bg-red-700 text-white'} transform hover:scale-105`}
            disabled={isCrisis}
          >
            Stage 1: [공포 유발] 블랙 스완 이벤트 발생 (시뮬레이션 시작)
          </motion.button>

          <motion.button 
            onClick={handleAttemptRecovery}
            className={`px-8 py-3 rounded-full font-bold transition duration-500 shadow-lg ${!isCrisis ? 'bg-gray-200 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-white'} transform hover:scale-105`}
            disabled={!isCrisis}
          >
            Stage 2/3: [회복 시도] 안전 매개변수 조정 및 시스템 복원력 확보 (진행)
          </motion.button>
        </div>
      </div>

      {/* --- 핵심 데모 영역 --- */}
      <div className="mt-10">
        <RiskDashboard isCrisis={isCrisis} recoveryRate={recoveryRate} />
      </div>
    </div>
  );
};

export default AppContainer;