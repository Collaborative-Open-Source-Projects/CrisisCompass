from flask import Flask

app = Flask(__name__)


@app.route('/')
def homepage():
    return 'Homepage!!'



@app.route('/hello')
def hello():
    return 'Hello, World!'