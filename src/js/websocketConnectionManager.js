import "../css/chatPage.css"
import { addInfo, addMessage, showSearch, showFound, createSessionTimeString, clearChat } from "./chatMessagesManipulator"
import validator from "validator";

//handle message input
let authorizedDisconnect = false;
const form = document.querySelector("form");
const messageInput = document.querySelector("input[name='m']");
let searchAnimationInterval;
let sessionTimer;
let sessionTime = 0;
messageInput.disabled = true;


//prod
// const ws = new WebSocket(`wss://${window.location.hostname}/randomchat`)

//local test
let ws = new WebSocket(`ws://${window.location.hostname}:3000/randomchat`);


const submitHandler = (evt) => {

    evt.preventDefault();

    //check if submited input don't contains forbiden characters
    if (validator.isAlphanumeric(messageInput.value, "pl-PL", { ignore: " -" }) || validator.isAlphanumeric(messageInput.value, "de-DE", { ignore: " -" }) || validator.isAlphanumeric(messageInput.value, "ru-RU", { ignore: " -" })) { }
    else { addInfo("Your message contains illegal characters (use only letters and numbers)"); return }

    const jsonMessage = {
        type: "frontendMessage",
        message: messageInput.value
    }

    ws.send(JSON.stringify(jsonMessage));

    addMessage(messageInput.value, createSessionTimeString(sessionTime), 0);

    messageInput.value = "";

    messageInput.blur();

}

form.addEventListener("submit", submitHandler);

const wsOpenHandler = (evt) => {

    // console.log(`connected to wss://${window.location.hostname}/randomchat`);

};

const wsMessageHandler = (evt) => {

    const backendData = JSON.parse(evt.data);

    switch (backendData.type) {
        case "searchStart":

            addInfo(backendData.message);

            searchAnimationInterval = showSearch();

            break;
        case "searchFound":

            clearInterval(searchAnimationInterval);

            clearChat();

            showFound();

            messageInput.disabled = false;

            messageInput.focus();

            sessionTimer = setInterval(() => sessionTime++, 1000);

            break;
        case "messageFromOtherSide":

            addMessage(backendData.message, createSessionTimeString(sessionTime), 1);

            break;

        case "randomDisconnect":

            clearInterval(sessionTimer);

            sessionTime = 0;

            addInfo("Random disconnected ...")

            authorizedDisconnect = true;

            ws.close();

            break;
        default:
            break;
    }

}

const wsCloseHandler = (evt) => {

    if (authorizedDisconnect) {

        console.log("connection closed");

    } else {

        console.log("unauthorized Disconnect...");
    }



};

ws.onopen = wsOpenHandler;

ws.onmessage = wsMessageHandler;

ws.onclose = wsCloseHandler;


const newRandomButton = document.querySelector("button");

newRandomButton.addEventListener("click", () => {

    if (ws.readyState === ws.OPEN) {

        clearInterval(sessionTimer);

        sessionTime = 0;

        authorizedDisconnect = true;

        ws.close();

    }

    authorizedDisconnect = false;

    clearChat();

    //prod
    // const ws = new WebSocket(`wss://${window.location.hostname}/randomchat`)

    //test
    ws = new WebSocket(`ws://${window.location.hostname}:3000/randomchat`)

    ws.onopen = wsOpenHandler;

    ws.onmessage = wsMessageHandler;

    ws.onclose = wsCloseHandler;

})
