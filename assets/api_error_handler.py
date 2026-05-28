import time
import logging

logging.basicConfig(level=logging.INFO)

def exponential_backoff(max_retries=5, base_delay=1):
    """지수 백오프를 적용하여 API 재시도 로직을 구현합니다."""
    for attempt in range(max_retries):
        try:
            yield time.sleep(base_delay * (2 ** attempt))
        except Exception as e:
            logging.warning(f"Backoff delay failed: {e}")

def robust_api_call(func, *args, fallback=None, max_retries=5):
    """API 호출을 감싸서 예외 처리와 재시도 로직을 적용합니다."""
    for attempt in exponential_backoff(max_retries):
        try:
            result = func(*args)
            return result # 성공 시 즉시 반환
        except Exception as e:
            logging.error(f"API Call Failed (Attempt {attempt+1}): {type(e).__name__} - {e}")
            if attempt < max_retries - 1:
                time.sleep(2) # 임의 대기 시간 추가 (실제로는 backoff가 처리함)
                continue
            else:
                logging.error("Maximum retries reached. Returning fallback data.")
                return fallback

# 사용 예시: robust_api_call(get_price, symbol="BTC/USD", fallback=0.0)