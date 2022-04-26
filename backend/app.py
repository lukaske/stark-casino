import flask
from flask import request
import datetime

app = flask.Flask(__name__)

time = False
secrets_dict = {    
    "0x012345": "1234",
    "0x012346": "2323",
    "0x012332": "1543",
    "0x212125": "0909"
}

@app.route("/time")
def home():
    global time
    if not time:
        time = datetime.datetime.now()
    
    return { "time" : str(time) }

@app.route("/secrets", methods = ['POST', 'GET'])
def secrets():
    global secrets_dict
    if request.method == 'POST':
        address = request.args.get('address', default = "", type = str)
        secret = request.args.get('secret', default = "", type = str)

        secrets_dict[address] = secret
    
        return secrets_dict
    return { "code ": 404 }


@app.route("/push_secrets")
def push_secrets():
    pass