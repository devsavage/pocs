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

    $("#total").text(numeral(parseFloat(getTotals.reduce(reducer)).toFixed(2)).format("$0,0.00"))
}

$(() => {
    let clear = $("#clear")
    let $inputs = $("#currencyForm :input[type=number]")

    $("#coin_penny").select()

    $(":input").keydown(function(e){
        if (e.keyCode === 13) {
            let enabledInputs = $("input:enabled");
            let index = enabledInputs.index(this);

            let next = enabledInputs.eq(index + 1)

            next.select()
        }
    });

    $inputs.on("keyup change", (e) => {
        let target = $(e.target)
        
        if(target.val() == "" || target.val().includes("-")) {
            target.val("0")
        }

        calculate($inputs)
    })

    clear.click(() => {
        console.log("Last total: " + $("#total").text())
        
        $(".currency").val("0")

        calculate($inputs)
    })
})
