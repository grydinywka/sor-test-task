from flask import Flask
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config.from_object('config')
csrf = CSRFProtect(app)

from app import views

