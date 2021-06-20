from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from flask_login import (
    current_user, LoginManager, login_required, login_user, logout_user
)

from .loginForm import loginForm

from .signUpForm import signUpForm

from .models import Users

from .. import database

loginManager = LoginManager()

auth = Blueprint('auth', __name__, template_folder='templates')


@loginManager.user_loader
def load_user(userId):
    return Users.query.filter_by(userId=userId).first()


@loginManager.unauthorized_handler
def unauthorized():
    return redirect(url_for('auth.login'))


def login_validation():
    form = loginForm()

    if form.validate_on_submit():
        username = request.form.get('username')
        password = request.form.get('password')

        user = Users.query.filter_by(username=username).first()

        if user and user.check_password(password):
            # login_user(user)
            return None

    return 'Username or password do not match. Please try again.'


@auth.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        error = signUp_validation()
        if error is None:
            return redirect(url_for('auth.login'))

        flash(error)
    return render_template('signup.html')


def signUp_validation():
    form = signUpForm()

    if form.validate_on_submit():
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        confirmPassword = request.form.get('confirmPassword')


        privilege = 'user'

        user = Users.query.filter_by(username=username).first()
        if user is not None:
            return 'This username has been used. Please choose another one.'

        user = Users(email, username, password, privilege)
        database.session.add(user)
        database.session.commit()

        # login_user(user)

        return None

    return 'Password and confirm password do not match. Please try again.'


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/')


@auth.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        error = login_validation()
        if error is None:
            return redirect(url_for('auth.main'))
        flash(error)
    else:
        return render_template('login.html')


@auth.route('/')
def main():
    return render_template('main.html')


@auth.route('/<userName>')
def userPage(userName):
    return render_template('user.html', userName=userName)
