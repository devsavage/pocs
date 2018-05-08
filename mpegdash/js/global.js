$(() => {
    let urlContainer = $("#urlContainer")
    let videoContainer = $("#videoContainer")
    let dashUrl = $("#dashUrl")
    let loadUrl = $("#loadUrl")

    loadUrl.click((e) => {
        e.preventDefault()

        if(dashUrl.val() != '') {
            this.validateMPD(dashUrl.val(), (valid) => {
                if(valid) {
                    clearNotify()
                    const player = dashjs.MediaPlayer().create()
                    player.initialize(document.querySelector("#videoPlayer"), dashUrl.val(), true)
                    player.getDebug().setLogToBrowserConsole(false)
                    videoContainer.show()
                } else {
                    this.notify("URL must be a valid .mpd link.", "danger")
                }
            })
        } else {
            this.notify("Please enter a URL.", "warning", true)
        }
    })
})

function validateMPD(url, callback) {
    const regex = /\.mpd(?:[:\/]|$)/g;

    if(url.includes("?")) {
        let urls = url.split("?")
        url = urls[0]

        if(url.match(regex)) {
            callback(true)
        } else {
            callback(false)
        }
    }

    callback(url.match(regex))
}

function notify(message, type, shouldTimeout = false, timer = 5000) {
    const alertContainer = $("#alertContainer")

    alertContainer.append("<div class='alert alert-" + type + "' role='alert' id='alert'>" + message + "</div>")

    if($("#alert") && shouldTimeout) {
        setTimeout(() => {
            $("#alert").remove()
        }, timer)
    }
}

function clearNotify() {
    $("#alert").remove()
}
