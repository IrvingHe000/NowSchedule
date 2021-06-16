from flask_login import UserMixin

from werkzeug.security import check_password_hash, generate_password_hash

from .. import database


class Users(UserMixin, database.Model):
    __tablename__ = 'Users'

    userId = database.Column(database.Integer, autoincrement=True, primary_key=True)
    email = database.Column(database.String(20), nullable=False)
    username = database.Column(database.String(20), unique=True, nullable=False)
    password = database.Column(database.String(20), nullable=False)
    privilege = database.Column(database.String(20), nullable=False)

    def __init__(self, email, username, password, privilege):
        self.email = email
        self.username = username
        self.set_password(password)
        self.privilege = privilege

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def check_privilege(self):
        return self.privilege