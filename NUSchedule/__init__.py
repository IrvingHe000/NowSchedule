from flask import Flask

from flask_wtf import CSRFProtect

from flask_sqlalchemy import SQLAlchemy

from flaskext.markdown import Markdown

database = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    csrf = CSRFProtect()
    csrf.init_app(app)

    Markdown(app)

    from .auth import auth, loginManager
    # from .auth.blog import bp
    app.register_blueprint(auth)
    # app.register_blueprint(bp)
    loginManager.init_app(app)



    database.init_app(app)
    database.create_all(app = app)

    return app