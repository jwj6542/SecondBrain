import time
from typing import Dict, Any, List
import json

# --- Mock API Simulation Layer (API 엔드포인트 5개 모킹) ---
def get_price(market: str, timestamp: float, state: str) -> Dict[str, Any]:
    """가상의 가격 데이터 API. 상태에 따라 응답을 조작합니다."""
    if "Error" in state or "Warning" in state:
        return {"error": f"Market {market} data unavailable due to system status: {state}", "price": None}
    elif "Normal" in state and market == "XAUUSD":
        return {"success": True, "symbol": market, "price": 1950.0 + (time.time() % 10)} # 정상 변동
    else:
        # 복구/안정 상태에서 안정적인 값 반환 가정
        return {"success": True, "symbol": market, "price": 1960.0}

def get_liquidity(market: str, timestamp: float, state: str) -> Dict[str, Any]:
    """가상의 유동성 지표 API."""
    if "Error" in state or "Warning" in state:
        return {"error": f"Liquidity data compromised in {state} state.", "value": 0.1}
    elif "Normal" in state and market == "NASDAQ":
        # 정상 상태에서 자연스러운 유동성 변화 시뮬레이션
        return {"success": True, "symbol": market, "liquidity_index": 0.8 + (time.time() % 0.2)}
    else:
        return {"success": True, "symbol": market, "liquidity_index": 0.75}

def get_confidence(market: str, timestamp: float, state: str) -> Dict[str, Any]:
    """가상의 신용/자신감 지수 API."""
    if "Error" in state or "Warning" in state:
        return {"error": f"Confidence metrics fluctuate wildly during {state}.", "score": 0.1}
    elif "Normal" in state and market == "ETH":
        return {"success": True, "symbol": market, "confidence_score": 0.6 + (time.time() % 0.3)}
    else:
        return {"success": True, "symbol": market, "confidence_score": 0.7}

def get_volume(market: str, timestamp: float, state: str) -> Dict[str, Any]:
    """가상의 거래량 API."""
    if "Error" in state or "Warning" in state:
        return {"error": f"Volume data stream interrupted by {state} event.", "volume_k": 0.0}
    else:
        # 모든 상태에서 최소한의 기본값을 유지한다고 가정 (안정화된 값)
        return {"success": True, "symbol": market, "volume_k": 150 + (time.time() % 50)}

def get_risk_score(market: str, timestamp: float, state: str) -> Dict[str, Any]:
    """가상의 종합 리스크 점수 API."""
    if "Error" in state or "Warning" in state:
        # 가장 취약한 시점에서 극단적인 값 반환을 유도
        return {"error": f"Critical risk score detected. Cannot calculate precise metric.", "score": 0.95 if "Warning" in state else 1.2}
    else:
        # 상태에 따라 리스크 점수 변화를 제어 (정상=낮음, 안정=매우 낮음)
        if "Normal" in state: return {"success": True, "score": 0.3 + (time.time() % 0.1)}
        return {"success": True, "score": 0.15}

# --- State Orchestrator Core ---
class StateOrchestratorService:
    def __init__(self):
        print("⚙️ Initializing State Orchestrator Service...")
        self.history = []
        self.current_state = "Initialization"

    def run_e2e_simulation(self, duration_seconds: int = 10) -> List[Dict[str, Any]]:
        """시스템 상태 변화 전 과정을 시뮬레이션하고 기록합니다."""
        print("✅ Starting E2E State Transition Simulation...")
        start_time = time.time()
        
        # 정의된 상태 전환 순서: Normal -> Warning -> Error -> Recovery -> Stable
        state_sequence = [
            ("Normal", 3),    # 정상 상태 (3초)
            ("Warning", 2),   # 경고 발생 (2초)
            ("Error", 1.5),   # 시스템 오류 임계치 도달 (1.5초)
            ("Recovery", 2.5),# 복구 시도 및 지표 개선 (2.5초)
            ("Stable", 1)     # 최종 안정화 완료 (1초)
        ]

        for state_name, duration in state_sequence:
            self.current_state = state_name
            print(f"\n[STATE TRANSITION]: -> {state_name} State Detected. Simulating for {duration:.1f}s...")
            
            start_step_time = time.time()
            while (time.time() - start_step_time) < duration:
                timestamp = time.time()
                step_data = self._execute_api_cycle(timestamp, state_name)
                self.history.append({"state": state_name, "timestamp": timestamp, "steps": step_data})
                time.sleep(0.2) # 시뮬레이션 간격 (데이터 스트림 흉내)

        print("\n✅ Simulation Complete.")
        return self.history

    def _execute_api_cycle(self, timestamp: float, state: str) -> List[Dict[str, Any]]:
        """현재 상태를 기반으로 모든 API를 호출하고 데이터를 수집합니다."""
        results = []
        market_pairs = ["XAUUSD", "NASDAQ", "ETH"] # 시뮬레이션 마켓 정의

        # 1. 가격 데이터 (Price)
        price_data = get_price(market_pairs[0], timestamp, state)
        results.append({"api": "get_price", "market": market_pairs[0], "result": price_data})

        # 2. 유동성 지표 (Liquidity)
        liquidity_data = get_liquidity(market_pairs[1], timestamp, state)
        results.append({"api": "get_liquidity", "market": market_pairs[1], "result": liquidity_data})

        # 3. 신용 지수 (Confidence)
        confidence_data = get_confidence(market_pairs[2], timestamp, state)
        results.append({"api": "get_confidence", "market": market_pairs[2], "result": confidence_data})

        # 4. 거래량 (Volume)
        volume_data = get_volume(market_pairs[0], timestamp, state)
        results.append({"api": "get_volume", "market": market_pairs[0], "result": volume_data})
        
        # 5. 종합 리스크 점수 (Risk Score) - 핵심 지표
        risk_score = get_risk_score(None, timestamp, state)
        results.append({"api": "get_risk_score", "market": None, "result": risk_score})

        return results


# --- Main Execution Block ---
if __name__ == "__main__":
    orchestrator = StateOrchestratorService()
    simulation_history = orchestrator.run_e2e_simulation(duration_seconds=10)

    output_path = "E2E_Simulation_Log_{}.json".format(time.strftime("%Y%m%d_%H%M%S"))
    with open(output_path, 'w') as f:
        json.dump(simulation_history, f, indent=4)
        
    print(f"\n✨ E2E 시뮬레이션 로그가 {output_path} 에 저장되었습니다.")
    print("이 파일을 기반으로 기술 검증 보고서를 작성할 수 있습니다.")

# END OF STATE ORCHESTRATOR SERVICE FILE