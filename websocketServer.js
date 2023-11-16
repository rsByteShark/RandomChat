const RandomChatSessionsManager = require('./randomChatBackendLogic/RandomChatSessionsManager');
const WebSocketServer = require('websocket').server;

/**
 * @param {import("https").Server} httpsServer 
 * @returns {Promise<import("./typings").RandomChatSessionsManager>}
 */
module.exports.wssServerInit = (httpsServer) => {

    return new Promise((resolve, reject) => {

        try {



            //set up websocket overlay for https server
            const wsServer = new WebSocketServer({
                httpServer: httpsServer,
                autoAcceptConnections: false,
            });

            //create sessions manager
            const sessionsManager = new RandomChatSessionsManager(wsServer);

            function originIsAllowed(origin) {
                // put logic here to detect whether the specified origin is allowed.

                return true;
            }

            wsServer.on('request', function (request) {

                if (!originIsAllowed(request.origin)) {
                    // Make sure we only accept requests from an allowed origin
                    request.reject();

                    return;
                }


                if (request.resourceURL.href === "/randomchat") {

                    const connection = request.accept();

                    //create new random chat session
                    sessionsManager.createSession(connection);

                    // connection.sendUTF("Hello from Backend");

                    // connection.on('message', function (message) {

                    //     if (message.type === 'utf8') {
                    //         console.log('Received Message: ' + message.utf8Data);


                    //     }
                    //     else if (message.type === 'binary') {
                    //         console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                    //         connection.sendBytes(message.binaryData);
                    //     }

                    // });

                    // connection.on('close', function (reasonCode, description) {
                    //     console.log(' Peer ' + connection.remoteAddress + ' disconnected.');
                    // });


                } else request.reject();


            });


            resolve(sessionsManager);

        } catch (err) {

            reject(err);

        }




    })

}