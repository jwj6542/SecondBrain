import time
import random
from datetime import datetime

# ============================================================
# 🚨 Observable Log 구조 정의: 모든 시스템 이벤트를 기록하는 중앙 로그
# ============================================================
class SystemLog:
    def __init__(self):
        self.logs = []

    def record(self, component: str, event_type: str, severity: str, message: str, data: dict = None):
        """시스템의 모든 중요한 이벤트를 기록합니다."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {
            "timestamp": timestamp,
            "component": component,
            "event_type": event_type,
            "severity": severity, # CRITICAL, WARNING, INFO, SUCCESS
            "message": message,
            "data": data if data else {}
        }
        self.logs.append(log_entry)
        print(f"[LOG | {severity:<10}][{component}] {event_type}: {message}")

    def get_report(self):
        """최종 로그 보고서를 반환합니다."""
        return self.logs

# ============================================================
# 🧠 Core Simulation Components (가정된 시스템 모듈)
# ============================================================
class DataFeed:
    def __init__(self, log: SystemLog):
        self.log = log
        self.base_data = {"XAUUSD": 2000.0, "BTCUSDT": 65000.0}

    def get_realtime_price(self, symbol: str) -> float:
        """가상의 실시간 가격을 제공합니다. (Fault Injection 지점)"""
        if random.random() < 0.1: # 10% 확률로 데이터 끊김 시뮬레이션
            raise ConnectionError("DATA_FEED_DISCONNECTED: API 연결이 불안정하거나 응답 시간이 초과되었습니다.")
        
        # 가상의 노이즈 추가
        fluctuation = random.uniform(-0.5, 0.5)
        price = self.base_data[symbol] + fluctuation
        self.log.record("DataFeed", "PRICE_UPDATE", "INFO", f"[{symbol}] 데이터 수신 성공.", {"price": round(price, 2)})
        return price

class StrategyEngine:
    def __init__(self, log: SystemLog):
        self.log = log
        self.is_operational = True

    def analyze_market(self, data_feed: DataFeed) -> str:
        """시장 데이터를 분석하고 매매 신호를 생성합니다."""
        if not self.is_operational:
            raise RuntimeError("STRATEGY_ENGINE_FAIL: 엔진이 필수 점검 단계로 인해 비활성화되었습니다.")

        try:
            price = data_feed.get_realtime_price("XAUUSD")
            # 복구 과정 시뮬레이션 로직 추가
            if "DISCONNECTED" in str(self.log.logs[-1]['message']):
                return "ALERT: 데이터 연결 불안정으로 신호 생성 불가."
            elif price > 2010:
                return "SIGNAL: 과열 상태 감지 (BUY/LONG)"
            else:
                return "STATUS: 정상 범위 유지"

        except Exception as e:
            self.log.record("StrategyEngine", "CRITICAL_ERROR", "CRITICAL", f"분석 실패: {e}", {})
            return "FAILURE: 분석 불가 (시스템 오류 발생)"

class RiskManager:
    def __init__(self, log: SystemLog):
        self.log = log
        self.daily_loss_limit = 3 # %

    def check_risk(self, current_pnl: float) -> str:
        """손실률을 체크하고 자본 보존 원칙을 강제합니다."""
        if current_pnl < -1000 and random.random() > 0.5: # 가상 임계치 도달 시 위험 발생
            self.log.record("RiskManager", "RISK_BREACH", "CRITICAL", f"일일 손실 한도 ({self.daily_loss_limit}%) 초과 위기 감지!", {"PNL": current_pnl})
            return "SYSTEM SHUTDOWN: 자본 보존 원칙에 따라 트레이딩 정지."
        elif current_pnl < -200:
             return "WARNING: 경계 수준 진입. 포지션 축소 필요."
        else:
            self.log.record("RiskManager", "STATUS", "INFO", "위험 관리 상태 정상.", {"PNL": current_pnl})
            return "OK: 시스템 운영 가능."

# ============================================================
# 🧪 E2E 통합 테스트 시뮬레이션 실행 로직
# ============================================================
def run_e2e_stress_test(failure_mode: str):
    """
    블랙 스완 시나리오 기반의 End-to-End 스트레스 테스트를 수행합니다.
    :param failure_mode: 'data_spike', 'api_disconnect', 'state_corruption' 중 선택
    """
    log = SystemLog()
    data_feed = DataFeed(log)
    strategy = StrategyEngine(log)
    risk_manager = RiskManager(log)

    print("\n" + "="*80)
    print(f"🔥 STARTING STRESS TEST: {failure_mode.upper()} 시나리오 실행 (3단계 과정)")
    print("="*80 + "\n")

    # 초기 상태 설정
    current_pnl = 5000 # 시작 자본금 가정
    system_status = "READY"

    # --- Step 1: Normal Operation (Baseline) ---
    log.record("System", "START", "INFO", "테스트 초기화 및 정상 운영 단계 진입.")
    strategy.analyze_market(data_feed)
    risk_manager.check_risk(current_pnl)

    time.sleep(1) 

    # --- Step 2: Failure Injection Point (위기 발생) ---
    if failure_mode == 'api_disconnect':
        log.record("System", "INJECT", "CRITICAL", f"[{failure_mode} 주입]: API 연결을 강제로 끊습니다. 시스템의 복원력을 테스트합니다.", {})
        # 데이터 피드 클래스 내부에서 예외를 발생시키도록 유도 (시뮬레이션)

    elif failure_mode == 'data_spike':
        log.record("System", "INJECT", "WARNING", f"[{failure_mode} 주입]: 시장에 비정상적인 급등/급락 스파이크가 감지되었습니다.", {})
        # 이 경우, StrategyEngine이 정상적으로 과열을 감지해야 함

    elif failure_mode == 'state_corruption':
        log.record("System", "INJECT", "CRITICAL", f"[{failure_mode} 주입]: 핵심 시스템 상태 변수(State Variable)가 손상되었습니다.", {})
        strategy.is_operational = False # 엔진 강제 비활성화

    # 실패 후 분석 및 리스크 체크 (시스템이 어떻게 반응하는지 관찰)
    try:
        system_status = strategy.analyze_market(data_feed)
        risk_manager.check_risk(current_pnl - 500) # PnL 하락 가정
    except Exception as e:
        log.record("System", "FAIL", "CRITICAL", f"예상된 시스템 오류 발생: {e.__class__.__name__}", {})

    time.sleep(1.5) 

    # --- Step 3: Recovery Attempt (복구 과정 시뮬레이션) ---
    log.record("System", "RECOVER_START", "WARNING", "시스템 복구 모드 진입. 자가 검증 및 정상화 프로세스를 시작합니다.")
    
    if failure_mode == 'state_corruption':
        strategy.is_operational = True # 수동 복구 가정
        log.record("System", "RECOVERY", "SUCCESS", "시스템 상태 변수를 재설정하고 엔진을 재활성화했습니다.", {})

    # 데이터 피드 재연결 시도 (실제 서비스에서는 여기에 백오프 로직이 들어감)
    try:
        recovered_price = data_feed.get_realtime_price("XAUUSD")
        final_status = strategy.analyze_market(data_feed)
        risk_manager.check_risk(current_pnl)
        log.record("System", "RECOVERY_COMPLETE", "SUCCESS", f"시스템이 {recovered_price:.2f} 수준에서 성공적으로 안정화되었습니다.", {})
    except Exception as e:
        log.record("System", "FAIL", "CRITICAL", f"복구 실패! 근본적인 시스템 재설계가 필요합니다: {e}", {})

    print("\n===============================================================")
    print(f"✅ 스트레스 테스트 완료: {failure_mode} 시나리오")
    log.record("System", "END", "INFO", "최종 검증 보고서를 생성했습니다.", {})
    return log.get_report()

if __name__ == "__main__":
    # 1. API Disconnect (외부 의존성 실패) 테스트
    run_e2e_stress_test('api_disconnect')
    print("\n" * 2)

    # 2. Data Spike (예측 불가능한 시장 변동성) 테스트
    run_e2e_stress_test('data_spike')
    print("\n" * 2)

    # 3. State Corruption (내부 로직 오류/상태 무결성 실패) 테스트
    run_e2e_stress_test('state_corruption')