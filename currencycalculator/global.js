let currency = null

$.getJSON("currency.json", (json) => {
    currency = json
})

function calculateCurrency(value, type) {
    let multiplier = getCurrencyValue(type)

    return parseFloat((value * multiplier).toFixed(3))
}

function getCurrencyValue(type) {
    let val = type.split("_")

    if(val.length != 2) {
        return ""
    }

    return currency[val[0]][val[1]]
}

function calculate(inputs) {
    let values = {}

    inputs.each(function() {
        values[this.id] = calculateCurrency($(this).val(), this.id)
    })

    let getTotals = Object.values(values)

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    $("#totalBox").val(parseFloat(getTotals.reduce(reducer)).toFixed(2))
}

$(() => {
    let currencyForm = $("#currencyForm")
    let clear = $("#clear")

    let $inputs = $('#currencyForm :input[type=number]')

    $inputs.on('keyup change', (e) => {
        calculate($inputs)
    })

    clear.click(() => {
        lastTotal = $("#totalBox").val() > 0 ? $("#totalBox").val() : "0.00"
        console.log("Last total: $" + lastTotal)
        
        $(".currency").val('0')

        calculate($inputs)
    })
})
