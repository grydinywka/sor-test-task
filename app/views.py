import requests
import json
import hashlib

from flask import render_template, request, render_template_string, redirect

from app import app

EURO = 'eur'
USD = 'usd'
EURO_ID = 643
USD_ID = 840
SHOP_ID = 305154
SHOP_INVOICE_ID = 101
SECRET = 'Secret134'
EURO_PAYWAY = 'payeer_eur'

def tip_payment():
    pass

@app.route('/', methods=['GET', 'POST'])
def index():
    # if request.method == 'POST':
    #     print "POST method"
    #     # we don't need validate fields
    #     currency = request.form.get('currency')
    #     amount = request.form.get('amount')
    #     description = request.form.get('description')
    #
    #
    #     if currency == USD:
    #         sign = hashlib.md5("{}:{}:{}:{}{}".format(amount, USD_ID, SHOP_ID, SHOP_INVOICE_ID, SECRET)).hexdigest()
    #         r = requests.post('https://tip.pay-trio.com/ru/', data=json.dumps(
    #             {"amount": amount, "currency": str(USD_ID), "shop_id": str(SHOP_ID), "shop_invoice_id":
    #                 str(SHOP_INVOICE_ID),
    #              "description": description, "sign": sign}), headers={'Content-type': 'application/json'})
    #     return render_template_string(r.text)
    #     # return redirect('https://tip.pay-trio.com/ru/', 'HTTP_301_MOVED_PERMANENTLY')
    #
    #     print currency
    # else:
    #     print "GET method"
    #     print request.form
    return render_template("index.html",
                            title="Home"
                            )

@app.route('/index/')
def next():
    return "Next page"


@app.route('/get-sign/', methods=['POST'])
def get_sign():
    currency = request.form.get('currency')
    amount = request.form.get('amount')

    if currency == USD:
        sign = hashlib.md5("{}:{}:{}:{}{}".format(amount, USD_ID, SHOP_ID, SHOP_INVOICE_ID, SECRET).encode('utf-8')).hexdigest()
    else: # currency == 'eur'
        sign = hashlib.md5("{}:{}:{}:{}:{}{}".format(amount, EURO_ID, EURO_PAYWAY, SHOP_ID, SHOP_INVOICE_ID, SECRET).encode('utf-8')).hexdigest()

    return json.dumps({"sign": sign})

@app.route('/success-payment/', methods=['GET'])
def success_payment():
    return render_template("success_payment.html",
                    title="Success Payment"
                    )

@app.route('/fail-payment/', methods=['GET'])
def fail_payment():
    return render_template("fail_payment.html",
                    title="Fail Payment"
                    )