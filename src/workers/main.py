import os
import asyncio
import atexit
from pathlib import Path
from apscheduler.schedulers.blocking import BlockingScheduler

from workers.WorkerRunner import WorkerRunner
from utils import Logger

_WORKER_NAME = os.getenv("WORKER_NAME")
_WORKER_RUN_INTERVAL_IN_SECONDS = int(os.getenv("WORKER_RUN_INTERVAL_IN_SECONDS", 5))

_logger = Logger(__name__)


def _report_health() -> None:
    _logger.trace("Reporting health")
    Path('/tmp/healthy').touch()

def _get_wrapper_runner(worker_runner: WorkerRunner):
    def _run_and_report_health():
        worker_runner.run_worker()
        _report_health()

    return _run_and_report_health

if __name__ == '__main__':
    _report_health()
    scheduler = BlockingScheduler()
    atexit.register(lambda: scheduler.shutdown(wait=False))

    worker_runner = WorkerRunner(_WORKER_NAME)
    wrapped_runner = _get_wrapper_runner(worker_runner)
    scheduler.add_job(
        wrapped_runner,
        trigger="interval",
        name="Run Worker",
        seconds=_WORKER_RUN_INTERVAL_IN_SECONDS,
    )

    try:
        _logger.trace("Starting scheduler")
        scheduler.start()
    except (KeyboardInterrupt):
        _logger.exception('Got SIGTERM! Terminating...')
