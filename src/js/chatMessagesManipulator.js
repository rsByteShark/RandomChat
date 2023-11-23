export const addInfo = (message) => {

    const chatSection = document.querySelector("section");

    const infoElement = document.createElement("i");

    infoElement.innerText = message;

    const infoMessageElement = document.createElement("p");

    infoMessageElement.appendChild(infoElement)

    chatSection.appendChild(infoMessageElement);

}

//identity false adds message as "You" true as "Random"
export const addMessage = (message, sessionTime, identity) => {

    const chatSection = document.querySelector("section");

    const sessionTimeElement = document.createElement("u");

    sessionTimeElement.innerText = `${sessionTime} - `;

    const selfNameElement = document.createElement(identity ? "b" : "s");

    selfNameElement.innerText = identity ? "Random" : "You:";

    const selfMessageContainer = document.createElement("p");

    selfMessageContainer.appendChild(sessionTimeElement);

    selfMessageContainer.appendChild(selfNameElement);

    selfMessageContainer.append(` ${message}`);

    chatSection.appendChild(selfMessageContainer);

}

export const showSearch = () => {

    let searchString = "searching";

    const chatSection = document.querySelector("section");

    const infoElement = document.createElement("i");

    infoElement.id = "search";

    infoElement.innerText = searchString;

    const infoMessageElement = document.createElement("p");

    infoMessageElement.appendChild(infoElement)

    chatSection.appendChild(infoMessageElement);

    let dotCount = 0;
    let dotMax = 3;
    return setInterval(() => {

        if (dotCount < dotMax) {

            searchString += ".";
            dotCount++;

        } else {

            searchString = "searching";
            dotCount = 0;
        }


        infoElement.innerText = searchString

    }, 700)

}

export const showFound = () => {

    const chatSection = document.querySelector("section");

    const infoElement = document.createElement("i");

    infoElement.innerText = "Random chatter Found! Say hi";

    const infoMessageElement = document.createElement("p");

    infoMessageElement.appendChild(infoElement)

    chatSection.appendChild(infoMessageElement);

}
export const createSessionTimeString = (sessionTime) => {

    let min = Math.floor(sessionTime / 60).toString();
    let sec = (sessionTime % 60).toString();

    if (sessionTime / 60 < 10) min = "0" + min;
    if (sessionTime % 60 < 10) sec = "0" + sec;

    return `${min} : ${sec}`

}

export const clearChat = () => {

    const chatSection = document.querySelector("section");

    while (chatSection.hasChildNodes()) {

        chatSection.removeChild(chatSection.firstChild);

    }

}