const RandomChatSessionsManager = require('./randomChatBackendLogic/RandomChatSessionsManager');
const { WebSocketServer } = require("ws");


/**
 * @param {import("https").Server} httpsServer 
 * @returns {Promise<import("./typings").RandomChatSessionsManager>}
 */
module.exports.wssServerInit = (httpsServer) => {

    return new Promise((resolve, reject) => {

        try {

            //set up websocket overlay for https server
            const wsServer = new WebSocketServer({
                server: httpsServer,
                perMessageDeflate: {
                    zlibDeflateOptions: {
                        chunkSize: 1024,
                        memLevel: 7,
                        level: 3
                    },
                    zlibInflateOptions: {
                        chunkSize: 10 * 1024
                    },
                    clientNoContextTakeover: true,
                    serverNoContextTakeover: true,
                    serverMaxWindowBits: 10,
                    concurrencyLimit: 10,
                    threshold: 1024

                }
            });

            //create sessions manager
            const sessionsManager = new RandomChatSessionsManager(wsServer);

            wsServer.on('connection', function (ws, req) {

                //create new random chat session
                sessionsManager.createSession(ws, req);


            });


            resolve(sessionsManager);

        } catch (err) {

            reject(err);

        }




    })

}