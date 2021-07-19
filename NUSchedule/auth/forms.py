from flask_wtf import FlaskForm

from wtforms import PasswordField, StringField

from wtforms.validators import DataRequired, Email, EqualTo


class loginForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])


class signUpForm(FlaskForm):
    email = StringField('email address', validators=[DataRequired(), Email()])
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])
    confirmPassword = PasswordField('confirmPassword', validators=[DataRequired(), EqualTo('password')])


class resetPasswordForm(FlaskForm):
    password = PasswordField('password', validators=[DataRequired()])
    confirmPassword = PasswordField('confirmPassword', validators=[DataRequired(), EqualTo('password')])
