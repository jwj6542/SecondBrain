import requests
import json

API_URL = "http://localhost:8000/api/v1/run_scenario"

def run_and_print(scenario_name):
    """지정된 시나리오를 실행하고, JSON 로그를 보기 좋게 출력합니다."""
    print("="*60)
    print(f"🚀 [테스트 시작] {scenario_name} 시나리오 실행 중...")
    try:
        response = requests.post(API_URL, json={"scenario": scenario_name})
        data = response.json()

        if data.get("status") == "success":
            print("\n✅ [테스트 성공] 구조화된 이벤트 로그 수신 완료:")
            for log in data['logs']:
                # 이 부분이 프론트엔드에서 애니메이션을 트리거 할 핵심 데이터임
                print(f"  [{log['severity']}] {log['state_id']} @ {int(log['timestamp']) % 1000}: {log['message']}")
            print("\n[출력 종료] 로그 구조가 정상적입니다. 프론트엔드 개발팀에 전달 가능합니다.")

        else:
            print(f"\n❌ [테스트 실패] API 응답 오류: {data}")

    except requests.exceptions.ConnectionError:
        print("🚨 연결 오류! FastAPI 서버가 실행 중인지 확인해주세요 (uvicorn main_script:app).")
    except Exception as e:
        print(f"알 수 없는 에러 발생: {e}")


if __name__ == "__main__":
    # 1. 시스템 리셋 테스트
    requests.get("http://localhost:8000/api/v1/reset_state")

    # 2. 위기 -> 오류 시나리오 테스트 (가장 중요한 부분)
    run_and_print("COLLAPSE")

    # 3. 복구 -> 안정화 시나리오 테스트 (회복력 증명)
    time.sleep(1) # API 요청 간 시간차 부여
    run_and_print("RECOVERY")