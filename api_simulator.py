from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import random
from datetime import datetime, timedelta
import numpy as np

# --- Data Models (Pydantic Schema) ---
class StressMetric(BaseModel):
    """시간대별 스트레스 테스트 측정 지표."""
    timestamp: str  # UTC 기준 ISO 8601 형식
    current_drawdown: float # 현재 자본 대비 손실률 (%)
    rsi: float            # 시스템 복원력 지수 (Resilience Index)
    mdrr: float           # 최대 낙폭 대비 회복률 (Recovery Rate, %)
    system_status: str    # System Status (Normal, Warning, Critical)

class StressTestResult(BaseModel):
    """전체 스트레스 테스트 결과 리스트."""
    metrics: List[StressMetric]
    summary: Dict[str, float] # 최종 요약 지표

app = FastAPI(title="Premium Monitoring Service API")

# --- Simulation Logic ---

def generate_mock_data(num_points: int = 10) -> List[StressMetric]:
    """
    가상의 스트레스 테스트 데이터 포인트를 생성합니다.
    시뮬레이션 로직: 초기 안정 상태 -> 갑작스러운 하락 (스트레스) -> 점진적 회복 시도.
    """
    metrics = []
    start_time = datetime.utcnow() - timedelta(minutes=num_points * 5)

    # 초기값 설정 (안정적인 상태로 시작)
    current_drawdown = 0.1
    rsi = 90.0 # 높음 = 안정적
    mdrr = 95.0 # 높음 = 회복력 좋음

    for i in range(num_points):
        timestamp = (start_time + timedelta(minutes=i * 5)).isoformat() + 'Z'

        # 1. 스트레스 주입 로직 (가장 변동성이 큰 시점에 Drawdown과 RSI 하락)
        if i > num_points // 2 and i < num_points - 2:
            # 시장 급변성 구간 -> 자본 손실 증가, 복원력 지수 하락
            current_drawdown += random.uniform(0.5, 1.5) * (i / num_points)
            rsi = np.clip(rsi - random.uniform(3, 7), 20, 90) # 급격히 떨어짐
            mdrr -= random.uniform(1, 3) # 회복력 저하
        else:
            # 안정 또는 회복 구간 -> 손실은 유지되거나 감소하며 복원력을 조금씩 끌어올림
            current_drawdown = max(0.1, current_drawdown + random.uniform(-0.2, 0.3))
            rsi = np.clip(rsi + random.uniform(0.5, 2), 40, 90) # 서서히 회복
            mdrr = min(100.0, mdrr + random.uniform(0.5, 2))

        # 2. 안전장치 및 클리핑 (최대/최소 범위 제한)
        current_drawdown = np.clip(current_drawdown, 0.0, 10.0) # 최대 낙폭 10%로 제한
        rsi = np.clip(rsi, 20, 95)
        mdrr = np.clip(mdrr, 50, 100)

        # 3. Status 결정 (리스크 지표 기반)
        if current_drawdown > 5.0 or rsi < 40:
            status = "Critical" # 위험 임계치 초과
        elif current_drawdown > 2.5 or rsi < 60:
            status = "Warning" # 경고 단계 진입
        else:
            status = "Normal"

        metrics.append(StressMetric(
            timestamp=timestamp,
            current_drawdown=round(current_drawdown, 2),
            rsi=round(rsi, 1),
            mdrr=round(mdrr, 1),
            system_status=status
        ))

    # 요약 지표 계산 (최종 drawdnow, 평균 RSI 등)
    summary = {
        "final_drawdown": round(metrics[-1].current_drawdown, 2),
        "average_rsi": round(np.mean([m.rsi for m in metrics]), 1),
        "min_mdrr": round(min([m.mdrr for m in metrics]), 1)
    }

    return StressTestResult(metrics=metrics, summary=summary)


@app.get("/api/v1/stress_test_metrics", response_model=StressTestResult)
async def get_stress_test_metrics():
    """스트레스 테스트 시뮬레이션 데이터를 반환합니다."""
    print("--- [INFO] Stress Test Data Simulation Running ---")
    return generate_mock_data(num_points=15)

# --- 실행 가이드 및 문서화 ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)