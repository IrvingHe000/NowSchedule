from flask import Blueprint, render_template, request

from flask_login import current_user, login_required, LoginManager

from .models import Events

from ..auth.models import Users

from .forms import addEventForm

from .. import database

timeTable = Blueprint("timeTable", __name__, template_folder='templates')


def get_events(userId):
    events = Events.query.filter_by(creator=userId).all()
    return events


def add_event(userId):
    form = addEventForm()
    if form.validate_on_submit():
        print("form.validate_on_submit==True")
        eventName = request.form.get('eventName')
        eventType = request.form.get('eventType')
        date = request.form.get('date')
        startTime = request.form.get('startTime')
        if eventType == "deadline":
            endTime = startTime
        else:
            endTime = request.form.get('endTime')

        newEvent = Events(userId, eventName, eventType, False, 0, date, startTime, endTime)
        database.session.add(newEvent)
        database.session.commit()


@timeTable.route('/')
def show_timeTable():
    if current_user.is_authenticated:
        if request.method == 'GET':
            events = get_events(current_user.id)
            # print(current_user.id)
            # print(events)
            return render_template("user.html", events=events, userName=current_user.username)
        else:
            add_event(current_user.id)
            events = get_events(current_user.id)
            print(current_user.id)
            print(events)
            return render_template("user.html", events=events, userName=current_user.username)
    else:
        return render_template("mainPage.html")