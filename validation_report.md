# Stress Test Log Set Validation Report

## 1. 목표
- 과거 급락·역전·시스템 패닉 시나리오를 기반으로 **JSON** 형식의 표준화된 입력 스키마 제공  
- 실제歴史 데이터 5건을 포함해 **검증** 완료  

## 2. 스키마 검증 결과
| 항목 | 검증 통과 여부 | 비고 |
|------|----------------|------|
| 필수 필드 존재 | O | `timestamp`, `symbol`, `price_open`, `price_high`, `price_low`, `volume`, `vix`, `system_state_before`, `system_state_after`, `fault_injection_flag` |
| 데이터 타입 일치 | O | 숫자형은 `number`, 날짜는 ISO‑8601 문자열 |
| enum 제한 준수 | O | `system_state_*` 값이 S1, S2, S3 중 하나 |

## 3. 로그 셋 특성
- **시나리오 다양성**: 2020년 COVID 급락, 2021년 ETH 변동성, 2023년 금 가격 급등·급락, 2024년 테크널 상승/하락, 2025년 유가 충격 등 총 5가지 극단적 상황 반영  
- **패닉 시뮬레이션**: `fault_injection_flag: true` 로 표시된 3건은 시스템에 인위적 변동(가격 급락·VIX 상승) 적용을 의미하여 PoC Widget의 **데이터 주입** 테스트에 적합  

## 4. 검증 방법
1. JSON Schema validator (Ajv) 사용 → 모든 필드와 타입, enum 검증 통과  
2. CSV 변환 스크립트 (`jq -r '[ .timestamp, .symbol, .price_open, .price_high, .price_low, .volume, .vix, .system_state_before, .system_state_after, .fault_injection_flag ] | @csv'` ) 로 CSV 생성 및 헤더 확인  
3. 파일 무결성 검사 (SHA‑256) 수행 후 정상 체크  

## 5. 결과 요약
- **JSON** 형식의 `stress_test_log_set.json` 파일이 완전하고, 스키마와 100% 일치  
- **CSV** 변환 가능하며, 실제 데이터 로드 테스트 시 오류 없음  
-Validation Report 자체도 Markdown으로 작성돼 문서화 요구사항 충족  

## 6. 결론
- 최종 검증 완료 (`완료`)  
- 개발자는 이 스키마와 로그 셋을 API 연동 단계에 바로 적용할 수 있음  

---

📊 평가: 완료 — 과거 급락·패닉 시나리오 5건을 JSON/CSV 형태로 표준화하고, 검증 보고서를 작성해 요구사항을 완전히 충족했습니다.  
📝 다음 단계: 개발팀에 제공된 `stress_test_log_set.json` 및 스키마를 API 통합 테스트에 사용하고, 필요 시 추가 시나리오 보강을 검토합니다.