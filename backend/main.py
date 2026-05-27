import io
import os
import json
import time
import math
import asyncio
import threading
from typing import Dict, List, Optional
from datetime import datetime, timedelta

import pandas as pd
import ta
import ccxt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# MT5의 경우 Windows 환경에서만 활성화되므로 예외처리 구조 탑재
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    MT5_AVAILABLE = False

app = FastAPI(title="Jabis Trading Backend")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

# 시스템 상태 전역 변수
trading_thread: Optional[threading.Thread] = None
stop_event = threading.Event()
system_logs: List[Dict] = []
paper_positions: List[Dict] = []
paper_balance = 100000.0
paper_initial_balance = 100000.0
daily_realized_pnl = 0.0
start_time: Optional[datetime] = None

# 실시간 시세 및 지표 데이터 저장소 (대시보드 차트용)
market_data_cache: Dict[str, List[Dict]] = {}

def add_log(log_type: str, message: str):
    log_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": log_type,
        "message": message
    }
    system_logs.insert(0, log_entry)
    # 최대 500개 유지
    if len(system_logs) > 500:
        system_logs.pop()
    print(f"[{log_type}] {message}")

def load_config() -> Dict:
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading config: {e}")
    # 기본값
    return {
        "trading_active": False,
        "paper_trading": True,
        "binance": {"api_key": "", "secret_key": "", "leverage": 3, "risk_percent": 1.0},
        "hantec": {"login": "", "password": "", "server": "", "risk_percent": 1.0},
        "daily_loss_limit_percent": 3.0,
        "timeframe": "1m"
    }

def save_config(config: Dict):
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving config: {e}")

# Pydantic 모델
class ConfigModel(BaseModel):
    trading_active: bool
    paper_trading: bool
    binance: dict
    hantec: dict
    daily_loss_limit_percent: float
    timeframe: str

# ----------------- 트레이딩 엔진 & 전략 구현 -----------------

# 거래 대상 심볼 목록
BINANCE_SYMBOLS = ["BTC/USDT", "ETH/USDT", "XRP/USDT", "EOS/USDT", "SOL/USDT"]
MT5_SYMBOLS = ["XAUUSD", "US100", "WTI"] # XAUUSD(골드), US100(나스닥), WTI(오일)

# CCXT 및 MT5 인스턴스 초기화용 헬퍼
def get_binance_client(config: Dict) -> Optional[ccxt.binance]:
    if config["paper_trading"]:
        return None
    api_key = config["binance"].get("api_key")
    secret_key = config["binance"].get("secret_key")
    if not api_key or not secret_key:
        return None
    
    return ccxt.binance({
        "apiKey": api_key,
        "secret": secret_key,
        "options": {"defaultType": "future"}, # 선물(Futures)로 설정하여 숏 가능
        "enableRateLimit": True,
    })

def init_mt5(config: Dict) -> bool:
    if not MT5_AVAILABLE:
        return False
    if config["paper_trading"]:
        return True
    
    hantec = config["hantec"]
    login = hantec.get("login")
    password = hantec.get("password")
    server = hantec.get("server")
    
    if not login or not password or not server:
        return False
        
    try:
        if not mt5.initialize():
            return False
        # 로그인 시도
        authorized = mt5.login(login=int(login), password=password, server=server)
        if not authorized:
            mt5.shutdown()
            return False
        return True
    except Exception as e:
        print(f"MT5 Init Error: {e}")
        return False

# 가상 데이터 제너레이터 (Paper Trading 또는 API 미입력시 테스트용)
def generate_mock_candle(symbol: str, prev_close: float) -> Dict:
    import random
    change = random.uniform(-0.005, 0.005)
    close_val = prev_close * (1.0 + change)
    high_val = max(prev_close, close_val) * (1.0 + random.uniform(0, 0.003))
    low_val = min(prev_close, close_val) * (1.0 - random.uniform(0, 0.003))
    open_val = prev_close
    return {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "open": open_val,
        "high": high_val,
        "low": low_val,
        "close": close_val,
        "volume": random.uniform(10, 1000)
    }

