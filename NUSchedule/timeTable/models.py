from flask_login import UserMixin

from werkzeug.security import check_password_hash, generate_password_hash

from .. import database


class Events(UserMixin, database.Model):
    __tablename__ = 'Events'

    # event id
    id = database.Column(database.Integer, autoincrement=True, primary_key=True)
    # event creator's userId
    creator = database.Column(database.Integer, nullable=False)
    # event name
    eventName = database.Column(database.String(20), nullable=False)
    # event type, lecture, assignment, deadline, etc.
    eventType = database.Column(database.String(10), nullable=False)
    # repeated 0 false, 1 true
    repeated = database.Column(database.Integer, nullable=False)
    # week (repeated = 1) (Sun.~Sat. 0~6)
    week = database.Column(database.Integer, nullable=True)
    # date (repeated = 0) (yyyy-mm-dd)
    date = database.Column(database.String(10), nullable=True)
    # startTime (xx:xx)
    startTime = database.Column(database.String(5), nullable=True)
    # endTime (xx:xx)
    endTime = database.Column(database.String(5), nullable=True)

    # # this event is a group project or not      0 - false, 1 - true
    # groupProject = database.Column(database.Integer, nullable=False)
    # # teammates of this group project
    # teammates = database.relationship('Users', lazy=True)

    def __init__(self, creator, eventName, eventType, repeated, week, date, startTime, endTime):
        self.creator = creator
        self.eventName = eventName
        self.eventType = eventType
        self.repeated = repeated
        self.week = week
        self.date = date
        self.startTime = startTime
        self.endTime = endTime
        # self.groupProject = groupProject
