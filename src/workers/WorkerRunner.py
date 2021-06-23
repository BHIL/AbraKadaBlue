from utils import Logger
from workers import TraderWorker, DuelMatchmakerWorker, GameEngineWorker, BrokerWorker

_WORKERS_MAPPING = {
    "Trader": TraderWorker,
    "DuelMatchmaker": DuelMatchmakerWorker,
    "GameEngineWorker": GameEngineWorker,
    "BrokerWorker": BrokerWorker,
}
_logger = Logger(__name__)


class WorkerRunner:
    def __init__(self, worker_name):
        self.worker_name = worker_name

    def run_worker(self) -> None:
        _logger.trace(f"Running worker: {self.worker_name}")
        try:
            worker = _WORKERS_MAPPING.get(self.worker_name)
            worker.tick()
        except Exception:
            _logger.exception(f"Failed to run worker: {self.worker_name}")
            raise
        else:
            _logger.trace(f"Done running worker: {self.worker_name}")
