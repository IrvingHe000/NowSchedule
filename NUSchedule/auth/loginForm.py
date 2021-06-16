from flask_wtf import FlaskForm

from wtforms import PasswordField, StringField

from wtforms.validators import DataRequired


class loginForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])