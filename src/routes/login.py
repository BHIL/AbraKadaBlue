import re
from application import app, db
from models import User
from utils import Logger

from flask import render_template, jsonify, request, session, abort, g, url_for, redirect
from werkzeug.exceptions import Unauthorized
import functools
import datetime


logger = Logger(__name__)

def loggedInOnly(f=None):
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwds):
            if 'uid' not in session:
                if getattr(f, 'is_api', False):
                    return 'Login required', 401

                return redirect(url_for('register_page'))
            return f(*args, **kwds)

        return wrapper

    if f is None:
        return decorator

    return decorator(f)


def apiErrorWrapper(f):
    f.is_api = True

    @functools.wraps(f)
    def wrapper(*args, **kwds):
        try:
            return f(*args, **kwds)
        except Exception as ex:
            while isinstance(ex, BaseException):
                if type(ex) is Unauthorized:
                    return 'Login required', 401
                ex = ex.args
            return str(ex), 500

    return wrapper


@app.before_request
def before_request():
    g.user = None

    if 'uid' in session:
        # If the user is saved in the session
        g.user = User.query.filter(User.id == session['uid']).one_or_none()

        if not g.user:
            del session['uid']
    else:
        # If the user is not in the session, but we have its auth id, try to fetch the user if exist.
        auth_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')
        g.user = User.query.filter(User.auth_id == auth_id).one_or_none()
        # If the user exist, save it in the session
        if g.user:
            session['uid'] = g.user.id

    # Limit the flask session to 24 hours.
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(hours=24)


@app.route("/register", methods=['GET', 'POST'])
def register_page():
    auth_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')

    if request.method == 'GET':        
        if 'uid' in session:
            return redirect(url_for('index_page'))

        return render_template('register.html')
    elif request.method == 'POST':
        assert request.form['nickname']
        assert request.form['email']
        assert request.form['character'] in ('Rusty', 'Crusty')

        new_user = User(request.form['nickname'], request.form['email'], auth_id, request.form['character'] == 'Rusty')
        db.session.add(new_user)
        db.session.commit()

        session['uid'] = new_user.id

        return redirect(url_for('index_page'))
