import History from "./modules/history.module.js";
import Chat from "./modules/chat.module.js";

const createChatBtn = document.getElementById("create_chat_btn");
const sendMsgBtn = document.getElementById("send-button");
const messageContainer = document.getElementById("chat-messages");
const historyContainer = document.getElementById("history-list");

const updateScroll = () => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const updateChatBoxStyle = () => {
    let chat_id = location.search.split("=")[1];
    const chat_password = location.search.split("=")[2];

    if (chat_password) chat_id = chat_id.split("&")[0];

    const chatBox = document.getElementById(chat_id);
    
    if (chatBox) {
        chatBox.style.backgroundColor = "#007bff";
    }
}

const setChatEvent = (id) => {
    $(`#${id}`).on("click", function() {
        history.pushState({}, "", "/?chat_id=" + this.id);
        location.reload();
    });
}

const connect_secret_chat = (chat_password) => {
    let chat_id = location.search.split("=")[1];
    const check_password = location.search.split("=")[2];

    if (check_password) chat_id = chat_id.split("&")[0];

    history.pushState({}, "", `/?chat_id=${chat_id}&chat_password=${chat_password}`);
    location.reload();
}

document.addEventListener("DOMContentLoaded", async () => {
    const history = new History();

    const listResult = await history.getHistoryList();
    const dataResult = await history.getHistory();

    if (listResult.isHistory) {
        for (let i = 0; i < listResult.list.length; i++) {
            const data = listResult.list[i];
            const historyDIV = document.createElement("div");

            historyDIV.id = data.id;
            historyDIV.innerText = data.title;
            historyDIV.innerText += data.isSecret ? " (보호됨)" : " ";

            historyContainer.appendChild(historyDIV);

            setChatEvent(data.id);
        }

        updateChatBoxStyle();
    }

    if (dataResult.isHistoryJSON) {
        for (let j = 1; j < dataResult.json.length; j++) {
            const data = dataResult.json[j];

            messageContainer.innerHTML += `
            <div class="chat" style="${dataResult.username == data.sender ? "background-color: #eec2c2;" : "background-color: #eaeef2;"}">
                <p class="chat-role">< ${data.sender} ></p>
                <message id="${j}" class="message">${data.message.replaceAll("\n", "</br>")}</message>
            </div>`
        }
    } else if (dataResult.isSecret) {
        const chat_password = prompt("채팅 접속에 실패하였습니다, 보호된 채팅으로 전용 비밀번호 입력을 통해서만 접속이 가능합니다.", "");

        if (chat_password) connect_secret_chat(chat_password);
    }

    messageContainer.scrollTop = messageContainer.scrollHeight;
});

createChatBtn.addEventListener("click", async () => {
    const toUsername = prompt("상대방 직원ID를 입력해주세요.", "");

    const chat = new Chat();
    const result = await chat.createChat(toUsername);

    if (result.isCreated) {
        const chat_id = result.chat_id;
        const historyDIV = document.createElement("div");

        historyDIV.id = chat_id;
        historyDIV.innerText = `새로운 직원 채팅`;

        historyContainer.appendChild(historyDIV);
    } else {
        alert("채팅 생성에 실패하였습니다, 관련 직원팀에 문의해주세요.");
    }
});

sendMsgBtn.addEventListener("click", async () => {
    const message = document.getElementById("chat-input").value;
    const messageBox = document.getElementById("chat-input");

    messageBox.value = "";

    messageContainer.innerHTML += `<div class="chat" style="background-color: #eec2c2;"><p class="chat-role">< ME ></p><message>${message}<message></div>`;

    const chat = new Chat();
    const result = await chat.send(message);

    if (result.isSended) {
        chat.addMessage(result.message, messageContainer);

        updateScroll();
    } else {
        alert("failed");
    }
});