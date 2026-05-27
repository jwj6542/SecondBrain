# auto_trader/utils.py
import pandas as pd
from datetime import datetime, timezone

def utc_now():
    """현재 시각을 UTC 타임스탬프로 반환"""
    return pd.Timestamp.utcnow()

def interpolate_missing(df: pd.DataFrame) -> pd.DataFrame:
    """
    결측치(NaN)를 선형 보간으로 채워 반환.
    datetime 인덱스를 유지하면서 numeric 컬럼만 보간한다.
    """
    # 날짜/시간 컬럼은 그대로 두고, 수치형 컬럼만 보간
    numeric_cols = df.select_dtypes(include=['number']).columns
    df[numeric_cols] = df[numeric_cols].interpolate(method='linear')
    return df

def safe_division(numerator, denominator):
    """0DivisionError 방지를 위한 안전除法"""
    try:
        return numerator / denominator
    except ZeroDivisionError:
        return float('inf')