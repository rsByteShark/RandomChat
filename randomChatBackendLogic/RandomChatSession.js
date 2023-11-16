const validator = require("validator").default;

class RandomChatSession {

    /**@type {string} */
    sessionUID;

    /**@type {import("websocket").connection} */
    leftSide;

    /**@type {import("websocket").connection} */
    rightSide;

    /**@type {string[]} */
    leftSideMessages = [];

    /**@type {string[]} */
    rightSideMessages = [];

    /**@type {import("events").EventEmitter} */
    sessionsEventsManagerRef;

    /**
     * Initialize session with random unique identifiers and add ref to websocket connection of left side chatter
     * @param {string} sessionUID
     * @param {import("websocket").connection} leftSide
     * @param {import("events").EventEmitter} sessionsEventsManagerRef
     */
    constructor(sessionUID, leftSide, sessionsEventsManagerRef) {

        this.sessionsEventsManagerRef = sessionsEventsManagerRef;

        this.sessionUID = sessionUID;

        this.leftSide = leftSide;

    }

    /**@param {import("websocket").connection} rightSide */
    addRightSide(rightSide) {

        this.rightSide = rightSide;

        this.leftSide.removeAllListeners("close");

        //start listen for meassages from both sides
        this.leftSide.on("message", (message) => this.frontendMessageHandler(message, "left"));

        this.rightSide.on("message", (message) => this.frontendMessageHandler(message, "right"))

        //if any side disconnects notify and disconnect other side and delete session by emit event to sessions manager
        this.leftSide.on("close", () => {

            this.rightSide.sendUTF(JSON.stringify({ type: "randomDisconnect" }));

            this.rightSide.removeAllListeners("close");

            this.rightSide.close();

            this.sessionsEventsManagerRef.emit("sessionEnd", this.sessionUID);

        })
        this.rightSide.on("close", () => {

            this.leftSide.sendUTF(JSON.stringify({ type: "randomDisconnect" }));

            this.leftSide.removeAllListeners("close");

            this.leftSide.close();

            this.sessionsEventsManagerRef.emit("sessionEnd", this.sessionUID);

        })

        // console.log("EVENTS SET");

    }

    frontendMessageHandler(message, sideDirection) {

        // console.log("MESSAGE OCURED", message, sideDirection);

        if (message.type === 'utf8') {

            //message came. It should be json object with "type" and "message" fields
            try {

                /**@type {import("../typings").FrontendEvent} */
                const recivedMessage = JSON.parse(message.utf8Data)

                //validate if fields are present and if message don't contains illegal characters
                if (!recivedMessage.hasOwnProperty("type") || !recivedMessage.hasOwnProperty("message")) { this.terminateSession(); return }

                //check if message is of "frontendMessage" type
                if (recivedMessage.type === "frontendMessage") {

                    //validate message content
                    if (validator.isAlphanumeric(recivedMessage.message, "pl-PL", { ignore: " -" }) || validator.isAlphanumeric(recivedMessage.message, "de-DE", { ignore: " -" }) || validator.isAlphanumeric(recivedMessage.message, "ru-RU", { ignore: " -" })) { }
                    else { this.terminateSession(); return }

                    if (sideDirection === "left") {

                        //if evrything is fine save message and pass it to other side
                        // this.leftSideMessages.push(recivedMessage.message);

                        this.rightSide.sendUTF(JSON.stringify({
                            type: "messageFromOtherSide",
                            message: recivedMessage.message
                        }));

                        // console.log('MESSAGE TO RIGTH SENT');


                    } else {

                        //if evrything is fine save message and pass it to other side
                        // this.rightSideMessages.push(recivedMessage.message);

                        this.leftSide.sendUTF(JSON.stringify({
                            type: "messageFromOtherSide",
                            message: recivedMessage.message
                        }));

                        // console.log('MESSAGE TO LEFT SENT');

                    }

                }

            } catch (err) {

                // console.log(`SESSION TERMINATED WITH ERROR: ${err}`);

                this.terminateSession();

            }


        } else if (message.type === 'binary') {

            // console.log('SESSION TERMINATED RECIVED BINARY DATA');


            //message shouldn't be binary something is wrong terminate session
            this.terminateSession();

        }



    }

    terminateSession() {

        // console.log('SESSION TERMINATED');


    }
}

/**@type {import("../typings").RandomChatSession} */
module.exports = RandomChatSession