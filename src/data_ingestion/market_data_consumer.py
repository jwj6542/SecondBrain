import json
import time
from typing import Callable, Dict

# 콜백 함수 정의: 데이터를 수신하면 바로 FSM 엔진에 전달하도록 만듭니다.
ProcessDataCallback = Callable[[Dict[str, float]], None]

class MarketDataConsumer:
    """외부 스트리밍 API에서 실시간 금융 데이터를 소비하는 클래스."""
    def __init__(self, callback_func: ProcessDataCallback):
        self.callback = callback_func
        print("Market Data Consumer Ready. Waiting for WebSocket connection...")

    def start_websocket_stream(self, url: str):
        """WebSocket 연결을 시작하는 로직 (실제 구현 필요)."""
        # TODO: 실제 websocket 라이브러리 (e.g., websockets)를 사용하여 연결 로직 작성
        print(f"Connecting to stream URL: {url}")

    def simulate_data_ingestion(self, data_payload: Dict[str, Any]):
        """테스트 또는 시뮬레이션 목적으로 데이터를 주입합니다."""
        try:
            # 1. 데이터 클렌징 및 정규화 (핵심)
            processed_data = self._normalize_data(data_payload)
            
            if processed_data:
                print(f"\n[DATA RECEIVED] VIX={processed_data['vix']:.2f}, Volatility={processed_data['volatility']:.2f}")
                # 2. 정규화된 데이터를 FSM 엔진에 전달 (콜백 호출)
                self.callback(processed_data)

        except Exception as e:
            print(f"Error during data processing: {e}")


    def _normalize_data(self, raw_payload: Dict[str, Any]) -> Dict[str, float] or None:
        """원시 데이터에서 필요한 지표만 추출하여 Dictionary 형태로 반환합니다."""
        # 예시 로직: 실제 API 응답 구조에 맞게 조정해야 합니다.
        if 'vix' in raw_payload and 'volatility' in raw_payload:
            return {
                "vix": float(raw_payload['vix']), 
                "volatility": float(raw_payload['volatility'])
            }
        return None

# --- 사용 예시 (main.py에서 호출될 구조) ---
if __name__ == '__main__':
    def handle_data(processed_data: Dict[str, float]):
        # 이 함수가 FSMStateEngine의 process_data를 호출합니다.
        from state_machine.fsm_engine import FSMStateEngine, NormalState
        engine = FSMStateEngine(NormalState) # 재설정 필요
        state, changed = engine.process_data(processed_data)
        print("\n[FINAL STATUS] 현재 상태:", state.get_current_state_info())

    consumer = MarketDataConsumer(callback_func=handle_data)
    
    # 1. 정상 데이터 시뮬레이션 (전이 없음 예상)
    normal_payload = {'vix': '18.5', 'volatility': '0.15'}
    consumer.simulate_data_ingestion(normal_payload)

    time.sleep(1)

    # 2. 위기 데이터 시뮬레이션 (전이 발생 예상)
    crisis_payload = {'vix': '23.1', 'volatility': '0.4'}
    consumer.simulate_data_ingestion(crisis_payload)