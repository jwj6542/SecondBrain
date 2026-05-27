# auto_trader/config.py
import os

# === 트레이딩 파라미터 ===
EMA_FAST_PERIOD = 9          # 단기 EMA 기간
EMA_SLOW_PERIOD = 21         # 장단기 EMA 기간
RSI_PERIOD = 14              # RSI 계산 기간
RISK_PERCENT = 0.01          # 포지션당 위험 비율 (1%)
DAILY_LOSS_LIMIT = 0.03      # 일일 손실 한도 (3%)

# === 환경 설정 ===
TIMEZONE = "UTC"             # 모든 시간은 UTC 기준