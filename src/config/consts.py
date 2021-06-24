from datetime import timedelta
MAX_TRADE_VOLUME = 10
MAX_DUEL_LENGTH = 10

DB_LOCK_TIMEOUT = timedelta(minutes=2)

COMMIT_LOCK_TIMEOUT = timedelta(minutes=1)
TIME_TO_CHECK_TICK = timedelta(seconds=2)
DUEL_TURN_DURATION = timedelta(seconds=15)
TRADE_COOLDOWN_DURATION = timedelta(seconds=5)
