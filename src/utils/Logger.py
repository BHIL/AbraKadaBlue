import sys
import logging
from flask import g

# Keep logs of dependencies as well
from opencensus.trace import config_integration
config_integration.trace_integrations(['logging'])
config_integration.trace_integrations(['sqlalchemy'])
config_integration.trace_integrations(['requests'])


class Logger:
    def __init__(self, name):
        self._logger = logging.getLogger(name)
        self._logger.addHandler(self.get_stdout_handler())
        self._logger.setLevel(logging.INFO)
        self._logger.info('Logger starts')

    def _add_user_info(self, kw):
        try:
            if g.user:
                kw['uid'] = g.user.id
        except:
            # Not running under flask context
            pass
        return kw

    @staticmethod
    def get_stdout_handler():
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        return handler

    def debug(self, *args, **kw):
        self._logger.debug(*args, extra={'custom_dimensions': self._add_user_info(kw)}, stacklevel=2)

    def trace(self, *args, **kw):
        self._logger.info(*args, extra={'custom_dimensions': self._add_user_info(kw)}, stacklevel=2)

    def warning(self, *args, **kw):
        self._logger.warning(*args, extra={'custom_dimensions': self._add_user_info(kw)}, stacklevel=2)

    def exception(self, *args, **kw):
        self._logger.exception(*args, extra={'custom_dimensions': self._add_user_info(kw)}, stacklevel=2)

    def error(self, *args, **kw):
        self._logger.error(*args, extra={'custom_dimensions': self._add_user_info(kw)}, stacklevel=2)