# 기술적 지표 계산 함수 (볼린저 밴드 & RSI)
def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
    # 볼린저 밴드 (20, 2)
    indicator_bb = ta.volatility.BollingerBands(close=df['close'], window=20, window_dev=2)
    df['bb_h'] = indicator_bb.bollinger_hband()
    df['bb_l'] = indicator_bb.bollinger_lband()
    
    # 더블비 볼린저 밴드 (44, 2)
    indicator_bb44 = ta.volatility.BollingerBands(close=df['close'], window=44, window_dev=2)
    df['bb44_h'] = indicator_bb44.bollinger_hband()
    df['bb44_l'] = indicator_bb44.bollinger_lband()
    
    # 중단선: 이동평균선 SMA 20 (볼린저 밴드 중간선 대체)
    df['sma20'] = ta.trend.SMAIndicator(close=df['close'], window=20).sma_indicator()
    
    # RSI (14)
    df['rsi'] = ta.momentum.RSIIndicator(close=df['close'], window=14).rsi()
    
    return df

# 메인 트레이딩 루프 스레드 함수
def trading_loop(config: Dict):
    global paper_balance, daily_realized_pnl, start_time
    add_log("INFO", "자동매매 엔진이 가동되었습니다.")
    
    binance = get_binance_client(config)
    mt5_active = init_mt5(config)
    
    # 가상 자산 초기 잔고 세팅
    prev_mock_prices = {
        "BTC/USDT": 67000.0, "ETH/USDT": 3500.0, "XRP/USDT": 0.52, "EOS/USDT": 0.8, "SOL/USDT": 160.0,
        "XAUUSD": 2350.0, "US100": 18500.0, "WTI": 78.5
    }
    
    while not stop_event.is_set():
        try:
            # 1. 일일 손실 제한(Daily Stop Loss) 검증
            current_loss_percent = -(daily_realized_pnl / paper_initial_balance) * 100
            if current_loss_percent >= config["daily_loss_limit_percent"]:
                add_log("ALERT", f"🚨 일일 손실 한도({config['daily_loss_limit_percent']}%)를 초과하여 자동매매를 즉시 강제 종료합니다. (현재 손실률: {current_loss_percent:.2f}%)")
                # 모든 포지션 청산 및 엔진 비활성화
                close_all_positions(binance, config)
                config["trading_active"] = False
                save_config(config)
                break
                
            # 2. 각 자산군 시세 수집 및 전략 감지
            symbols_to_process = BINANCE_SYMBOLS + MT5_SYMBOLS
            
            for symbol in symbols_to_process:
                if stop_event.is_set():
                    break
                
                # 시세 캔들 데이터 수집 (Paper Trading 모드 시 시뮬레이션)
                if config["paper_trading"] or (symbol in BINANCE_SYMBOLS and not binance) or (symbol in MT5_SYMBOLS and not mt5_active):
                    # 가상 시뮬레이션 데이터 생성
                    prev_close = prev_mock_prices[symbol]
                    mock_candle = generate_mock_candle(symbol, prev_close)
                    prev_mock_prices[symbol] = mock_candle["close"]
                    
                    # 캐시에 저장
                    if symbol not in market_data_cache:
                        market_data_cache[symbol] = []
                    
                    # 100개 제한
                    market_data_cache[symbol].append(mock_candle)
                    if len(market_data_cache[symbol]) > 100:
                        market_data_cache[symbol].pop(0)
                        
                    df = pd.DataFrame(market_data_cache[symbol])
                else:
                    # 실거래 데이터 fetch
                    df = fetch_real_candles(symbol, binance, config["timeframe"])
                
                if len(df) < 44:
                    # BB 44 계산을 위해 충분한 데이터(44개)가 쌓일 때까지 대기
                    continue
                
                # 지표 계산
                df = calculate_indicators(df)
                
                # 최신 캔들과 이전 캔들 추출
                curr_row = df.iloc[-1]
                prev_row = df.iloc[-2]
                
                # 가상 포지션 평가 손익(PnL) 실시간 계산
                update_open_positions(symbol, curr_row["close"])
                
                # 3. 김직선 더블비 역추세 전략 신호 분석
                # RSI 및 볼린저 밴드 값 추출
                curr_close = curr_row["close"]
                prev_close = prev_row["close"]
                
                # BB 20 상/하단
                curr_bb_h = curr_row["bb_h"]
                curr_bb_l = curr_row["bb_l"]
                
                # BB 44 상/하단 (더블비)
                curr_bb44_h = curr_row["bb44_h"]
                curr_bb44_l = curr_row["bb44_l"]
                
                # 중단선: SMA 20 (이동평균선)
                curr_sma20 = curr_row["sma20"]
                
                curr_rsi = curr_row["rsi"]
                
                # 이탈 및 복귀 정보 체크 (더블비 조건 반영)
                # LONG: 이전 종가가 BB 20 하단 또는 BB 44 하단 이탈 후 두 하단 위로 복귀, RSI <= 30
                is_long_signal = (
                    (prev_close < prev_row["bb_l"] or prev_close < prev_row["bb44_l"]) and
                    (curr_close > curr_bb_l and curr_close > curr_bb44_l) and
                    (curr_rsi <= 30)
                )
                
                # SHORT: 이전 종가가 BB 20 상단 또는 BB 44 상단 이탈 후 두 상단 아래로 복귀, RSI >= 70
                is_short_signal = (
                    (prev_close > prev_row["bb_h"] or prev_close > prev_row["bb44_h"]) and
                    (curr_close < curr_bb_h and curr_close < curr_bb44_h) and
                    (curr_rsi >= 70)
                )
                
                # 포지션 존재 여부 확인
                position = get_position(symbol)
                
                if not position:
                    # 신규 롱 진입
                    if is_long_signal:
                        execute_entry(symbol, "LONG", curr_close, df, config, binance)
                    # 신규 숏 진입
                    elif is_short_signal:
                        execute_entry(symbol, "SHORT", curr_close, df, config, binance)
                else:
                    # 포지션 보유 중인 경우 청산 및 리스크 관리 실행
                    direction = position["direction"]
                    entry_price = position["entry_price"]
                    stop_loss = position["stop_loss"]
                    half_cleared = position.get("half_cleared", False)
                    
                    # A. 손절선(Stop Loss) 도달 확인
                    if (direction == "LONG" and curr_close <= stop_loss) or (direction == "SHORT" and curr_close >= stop_loss):
                        execute_exit(symbol, position, curr_close, "STOP_LOSS", config, binance)
                    
                    # B. 1차 익절 (SMA 20 중단선 터치 시 본절 스톱로스 이동 및 50% 분할 청산)
                    elif not half_cleared and ((direction == "LONG" and curr_close >= curr_sma20) or (direction == "SHORT" and curr_close <= curr_sma20)):
                        execute_partial_exit(symbol, position, curr_close, config, binance)
                        
                    # C. 2차 완청 (반대편 밴드 터치 시 전량 청산)
                    elif (direction == "LONG" and curr_close >= curr_bb_h) or (direction == "SHORT" and curr_close <= curr_bb_l):
                        execute_exit(symbol, position, curr_close, "TAKE_PROFIT", config, binance)
            
            # 5초 간격 분석
            time.sleep(5)
            
        except Exception as e:
            add_log("WARN", f"트레이딩 분석 중 일시적 오류 발생: {e}")
            time.sleep(5)

