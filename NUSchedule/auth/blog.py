from flask import (
    Blueprint, render_template
)

bp = Blueprint('bp', __name__, template_folder='templates')


@bp.route('/')
def index():
    return render_template('main.html')


@bp.route('/<userName>', endpoint='func1')
def user(userName):
    return render_template('user.html', userName=userName)
