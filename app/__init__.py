import os

from flask import Flask
from flask_wtf.csrf import CSRFProtect


app = Flask(__name__)
app.config.from_object('config')
csrf = CSRFProtect(app)

from app import views

# define if on heroku environment
ON_HEROKU = 'ON_HEROKU' in os.environ
if not ON_HEROKU:
    import logging
    from logging.handlers import RotatingFileHandler

    formatter = logging.Formatter( "%(levelname)s %(asctime)s; %(message)s")
    handler = RotatingFileHandler('app/logs/foo.log', maxBytes=100000, backupCount=5)
    handler.setLevel(logging.INFO)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
