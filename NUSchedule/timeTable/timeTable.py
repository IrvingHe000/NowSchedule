from flask import Blueprint, render_template, request, redirect, flash

from flask_login import current_user, login_required, LoginManager

from sqlalchemy import and_

from .models import Events

from ..auth.models import Users

from .forms import addEventForm

from .. import database

from .. import create_app


timeTable = Blueprint("timeTable", __name__, template_folder='templates')


def get_events(userId):
    events = Events.query.filter_by(creator=userId).all()
    return events


def add_event(userId):
    form = addEventForm()
    print(form.validate_on_submit())
    if form.validate_on_submit():
        eventName = request.form.get('eventName')
        # print(eventName)
        eventType = request.form.get('eventType')
        # print(eventType)
        date = request.form.get('date')
        # print(date)
        startTime = request.form.get('startTime')
        # print(startTime)
        if eventType == "deadline":
            endTime = startTime
        else:
            endTime = request.form.get('endTime')
        # print(endTime)

        existEvent = Events.query.filter_by(eventName=eventName, eventType=eventType,
                                            date=date, startTime=startTime, endTime=endTime).first()
        if existEvent is not None:
            return "Your have already added the same event."
        else:
            newEvent = Events(userId, eventName, eventType, False, 0, date, startTime, endTime)
            database.session.add(newEvent)
            database.session.commit()
            return None


def delete_event(userId):
    eventName = request.form.get('eventName')
    eventType = request.form.get('eventType')
    date = request.form.get('date')
    startTime = request.form.get('startTime')
    endTime = request.form.get('endTime')
    database.session.query(Events).filter(and_(
        Events.creator == userId,
        Events.eventName == eventName,
        Events.eventType == eventType,
        Events.date == date,
        Events.startTime == startTime,
        Events.endTime == endTime)).delete()
    database.session.commit()


def delete_all_events(userId):
    database.session.query(Events).filter_by(creator=userId).delete()
    database.session.commit()


@timeTable.route('/')
def mainPage():
    if current_user.is_authenticated:
        return redirect("/timeTable")
    else:
        return render_template("mainPage.html")


@timeTable.route('/timeTable', methods=['GET', 'POST'])
def show_timeTable():
    if current_user.is_authenticated:
        if request.method == 'GET':
            print("GET")
            events = get_events(current_user.id)
            return render_template("timeTable.html", events=events, userName=current_user.username)

        if request.method == "POST":
            action = request.form.get('action')
            error = None
            print("action = ", action)
            if action == "Add event":
                print("POST: add event")
                error = add_event(current_user.id)

            if action == "Clear all events":
                print("POST: clear all events")
                delete_all_events(current_user.id)

            if action is None:
                print("POST: delete event")
                delete_event(current_user.id)

            events = get_events(current_user.id)
            if error is not None:
                flash(error)
                return render_template("timeTable.html", events=events, userName=current_user.username)
            else:
                return render_template("timeTable.html", events=events, userName=current_user.username)
    else:
        return render_template("mainPage.html")