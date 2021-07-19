from flask import Flask

from flask_wtf import CSRFProtect

from flask_sqlalchemy import SQLAlchemy

from flaskext.markdown import Markdown

from flask_mail import Mail, Message


database = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    mail = Mail(app)
    mail.init_app(app)

    csrf = CSRFProtect()
    csrf.init_app(app)

    Markdown(app)

    from .auth import auth, loginManager
    app.register_blueprint(auth)
    loginManager.init_app(app)

    from .timeTable import timeTable
    app.register_blueprint(timeTable)

    database.init_app(app)
    database.create_all(app=app)

    return app