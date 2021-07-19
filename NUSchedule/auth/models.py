from flask_login import UserMixin

from werkzeug.security import check_password_hash, generate_password_hash

from .. import database


class Users(UserMixin, database.Model):
    __tablename__ = 'Users'

    id = database.Column(database.Integer, autoincrement=True, primary_key=True)
    email = database.Column(database.String(20), nullable=False)
    username = database.Column(database.String(20), unique=True, nullable=False)
    password = database.Column(database.String(20), nullable=False)
    privilege = database.Column(database.String(20), nullable=False)
    verificationCode = database.Column(database.String(6), nullable=True)

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

    def set_verificationCode(self, verificationCode):
        self.verificationCode = generate_password_hash(verificationCode)

    def check_verificationCode(self, verificationCode):
        return check_password_hash(self.verificationCode, verificationCode)
