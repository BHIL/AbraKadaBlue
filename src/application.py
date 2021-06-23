from flask import Flask
from flask.logging import default_handler
from flask_sqlalchemy import SQLAlchemy
from opencensus.ext.azure import metrics_exporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware

from utils import Logger
from config.Flask import Config


app = Flask(__name__)
app.config.from_object(Config)


db = SQLAlchemy(app)