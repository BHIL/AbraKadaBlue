import routes.api
from routes.login import loggedInOnly

from application import app

from flask import render_template


@app.route('/')
@loggedInOnly
def index_page():
    return render_template('index.html')
