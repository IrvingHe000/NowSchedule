from flask_wtf import FlaskForm

from wtforms import PasswordField, StringField

from wtforms.validators import DataRequired, Email, EqualTo


class periodForm(FlaskForm):
    eventName = StringField('task-period', validators=[DataRequired()])
    date = StringField('date-period', validators=[DataRequired()])
    startTime = StringField('start-period', validators=[DataRequired()])
    endTime = StringField('end-period', validators=[DataRequired()])


class deadlineForm(FlaskForm):
    eventName = StringField('task-ddl', validators=[DataRequired()])
    date = StringField('date-ddl', validators=[DataRequired()])
    time = StringField('time-ddl', validators=[DataRequired()])


class addEventForm(FlaskForm):
    eventName = StringField('eventName', validators=[DataRequired()])
    eventType = StringField('eventType', validators=[DataRequired()])
    date = StringField('date', validators=[DataRequired()])
    startTime = StringField('startTime', validators=[DataRequired()])
    endTime = StringField('endTime', validators=[DataRequired()])
