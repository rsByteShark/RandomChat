const RandomChatSession = require("./RandomChatSession");
const forge = require("node-forge");
const RandomChatEventsManager = require("./RandomChatEventsManager");

class RandomChatSessionsManager {

    /**@type {import("websocket").server} */
    managedWebsocketServer;

    /**@type {import("../typings").SessionsStash} */
    sessions = {}

    /**
     * Contains UID's of sessions wich wait for second chatter
     * @type {string[]}
     */
    pendingSessions = [];

    sessionsEvents = new RandomChatEventsManager();

    /**@type {import("../typings").SessionsStats} */
    sessionStats = {
        curentChatters: 0,
        chattersPerHour: 0
    }

    chattersPerHourClearInterval;

    /**@param {import("websocket").server} managedWebsocketServer  */
    constructor(managedWebsocketServer) {

        //each hour clear chattersPerHour counter
        this.chattersPerHourClearInterval = setInterval(() => { this.sessionStats.chattersPerHour = 0 }, (60000 * 60))

        //on any session event log event
        this.sessionsEvents.onAny(function () {

            // console.log(`Event with name ${arguments[0]} occured with arguments: `);

            const arg = [...arguments];

            arg.forEach((arg, index) => {

                // if (index) console.log(arg);

            })

        })

        //when random chatter joins pending queue "newPendingSession" event is emited 
        this.sessionsEvents.on("newPendingSession", () => {

        })

        //when another chatter is added to pending session, session becomes active
        this.sessionsEvents.on("newActiveSession", () => {

        })

        //when one of sides disconnects session ends and needs to be deleted form sessions stash
        this.sessionsEvents.on("sessionEnd", (sessionUID) => {

            delete this.sessions[sessionUID];

        })

        this.managedWebsocketServer = managedWebsocketServer;

    }

    /**
     * @param {import("websocket").connection} incomingConnection websocket connection that looks for another chatter
     * @returns {string} sessionUID */
    createSession(incomingConnection) {

        //mark that someone connect to this chat
        this.sessionStats.curentChatters++;
        this.sessionStats.chattersPerHour++;

        //notify chatter that random is searched
        incomingConnection.sendUTF(JSON.stringify({ type: "searchStart", message: `Looking for random chatter... chatters count in last hour: ${this.sessionStats.chattersPerHour}` }))

        //check if there are pending sessions
        if (this.pendingSessions.length > 0) {

            const sessionUID = this.pendingSessions[0];

            //add incoming connection to right side
            this.sessions[sessionUID].addRightSide(incomingConnection);

            //remove session from pending queue
            this.pendingSessions.splice(this.pendingSessions.indexOf(sessionUID), 1);

            this.sessionsEvents.emit("newActiveSession", sessionUID);

            //notify chatter that random was found
            this.sessions[sessionUID].leftSide.sendUTF(JSON.stringify({ type: "searchFound" }));
            this.sessions[sessionUID].rightSide.sendUTF(JSON.stringify({ type: "searchFound" }));

            return sessionUID
        }

        //if there isn't any pending sessions generate session UID create new session and add it to pending queue

        //ensure that id is unique
        /**@type {string} */
        let sessionUID;
        do {

            sessionUID = forge.util.bytesToHex(forge.random.getBytesSync(4));

        } while (this.sessions.hasOwnProperty(sessionUID))


        this.sessions[sessionUID] = new RandomChatSession(sessionUID, incomingConnection, this.sessionsEvents);

        //if chatter disconects while alone in session destroy session and remove it from pending queue
        incomingConnection.on("close", () => {

            delete this.sessions[sessionUID];

            this.pendingSessions.splice(this.pendingSessions.indexOf(sessionUID), 1);

            this.sessionsEvents.emit("pendingSessionClosed", sessionUID);

        })

        this.pendingSessions.push(sessionUID);

        this.sessionsEvents.emit("newPendingSession", sessionUID);

        return sessionUID

    }

    /**@returns  {import("../typings").SessionsStats} */
    getSessionsStats() {

        return this.sessionStats

    }

}

/**@type {import("../typings").RandomChatSessionsManager} */
module.exports = RandomChatSessionsManager