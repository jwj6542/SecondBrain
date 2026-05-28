import time
import random
from datetime import datetime

# 전역 상태 정의: 'NORMAL', 'WARNING', 'CRISIS'
CURRENT_STATE = "NORMAL"

def get_current_system_data(trigger_crisis=False):
    """
    가상의 시스템 데이터를 반환합니다. 
    주로 VIX, RSI, 그리고 자본 보존 지표 (MDRR, CPR)를 포함합니다.
    :param trigger_crisis: 강제적으로 위기 상태를 트리거할지 여부 (테스트용)
    :return: 시스템 데이터 JSON 구조
    """
    global CURRENT_STATE

    if trigger_crisis and CURRENT_STATE != "CRISIS":
        CURRENT_STATE = "CRISIS"
    elif not trigger_crisis and CURRENT_STATE == "CRISIS":
        # 복구 과정이 진행되면 상태가 서서히 완화됨을 가정
        pass 
    
    base_vix = random.uniform(15, 25)

    if CURRENT_STATE == "NORMAL":
        vix = base_vix * random.uniform(0.9, 1.1)
        rsi = random.uniform(45, 65)
        mdrr = random.uniform(0.8, 0.95) # 안정적임
        cpr = random.uniform(0.7, 0.9)  # 높음
    elif CURRENT_STATE == "WARNING":
        vix = base_vix * random.uniform(1.2, 1.5) # 급격히 상승 시작
        rsi = random.uniform(30, 45)
        mdrr = random.uniform(0.6, 0.8) # 하락세 진입
        cpr = random.uniform(0.5, 0.7)
    elif CURRENT_STATE == "CRISIS":
        vix = base_vix * random.uniform(1.6, 2.2) # 최고점 찍고 유지/하락 시작
        rsi = random.uniform(15, 30)
        mdrr = random.uniform(0.2, 0.4) # 위험 수준
        cpr = random.uniform(0.1, 0.3)

    data = {
        "timestamp": datetime.now().isoformat(),
        "system_state": CURRENT_STATE,
        "metrics": {
            "VIX": round(vix, 2),
            "RSI": round(rsi, 2),
            "MDRR": round(mdrr, 3), # Maximum Drawdown Recovery Ratio
            "CPR": round(cpr, 3)   # Capital Preservation Rate
        },
        "description": f"현재 시스템 상태: {CURRENT_STATE}. VIX 급등 감지 여부: {'Yes' if vix > 30 else 'No'}."
    }
    return data

def transition_state(new_state):
    """시스템 상태를 변경하고 로그를 남깁니다."""
    global CURRENT_STATE
    if new_state in ["NORMAL", "WARNING", "CRISIS"]:
        CURRENT_STATE = new_state
        print(f"--- SYSTEM STATE CHANGED: {new_state} ---")

# 초기화 및 테스트용 데이터 생성 함수
def initialize_system():
    transition_state("NORMAL")
    return get_current_system_data()

if __name__ == "__main__":
    print("--- VIX State Simulator Initialized ---")
    # 1. Normal State Test
    print("\n[Test 1: Normal Operation]")
    print(get_current_system_data())
    time.sleep(1)
    
    # 2. Crisis Trigger Test
    print("\n[Test 2: Simulating Market Panic (Crisis)]")
    transition_state("CRISIS")
    for i in range(3):
        data = get_current_system_data()
        print(f"--- Tick {i+1} --- {data['metrics']['VIX']} VIX, State: {data['system_state']}")
        time.sleep(0.5)

    # 3. Recovery Flow Test (Manual transition for simplicity in stub)
    print("\n[Test 3: Simulating Gradual Recovery]")
    transition_state("WARNING")
    for i in range(2):
        data = get_current_system_data()
        print(f"--- Tick {i+1} --- {data['metrics']['VIX']} VIX, State: {data['system_state']}")
        time.sleep(0.5)
    transition_state("NORMAL")
    print("\n[Test 3 Finished]")

# 이 스크립트는 프론트엔드 컴포넌트가 호출하여 실시간 데이터를 받아오는 백엔드 API 역할을 수행합니다.