from flask import render_template, request

from app import app

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        print "POST method"
    else:
        print "GET method"
    return render_template("index.html",
                            title="Home"
                            )

@app.route('/index/')
def next():
    return "Next page"