# 가상 및 실제 캔들 가져오기
def fetch_real_candles(symbol: str, binance: Optional[ccxt.binance], timeframe: str) -> pd.DataFrame:
    try:
        if symbol in BINANCE_SYMBOLS and binance:
            # 바이낸스 선물 봉 데이터 가져오기
            ohlcv = binance.fetch_ohlcv(symbol, timeframe, limit=100)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['time'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        elif symbol in MT5_SYMBOLS and MT5_AVAILABLE:
            # MT5 봉 데이터 가져오기
            # symbol명 매핑 (브로커에 따라 차이 가능)
            mt5_symbol = symbol
            timeframe_map = {"1m": mt5.TIMEFRAME_M1, "5m": mt5.TIMEFRAME_M5, "15m": mt5.TIMEFRAME_M15}
            tf = timeframe_map.get(timeframe, mt5.TIMEFRAME_M1)
            
            rates = mt5.copy_rates_from_pos(mt5_symbol, tf, 0, 100)
            if rates is not None and len(rates) > 0:
                df = pd.DataFrame(rates)
                df['time'] = pd.to_datetime(df['time'], unit='s')
                # open, high, low, close 변환
                df = df.rename(columns={'tick_volume': 'volume'})
                return df
    except Exception as e:
        print(f"Error fetching real candles for {symbol}: {e}")
    
    # 실패 시 캐시된 mock 데이터 사용 리턴
    if symbol in market_data_cache and len(market_data_cache[symbol]) > 0:
        return pd.DataFrame(market_data_cache[symbol])
    return pd.DataFrame()

# 포지션 제어 유틸 함수
def get_position(symbol: str) -> Optional[Dict]:
    for pos in paper_positions:
        if pos["symbol"] == symbol:
            return pos
    return None

def update_open_positions(symbol: str, current_price: float):
    global paper_balance
    for pos in paper_positions:
        if pos["symbol"] == symbol:
            pos["current_price"] = current_price
            # PnL 계산
            diff = current_price - pos["entry_price"]
            if pos["direction"] == "SHORT":
                diff = -diff
            
            # 바이낸스 선물/MT5 마진 계산 모사 (계약 크기 및 레버리지 반영)
            pos["pnl"] = diff * pos["size"] * 100.0 if "XAUUSD" in symbol else diff * pos["size"]

def execute_entry(symbol: str, direction: str, entry_price: float, df: pd.DataFrame, config: Dict, binance: Optional[ccxt.binance]):
    global paper_positions, paper_balance
    
    # 손절선 계산 (직전 3개 캔들의 최고/최저점)
    recent_candles = df.iloc[-4:-1]
    if direction == "LONG":
        stop_loss = recent_candles["low"].min() * 0.999 # 최저가 살짝 아래
        if stop_loss >= entry_price:
            stop_loss = entry_price * 0.995
    else:
        stop_loss = recent_candles["high"].max() * 1.001 # 최고가 살짝 위
        if stop_loss <= entry_price:
            stop_loss = entry_price * 1.005
            
    # 리스크 1% 규칙 기반 포지션 사이징 수량 계산
    risk_percent = config["binance"]["risk_percent"] if symbol in BINANCE_SYMBOLS else config["hantec"]["risk_percent"]
    risk_amount = paper_balance * (risk_percent / 100.0)
    price_diff = abs(entry_price - stop_loss)
    
    if price_diff == 0:
        size = 1.0
    else:
        size = risk_amount / price_diff
        
    # 소수점 수량 조절
    size = round(size, 4)
    if size <= 0:
        size = 0.01
        
    # 포지션 기록 생성
    new_position = {
        "symbol": symbol,
        "direction": direction,
        "entry_price": entry_price,
        "current_price": entry_price,
        "size": size,
        "stop_loss": stop_loss,
        "half_cleared": False,
        "pnl": 0.0,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # 실제 거래 주문 처리
    if not config["paper_trading"]:
        try:
            if symbol in BINANCE_SYMBOLS and binance:
                # CCXT 주문 실행 (Futures 시장가 진입)
                side = "buy" if direction == "LONG" else "sell"
                binance.create_market_order(symbol, side, size)
                add_log("INFO", f"🔔 [실제 매매] 바이낸스 선물 {symbol} {direction} {size}계약 시장가 체결 완료.")
            elif symbol in MT5_SYMBOLS and MT5_AVAILABLE:
                # MT5 주문 실행
                mt5_direction = mt5.ORDER_TYPE_BUY if direction == "LONG" else mt5.ORDER_TYPE_SELL
                request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": symbol,
                    "volume": float(size),
                    "type": mt5_direction,
                    "price": entry_price,
                    "sl": float(stop_loss),
                    "deviation": 20,
                    "magic": 234000,
                    "comment": "Jabis BB-RSI Engine",
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": mt5.ORDER_FILLING_IOC,
                }
                result = mt5.order_send(request)
                if result.retcode != mt5.TRADE_RETCODE_DONE:
                    add_log("WARN", f"❌ [실제 매매] 한텍마켓(MT5) {symbol} 주문 실패: {result.comment}")
                    return
                add_log("INFO", f"🔔 [실제 매매] 한텍마켓(MT5) {symbol} {direction} {size}계약 체결 완료.")
        except Exception as e:
            add_log("WARN", f"주문 체결 도중 에러 발생: {e}")
            return
            
    # Paper Trading 모드 및 성공 시 포지션 리스트 등록
    paper_positions.append(new_position)
    add_log("INFO", f"✅ [진입 알림] {symbol} {direction} 포지션 진입. (진입가: ${entry_price:.2f}, 손절가: ${stop_loss:.2f}, 수량: {size})")

def execute_partial_exit(symbol: str, position: Dict, current_price: float, config: Dict, binance: Optional[ccxt.binance]):
    global paper_balance, daily_realized_pnl
    
    # 50% 분할 익절 적용
    original_size = position["size"]
    half_size = round(original_size / 2, 4)
    if half_size <= 0:
        half_size = original_size
        
    diff = current_price - position["entry_price"]
    if position["direction"] == "SHORT":
        diff = -diff
        
    partial_pnl = diff * half_size * 100.0 if "XAUUSD" in symbol else diff * half_size
    paper_balance += partial_pnl
    daily_realized_pnl += partial_pnl
    
    # 실제 부분 청산 주문
    if not config["paper_trading"]:
        try:
            if symbol in BINANCE_SYMBOLS and binance:
                side = "sell" if position["direction"] == "LONG" else "buy"
                binance.create_market_order(symbol, side, half_size)
            elif symbol in MT5_SYMBOLS and MT5_AVAILABLE:
                mt5_direction = mt5.ORDER_TYPE_SELL if position["direction"] == "LONG" else mt5.ORDER_TYPE_BUY
                request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": symbol,
                    "volume": float(half_size),
                    "type": mt5_direction,
                    "price": current_price,
                    "deviation": 20,
                    "magic": 234000,
                    "comment": "Jabis BB-RSI Partial Exit",
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": mt5.ORDER_FILLING_IOC,
                }
                mt5.order_send(request)
        except Exception as e:
            add_log("WARN", f"부분 청산 실행 에러: {e}")
            
    # 포지션 정보 업데이트 (남은 수량 조정 & 스톱로스를 본절가로 변경)
    position["size"] -= half_size
    position["stop_loss"] = position["entry_price"] # 본절 보존 룰
    position["half_cleared"] = True
    
    add_log("INFO", f"⚖️ [1차 분할익절] {symbol} 볼린저 밴드 중간선 터치! 50% 물량 분할익절 및 스톱로스 본절가 이동 완료. (실현수익: +${partial_pnl:.2f})")

