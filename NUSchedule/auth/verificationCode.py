import uuid

from flask_mail import Message, Mail

from .models import Users

from .. import database


def generate_verificationCode(user):
    verificationCode = str(uuid.uuid1())[:6]
    user.set_verificationCode(verificationCode)
    database.session.commit()
    return verificationCode


def send_verificationCode(user):
    verificationCode = generate_verificationCode(user)
    email = user.email
    mail = Mail()
    message = Message('NUSchedule Verification Code', recipients=[email],
                      body="Your verification code is %s" % verificationCode, sender="343476409@qq.com")
    mail.send(message)
