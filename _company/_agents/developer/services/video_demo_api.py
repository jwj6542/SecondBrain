import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

# Step 1에서 수정한 핵심 서비스 모듈 임포트 가정
from services.StateOrchestratorService import StateOrchestratorService 

app = FastAPI(title="Video Demo API", description="Stress Test 시나리오를 위한 구조화된 이벤트 스트림 제공.")

class EventLog(BaseModel):
    timestamp: float
    severity: str # WARNING, ERROR, NORMAL
    state_id: str
    message: str
    data_payload: Dict[str, any]

# 전역 서비스 인스턴스화 (실제 환경에서는 DI 컨테이너 사용 권장)
orchestrator = StateOrchestratorService() 


@app.get("/api/v1/reset_state")
def reset_system_state():
    """시스템 상태를 초기화하고, 데모 시퀀스 시작 준비."""
    # 실제 서비스의 Reset 로직 호출
    orchestrator.reset() 
    return {"status": "success", "message": "System state reset. Ready for demo sequence."}

@app.post("/api/v1/run_scenario")
async def run_stress_scenario(scenario: str = "DEFAULT"):
    """
    특정 시나리오(예: 'COLLAPSE', 'RECOVERY')를 실행하고 구조화된 이벤트 로그 스트림을 반환합니다.
    이 함수는 반복 호출 가능하도록 설계되었습니다.
    """
    print(f"--- Running Scenario: {scenario} ---")
    event_logs: List[EventLog] = []

    try:
        # 1. 초기 정상 상태 이벤트 기록 (필수)
        event_logs.append(EventLog(timestamp=time.time(), severity="NORMAL", state_id="INITIAL", message="System operational.", data_payload={"capital": "stable"}))

        if scenario == "COLLAPSE":
            # 2. 위협/경고 단계 시뮬레이션 (Warning)
            await orchestrator.simulate_warning("Liquidity Breach")
            event_logs.append(EventLog(timestamp=time.time(), severity="WARNING", state_id="LOW_LIQUIDITY", message="🚨 경고: 유동성 임계치 하락 감지.", data_payload={"liquidity_ratio": 0.5}))

            # 강제 에러 트랜지션 (Error)
            await orchestrator.simulate_error("API Disconnect")
            event_logs.append(EventLog(timestamp=time.time(), severity="ERROR", state_id="API_DISCONNECTED", message="❌ 치명적 오류: 데이터 피드 연결 끊김.", data_payload={"source": "MarketFeed"}))

        elif scenario == "RECOVERY":
            # 3. 복구 단계 시뮬레이션 (Warning -> Normal)
            await orchestrator.simulate_warning("Volatility Spike")
            event_logs.append(EventLog(timestamp=time.time(), severity="WARNING", state_id="HIGH_VOLATILITY", message="⚠️ 경고: 변동성 급증 감지.", data_payload={"volatility_index": 3.5}))

            await orchestrator.simulate_recovery()
            event_logs.append(EventLog(timestamp=time.time(), severity="NORMAL", state_id="STABLE", message="✅ 복구 성공: 시스템 안정화 완료.", data_payload={"capital_preserved": True}))

        else:
            raise HTTPException(status_code=400, detail="Unknown scenario provided.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


    return {"status": "success", "logs": event_logs}

# 로컬 테스트를 위한 간단한 실행 명령어 추가 (개발 편의성)
if __name__ == "__main__":
    import uvicorn
    print("--- Starting Video Demo API Server ---")
    uvicorn.run(app, host="0.0.0.0", port=8000)