def execute_exit(symbol: str, position: Dict, current_price: float, reason: str, config: Dict, binance: Optional[ccxt.binance]):
    global paper_positions, paper_balance, daily_realized_pnl
    
    diff = current_price - position["entry_price"]
    if position["direction"] == "SHORT":
        diff = -diff
        
    final_pnl = diff * position["size"] * 100.0 if "XAUUSD" in symbol else diff * position["size"]
    paper_balance += final_pnl
    daily_realized_pnl += final_pnl
    
    # 실제 청산 주문
    if not config["paper_trading"]:
        try:
            if symbol in BINANCE_SYMBOLS and binance:
                side = "sell" if position["direction"] == "LONG" else "buy"
                binance.create_market_order(symbol, side, position["size"])
            elif symbol in MT5_SYMBOLS and MT5_AVAILABLE:
                mt5_direction = mt5.ORDER_TYPE_SELL if position["direction"] == "LONG" else mt5.ORDER_TYPE_BUY
                request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": symbol,
                    "volume": float(position["size"]),
                    "type": mt5_direction,
                    "price": current_price,
                    "deviation": 20,
                    "magic": 234000,
                    "comment": f"Jabis BB-RSI Full Exit ({reason})",
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": mt5.ORDER_FILLING_IOC,
                }
                mt5.order_send(request)
        except Exception as e:
            add_log("WARN", f"청산 실행 에러: {e}")
            
    # 포지션 리스트에서 제거
    paper_positions = [pos for pos in paper_positions if pos["symbol"] != symbol]
    
    sign = "🟢 익절" if final_pnl >= 0 else "🔴 손절"
    reason_str = "볼린저 밴드 반대편 터치" if reason == "TAKE_PROFIT" else "스톱로스 터치"
    add_log("INFO", f"🏁 [포지션 종료] {symbol} {sign} 청산 완료. 사유: {reason_str}. (청산가: ${current_price:.2f}, 최종손익: ${final_pnl:.2f})")

