$(() => {
    let connection = $("#connection")
    let connect = $("#connect")
    let channelName = $("#channelName")
    let tracking = $("#tracking")
    
    const version = "0.0.2"
    let channel = null
    let ready = false
    let connecting = false
    let emote = null
    let count = 0

    $("#version").text(version)
    $(document).attr("title", "Emote Tracker v" + version)


    connect.click((e) => {
        e.preventDefault()

        if(channelName.val() != '') {
            channel = channelName.val()
            alert("Joining channel, please wait...", "info")
            connecting = true
            client.join("#" + channelName.val()).then((data) => {
                ready = true
            }).catch((err) => {
                if(!ready) {
                    alert("Unable to join channel, please check the channel name and try again.", "error")
                }
                connecting = false
            })
        }
    })

    let trackEmote = $("#trackEmote")

    trackEmote.click((e) => {
        e.preventDefault()

        let emoteBox = $("#emote")

        if(emoteBox.val() != '') {
            emote = emoteBox.val()
            alert("Starting to track: " + emoteBox.val(), "success", true, 4000)
            count = 0
            readyToTrack(emote)
            updateTrackCount(count)
        }
    })

    const client = new tmi.client({
        options: {
            debug: true
        }
    })

    client.on("connecting", (add, port) => {
        alert("Connecting...", "info")
    })

    client.on("join", (c, username) => {
        alert("Joined " + this.channel(c), "success", true, 5000)
        initTracking(c)
    })

    client.on("connected", (add, port) => {
        $("#loading").hide()
        connection.show()
        if(!channel) {
            alert("Please enter a channel name to begin.", "info")
        }
    })

    client.on("chat", (channel, user, message, self) => {
        if(self) {
            return false
        }

        if(ready && emote != null && message.includes(emote)) {
            if(document.getElementById('limit').checked) {
                count = count + 1
            } else {
                count = count + (message.match(new RegExp(emote, "g")) || []).length
            }

            updateTrackCount(count)
        }
    })

    client.connect()
})

function alert(message, type, timed = false, timer = 1000) {
    clearAlert()

    let msg = $("#message")

    msg.addClass(type)
    msg.addClass("text-center")
    msg.html(message)

    if(timed) {
        setTimeout(() => {
            clearAlert()
        }, timer)
    }
}

function clearAlert() {
    let msg = $("#message")
    msg.removeClass()
    msg.html('')
}

function channel(name) {
    return name.split("#")[1]
}

function initTracking(channel) {
    $("#connection").remove()

    $("<div id='connectionMessage'></div>").insertAfter("#message")

    let connectionMessage = $("#connectionMessage")

    connectionMessage.text("You are connected to the channel: " + this.channel(channel))
    connectionMessage.addClass("text-center")

    let tracking = $("#tracking")
    tracking.show()
}

function readyToTrack(emote) {
    let selected = null

    if($("#trackingMessage").length == 0) {
        $("<div id='trackingMessage'></div>").insertAfter("#connectionMessage")
    }

    // axios.get("https://twitchemotes.com/api_cache/v2/global.json").then((res) => {
    //     let emotes = res.data.emotes

    //     if(typeof emotes[emote] != 'undefined') {
    //         $("#trackingMessage").html("You are currently tracking: " + "<img src='" + this.imageSrc(res.data.template.small, emotes[emote]) + "'/>" + "(" + emote + ")")
    //     } else {
    //         $("#trackingMessage").text("You are currently tracking: " + emote)
    //     }

    // }).catch((err) => {
    //     alert("Something went wrong...", "error", true, 3000)
    // })

    let trackingMessage = $("#trackingMessage")

    trackingMessage.html("You are currently tracking: " + emote)
    trackingMessage.addClass("text-center")

    if($("#trackCount").length == 0) {
        $("<br/><div id='trackCount'></div><br/>").insertAfter("#trackingMessage")
    }

    $("#emote").val('')
}

function updateTrackCount(count = 0) {
    let trackCount = $("#trackCount")
    trackCount.text("Total Count: " + count)
    trackCount.addClass("success")
    trackCount.addClass("counter")
    trackCount.addClass("text-center")
}

// function imageSrc(url, data) {
//     if(data) {
//         return url.replace("{image_id}", data['image_id'])
//     }

//     return false
// }
