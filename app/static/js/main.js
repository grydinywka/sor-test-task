function getSign(currency, amount) {
//    alert("Here will be alax request");
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
            $('#loading').show();
        },
        'error': function(xhr, status, error){
//             alert(error);
            $('#loading').hide();
        },
        'success': function(data, status, xhr){
//            alert('AFTER ajax req');
            sign = data['sign'];
            $('#loading').hide();
//            alert(sign);
        }
    });

    return sign;
}

function makeInvoice(currency, amount, description, sign) {
    var invoice_data;
    $.ajax({
        'url': '/invoice-euro/',
        'type': 'POST',
        'async': false,
        'dataType': 'json',
        'data': {
            'description': description,
            'sign': sign,
            'amount': amount,
            'csrf_token': $('input[name="csrf_token"]').val()
        },
        'beforeSend': function(xhr,setting){
//            alert('before ajax req');
            $('#loading').show();
        },
        'error': function(xhr, status, error){
//             alert(xhr);
            $('#loading').hide();
        },
        'success': function(data, status, xhr){
//            alert('AFTER ajax req');
            $('#loading').hide();
            if ( data['result'] == "ok" ) {
                invoice_data = data;
            }
        }
    });

    return invoice_data;
}

function isInteger(x) { return typeof x === "number" && isFinite(x) && Math.floor(x) === x; }
function isFloat(x) { return !!(x % 1); }

function checkAmount() {
    var amount_val = $('#amount').val();
    var amount_val_parse = parseFloat(amount_val);

    if ( amount_val == '' ) {
        $('#amount').addClass("error_value");
    }
//    $('#amount').keyup(function() {

    else if ( amount_val_parse <= 0 ) {
        $('#amount').addClass("error_value");
    }
    else if ( isFloat(amount_val_parse) == false && isInteger(amount_val_parse) == false ) {
        $('#amount').addClass("error_value");
    } else {
        $('#amount').removeClass("error_value");
    }
//    });

}

function checkDescription() {
    if ($('#description').val() == "") {
        $('#description').addClass("error_value");
    } else {
        $('#description').removeClass("error_value");
    }
}

function clickPay() {
    $('input[value="Pay"]').click(function() {
        var currency = $('#currency').val();
        var amount = $('#amount').val();
        var description = $('#description').val();
        var sign;

        $('.errornote').remove();
        checkAmount();
        checkDescription();
        if ( $('.error_value').length == 0 ) {
            sign = getSign(currency, amount);

            if ( currency == 'usd' ) {
                var tip_form = $('#tip-payment form');

                tip_form.find('input[name="amount"]').attr("value", amount);
                tip_form.find('input[name="sign"]').attr("value", sign);
                tip_form.find('input[name="description"]').attr("value", description);
                tip_form.submit();

            } else { // currency == 'eur'
                var invoice_data = makeInvoice(currency, amount, description, sign);
                var invoice_form = $('#invoice-payment form');

                if ( invoice_data['result'] == 'ok' ) {
    //                alert(invoice_data['data']['source']);
                    $(invoice_form).attr("method", invoice_data['data']['method']);
                    $(invoice_form).attr("action", invoice_data['data']['source']);
                    var keys = [];
                    for (var key in invoice_data['data']['data']) {
    //                    keys.push(key);
                        invoice_form.append('<input type="hidden" name="' + key + '" value="' +
                        invoice_data['data']['data'][key] + '" />');
                    }
                    invoice_form.submit();

                }

            }
        } else {
            $('#content-form').prepend('<p class="errornote"> Please check fields. </p>');
        }
    });
}

$(document).ready(function() {
//    $('#tip-payment').hide();
//    checkAmount();
    clickPay();
});