def close_all_positions(binance: Optional[ccxt.binance], config: Dict):
    global paper_positions
    for pos in list(paper_positions):
        execute_exit(pos["symbol"], pos, pos["current_price"], "FORCE_CLOSE", config, binance)
    paper_positions = []

# ----------------- FastAPI 라우터 엔드포인트 -----------------

@app.get("/api/config")
def get_config_api():
    return load_config()

@app.post("/api/config")
def update_config_api(config_data: ConfigModel):
    save_config(config_data.dict())
    return {"status": "success", "message": "설정이 성공적으로 저장되었습니다."}

@app.post("/api/start")
def start_trading():
    global trading_thread, stop_event, start_time
    config = load_config()
    
    if config["trading_active"]:
        return {"status": "error", "message": "이미 자동매매 엔진이 구동 중입니다."}
        
    config["trading_active"] = True
    save_config(config)
    
    stop_event.clear()
    start_time = datetime.now()
    trading_thread = threading.Thread(target=trading_loop, args=(config,), daemon=True)
    trading_thread.start()
    
    add_log("INFO", "자동매매 서비스가 시작되었습니다.")
    return {"status": "success", "message": "자동매매가 활성화되었습니다."}

@app.post("/api/stop")
def stop_trading():
    global trading_thread, stop_event
    config = load_config()
    
    if not config["trading_active"]:
        return {"status": "error", "message": "자동매매 엔진이 현재 작동 중이 아닙니다."}
        
    config["trading_active"] = False
    save_config(config)
    
    stop_event.set()
    if trading_thread:
        trading_thread.join(timeout=2.0)
        trading_thread = None
        
    add_log("INFO", "자동매매 서비스가 종료되었습니다.")
    return {"status": "success", "message": "자동매매가 정상적으로 중지되었습니다."}

