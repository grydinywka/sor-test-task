function getSign(currency, amount) {
    alert("Here will be alax request");
    var sign;
    $.ajax({
        'url': '/get-sign/',
        'type': 'POST',
        'async': false,
        'dataType': 'json',
        'data': {
            'currency': currency,
            'amount': amount,
            'csrf_token': $('input[name="csrf_token"]').val()
        },
        'beforeSend': function(xhr,setting){
//            alert('before ajax req');
        },
        'error': function(xhr, status, error){
//             alert(error);
        },
        'success': function(data, status, xhr){
//            alert('AFTER ajax req');
            sign = data['sign'];
        }
    });

    return sign;
}

function makeInvoice(currency, amount, description, sign) {
    var m_curorderid;
    $.ajax({
        'url': 'https://central.pay-trio.com/invoice',
        'type': 'POST',
        'async': false,
//        'contentType': 'application/json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'dataType': 'json',
        'data': JSON.stringify({
            'description': description,
            'payway': 'payeer_eur',
            'shop_invoice_id': '101',
            'sign': 'eee1946c6a12c60677a41530a5caf73d',
            'currency': '643',
            'amount': '10',
            'shop_id': '305154'
        }),
        'beforeSend': function(xhr,setting){
            alert('before ajax req');
        },
        'error': function(xhr, status, error){
             alert(xhr);
        },
        'success': function(data, status, xhr){
            alert('AFTER ajax req');
            sign = data['sign'];
            if ( data['result'] == "ok" ) {
                m_curorderid = data['data']['m_curorderid'];
            }
        }
    });

    return m_curorderid;
}

function clickPay() {
    $('input[value="Pay"]').click(function() {
        var currency = $('#currency').val();
        var amount = $('#amount').val();
        var description = $('#description').val();
        var sign = getSign(currency, amount);

        alert(sign);
        if ( currency == 'usd' ) {
            var tip_form = $('#tip-payment form');

            tip_form.find('input[name="amount"]').attr("value", amount);
            tip_form.find('input[name="sign"]').attr("value", sign);
            tip_form.find('input[name="description"]').attr("value", description);
            tip_form.submit();
        } else { // currency == 'eur'
            var m_curorderid = makeInvoice(currency, amount, description, sign);
            alert(m_curorderid);
        }
    });
}

$(document).ready(function() {
//    $('#tip-payment').hide();
    clickPay();
});
