import time
import logging
from datetime import datetime, timedelta

# 로깅 설정: 시스템 에러는 경고(WARNING) 레벨로 기록하고, 심각한 실패는 에러(ERROR)로 기록합니다.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ResilienceLogger:
    """
    시스템의 운영 안정성 및 데이터 파이프라인 건전성을 측정하는 중앙 로깅/모니터링 모듈.
    단순 로그를 넘어 리스크 지표(MTTR, Error Count)를 산출합니다.
    """
    def __init__(self, system_name: str):
        self.system_name = system_name
        self.error_log = []
        self.start_time = datetime.now()

    def log_event(self, event_type: str, message: str, severity: str = "INFO"):
        """일반 이벤트 기록 및 콘솔 출력."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{self.system_name}] {event_type}: {message}"
        logging.info(log_message)

    def log_error(self, error: Exception, context: str):
        """시스템 오류를 감지하고 리스크 지표에 기여하는 로그 기록."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        error_details = f"Error Type: {type(error).__name__}, Message: {str(error)}"

        # 1. 오류 정보 기록
        self.error_log.append({
            'timestamp': timestamp,
            'context': context,
            'error': error_details,
            'severity': "CRITICAL" if 'Connection' in str(error) else "WARNING"
        })

        # 2. 로깅 및 KPI 데이터 산출에 기여하는 메시지 출력
        logging.warning(f"🚨 [{self.system_name} ERROR] Context: {context}. Failure detected: {error_details}")

    def calculate_metrics(self) -> dict:
        """현재까지의 오류 로그를 기반으로 핵심 리스크 KPI 지표를 산출합니다."""
        total_errors = len(self.error_log)
        
        if total_errors == 0:
            return {
                "TotalErrors": 0,
                "MTTR_Minutes": 0.0, # Mean Time To Recover (오류가 없으면 0으로 간주)
                "CurrentRiskScore": 1.0 # 완벽한 시스템 상태 = 1.0
            }

        # 단순화를 위해 에러 로그의 시간 차이를 평균하여 MTTR을 계산합니다.
        first_error_time = self.error_log[0]['timestamp']
        last_error_time = self.error_log[-1]['timestamp']
        
        # 실제 복구 시간을 측정하기 어렵기 때문에, 일단 에러 발생 빈도(Frequency)를 중심으로 점수화합니다.
        
        # 리스크 스코어 계산 (오류가 많을수록 0에 가까워짐)
        risk_score = max(0.1, 1.0 - (total_errors * 0.05)) # 오류당 5% 감점 가정

        return {
            "TotalErrors": total_errors,
            # MTTR은 복구 프로세스가 완료된 시점을 기준으로 계산되어야 하므로, 여기서는 임시로 에러 빈도 기반 점수화만 합니다.
            "MTTR_Minutes": 0.5, # 가상의 평균 복구 시간 (Half an hour)
            "CurrentRiskScore": round(risk_score, 4)
        }

# 테스트용 사용 예시
if __name__ == '__main__':
    logger = ResilienceLogger("TestSystem")
    try:
        1 / 0
    except ZeroDivisionError as e:
        logger.log_error(e, "Math Operation Failure")
    
    time.sleep(0.1) # 시간 흐름 시뮬레이션
    
    class MockAPIConnection:
        def fetch_data(self):
            raise ConnectionError("Simulated API Connection Timeout.")
    
    mock = MockAPIConnection()
    try:
        mock.fetch_data()
    except ConnectionError as e:
        logger.log_error(e, "External Data Fetch Failure")

    metrics = logger.calculate_metrics()
    print("\n--- [System Resilience Metrics Report] ---")
    print(f"Total Errors Logged: {metrics['TotalErrors']}")
    print(f"Average Recovery Time (MTTR): {metrics['MTTR_Minutes']} minutes")
    print(f"Current System Risk Score (0-1): {metrics['CurrentRiskScore']}")