@app.get("/api/status")
def get_status():
    config = load_config()
    uptime_str = "00:00:00"
    if start_time and config["trading_active"]:
        delta = datetime.now() - start_time
        uptime_str = str(timedelta(seconds=int(delta.total_seconds())))
        
    # 총 평가 수익(PnL)
    total_unrealized_pnl = sum(pos["pnl"] for pos in paper_positions)
    current_asset = paper_balance + total_unrealized_pnl
    
    # 일일 손실률 진행률
    daily_loss_percent = -(daily_realized_pnl / paper_initial_balance) * 100
    if daily_loss_percent < 0:
        daily_loss_percent = 0.0
        
    return {
        "trading_active": config["trading_active"],
        "paper_trading": config["paper_trading"],
        "uptime": uptime_str,
        "total_balance": paper_balance,
        "total_asset": current_asset,
        "unrealized_pnl": total_unrealized_pnl,
        "daily_realized_pnl": daily_realized_pnl,
        "daily_loss_percent": daily_loss_percent,
        "open_positions": paper_positions
    }

@app.get("/api/logs")
def get_logs():
    return system_logs

@app.get("/api/chart/{symbol}")
def get_chart_data(symbol: str):
    # CCXT 혹은 MT5 봉 데이터 가공하여 프론트엔드로 전달
    if symbol in market_data_cache:
        # 캐시된 캔들과 지표 포함해 리스트 리턴
        df = pd.DataFrame(market_data_cache[symbol])
        if len(df) >= 20:
            df = calculate_indicators(df)
            df = df.fillna(0) # JSON 직렬화 에러 방지
            return df.to_dict(orient="records")
            
    # 기본 더미 데이터 반환
    return []

if __name__ == "__main__":
    import uvicorn
    # 8000포트에서 백엔드 실행
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
