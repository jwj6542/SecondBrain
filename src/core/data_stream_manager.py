class DataStreamManager:
    """실시간 데이터 수집 및 정제 담당 (Singleton)."""
    def __init__(self, markets: list):
        # 초기화 시 모든 마켓의 스트림 연결 설정
        print(f"Initializing data stream for {markets}...")
        self.market_data = {}

    def connect_stream(self, market_symbol: str, api_endpoint: str) -> bool:
        """지정된 API 엔드포인트와 연결하고 데이터 스트림을 활성화한다."""
        # 실제 구현에서는 WebSocket/REST Polling 로직 포함
        pass

    def process_new_tick(self, market: str, tick: dict) -> dict | None:
        """새로운 틱 데이터를 받으면 결측치 처리 및 정규화 과정을 거친 후 반환한다."""
        if not self._is_data_valid(market, tick): # 자체 검증 로직
            # Interpolation 또는 Missing Data Event 발생
            return None
        return {"timestamp": tick['time'], "open": tick['o'], "high": tick['h'], "low": tick['l'], "close": tick['c']}

    def get_historical_data(self, market: str, start_date: str, end_date: str) -> list[dict]:
        """백테스팅을 위해 특정 기간의 데이터를 요청한다."""
        # DB/S3에서 데이터 로드 후 포맷팅 (필수)
        return []

    @staticmethod
    def _is_data_valid(market, tick):
        """데이터 유효성 체크: 시간순서 유지 및 필수 필드 존재 여부 검증."""
        pass