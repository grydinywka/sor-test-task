import requests
import json
import hashlib
import random, string
import sys

from flask import render_template, request

from app import app

EURO = 'eur'
USD = 'usd'
EURO_ID = 978 #643
USD_ID = 840
SHOP_ID = 305154
SECRET = 'Secret134'
EURO_PAYWAY = 'payeer_eur'


@app.route('/')
def index():
    shop_invoice_id = "".join(random.choice(string.ascii_lowercase) for i in range(10))

    return render_template("index.html",
                            title="Home", usd_id=USD_ID, shop_id=SHOP_ID, shop_invoice_id=shop_invoice_id
                            )


@app.route('/invoice-euro/', methods=['POST'])
def invoice_euro():
    # currency = request.form.get('currency')
    amount = request.form.get('amount')
    description = request.form.get('description')
    sign = request.form.get('sign')
    shop_invoice_id = request.form.get('shop_invoice_id')

    r = requests.post('https://central.pay-trio.com/invoice', data=json.dumps(
                {"amount": amount, "currency": str(EURO_ID), "shop_id": str(SHOP_ID),
                 "shop_invoice_id": str(shop_invoice_id), "payway": EURO_PAYWAY,
                 "description": description, "sign": sign}), headers={'Content-type': 'application/json'})

    return json.dumps(r.json())


@app.route('/get-sign/', methods=['POST'])
def get_sign():
    currency = request.form.get('currency')
    amount = request.form.get('amount')
    shop_invoice_id = request.form.get('shop_invoice_id')
    description = request.form.get('description')

    if currency == USD:
        sign = hashlib.md5("{}:{}:{}:{}{}".format(amount, USD_ID, SHOP_ID, shop_invoice_id, SECRET).encode('utf-8')).hexdigest()

    else: # currency == 'eur'
        sign = hashlib.md5("{}:{}:{}:{}:{}{}".format(amount, EURO_ID, EURO_PAYWAY, SHOP_ID, shop_invoice_id, SECRET).encode('utf-8')).hexdigest()
    log_str = 'currency: {}, amount: {}, description: {}, payment_id: {}'.format(currency, amount,
                                                                                          description, shop_invoice_id)
    app.logger.warning(log_str)
    print log_str
    sys.stdout.flush()

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
