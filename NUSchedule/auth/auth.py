import uuid

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from flask_login import (
    current_user, LoginManager, login_required, login_user, logout_user
)

from .forms import loginForm, signUpForm, resetPasswordForm

from .models import Users

from .verificationCode import generate_verificationCode, send_verificationCode

from .. import database

loginManager = LoginManager()

auth = Blueprint('auth', __name__, template_folder='templates')


@loginManager.user_loader
def load_user(id):
    return Users.query.filter_by(id=id).first()


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
            login_user(user)
            return None

    return 'Username and password do not match. Please try again.'


@auth.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        error = login_validation()
        if error is None:
            return redirect('/')
        else:
            return render_template('login.html', error=error)
    else:
        return render_template('login.html')


def signUp_validation():
    form = signUpForm()

    if form.validate_on_submit():
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')

        privilege = 'user'

        user = Users.query.filter_by(username=username).first()
        if user is not None:
            return 'This username has been used. Please choose another one.'

        user = Users(email, username, password, privilege)
        database.session.add(user)
        database.session.commit()

        login_user(user)

        return None

    return 'Password and confirm password do not match. Please try again.'


@auth.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        error = signUp_validation()
        if error is None:
            return redirect('/')
        else:
            return render_template('signup.html', error=error)
    else:
        return render_template('signup.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/')


@auth.route('/forgotPassword', methods=['POST', 'GET'])
def forgotPassword():
    if request.method == 'POST':
        username = request.form.get('username')
        user = Users.query.filter_by(username=username).first()
        if user is not None:
            print("forgotPassword  user = ", user)
            # generate_verificationCode(user)
            send_verificationCode(user)
            return redirect(url_for('auth.checkVerificationCode', userId=user.id))
        else:
            error = "Cannot find this user. Please check the username."
            return render_template('forgotPassword.html', error=error)
    else:
        return render_template('forgotPassword.html')


@auth.route('/checkVerificationCode/<int:userId>', methods=['POST', 'GET'])
def checkVerificationCode(userId):
    if request.method == 'POST':
        verificationCode = request.form.get('verificationCode')
        user = Users.query.filter_by(id=userId).first()
        # print("checkVerificationCode  user = ", user)
        if user.check_verificationCode(verificationCode):
            # print("checkVerificationCode == True")
            return redirect(url_for('auth.resetPassword', userId=user.id))
        else:
            # print("checkVerificationCode == False")
            error = "Verification code is incorrect. Please try again."
            return render_template("checkVerificationCode.html", error=error)
    else:
        return render_template("checkVerificationCode.html")


def resetPasswordValidate(user):
    form = resetPasswordForm()
    if form.validate_on_submit():
        password = request.form.get('password')
        user.set_password(password)
        login_user(user)
        return None
    else:
        return "Password and confirm password does not match. Please try again."


@auth.route('/resetPassword/<int:userId>', methods=['POST', 'GET'])
def resetPassword(userId):
    if request.method == 'POST':
        user = Users.query.filter_by(id=userId).first()
        error = resetPasswordValidate(user)
        if error is not None:
            return render_template("resetPassword.html", error=error)
        else:
            return redirect('/')
    else:
        return render_template("resetPassword.html")