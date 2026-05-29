import React, { useEffect } from 'react';
import './CrisisAlertOverlay.css'; // CSS 파일 분리

/**
 * @component CrisisAlertOverlay
 * 시스템의 CRITICAL_FAILURE 상태를 감지하고 애니메이션을 발동하는 컴포넌트.
 * 이 컴포넌트는 props로 전달받은 state 객체에 의존하여 작동합니다.
 * 
 * @param {object} props - 위기 상태 정보를 담는 Props.
 * @param {boolean} props.isCriticalFailure - 시스템이 임계치를 초과했는지 여부 (핵심 트리거).
 * @param {string} props.severityCode - 발생한 오류 코드 또는 경고 레벨.
 */
const CrisisAlertOverlay = ({ isCriticalFailure, severityCode }) => {

  // 1. 애니메이션 상태 관리: 위기 상황이 감지되면 클래스를 토글하여 애니메이션을 시작합니다.
  const animationClass = isCriticalFailure ? 'crisis-active' : '';

  return (
    <div className={`crisis-overlay ${animationClass}`} data-severity={severityCode}>
      <div className="alert-content">
        <span className="warning-icon">🚨</span>
        <h2>SYSTEM CRITICAL FAILURE DETECTED</h2>
        <p>Anomaly Detected: {severityCode}</p>
        <small>자본 보존 원칙 붕괴 위험. 즉각적인 패치가 필요합니다.</small>
      </div>
    </div>
  );
};

export default CrisisAlertOverlay;