from flask_wtf import FlaskForm

from wtforms import PasswordField, StringField

from wtforms.validators import DataRequired, Email, EqualTo


class signUpForm(FlaskForm):
    email = StringField('email address', validators=[DataRequired(), Email()])
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])
    confirmPassword = PasswordField('confirm password', validators=[DataRequired(), EqualTo('password')])
