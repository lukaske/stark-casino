import flask
import datetime

app = flask.Flask(__name__)

time = False

@app.route("/time")
def home():
    global time
    if not time:
        time = datetime.datetime.now()
    
    return { "time" : str(time) }

