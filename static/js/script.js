const socket = io();
let displayName = localStorage.getItem("displayName") || "";
let currentChannel = localStorage.getItem("currentChannel") || null;

const displayNameInput = document.getElementById("display-name-input");
const saveDisplayNameBtn = document.getElementById("save-display-name");
const displayNameSection = document.getElementById("display-name-section");
const channelList = document.getElementById("channel-list");
const formCreateChannel = document.getElementById("form-create-channel");
const channelNameInput = document.getElementById("channel-name");
const currentChannelTitle = document.getElementById("current-channel-title");
const messagesDiv = document.getElementById("messages");
const sendMessageForm = document.getElementById("send-message-form");
const messageInput = document.getElementById("message-input");

function updateDisplayNameUI() {
    if (displayName) {
        displayNameInput.value = displayName;
        displayNameInput.disabled = true;
        saveDisplayNameBtn.disabled = true;
        displayNameSection.style.display = "none";
        sendMessageForm.style.display = currentChannel ? "flex" : "none";
    } else {
        displayNameSection.style.display = "block";
        sendMessageForm.style.display = "none";
    }
}

saveDisplayNameBtn.onclick = function() {
    const name = displayNameInput.value.trim();
    if (name) {
        displayName = name;
        localStorage.setItem("displayName", displayName);
        updateDisplayNameUI();
    }
};

displayNameInput.value = displayName;
updateDisplayNameUI();

function loadChannels() {
    fetch("/channels")
        .then(response => response.json())
        .then(channels => {
            channelList.innerHTML = "";
            channels.forEach(channel => {
                const li = document.createElement("li");
                li.textContent = channel;
                if (channel === currentChannel) li.classList.add("selected");
                li.onclick = () => selectChannel(channel);
                channelList.appendChild(li);
            });
        });
}

function selectChannel(channel) {
    currentChannel = channel;
    localStorage.setItem("currentChannel", channel);
    currentChannelTitle.textContent = `Channel: ${channel}`;
    Array.from(channelList.children).forEach(li => {
        li.classList.toggle("selected", li.textContent === channel);
    });
    sendMessageForm.style.display = displayName ? "flex" : "none";
    loadMessages(channel);
    socket.emit("join", { channel });
}

function loadMessages(channel) {
    fetch(`/channels/${channel}/messages`)
        .then(response => response.json())
        .then(messages => {
            messagesDiv.innerHTML = "";
            messages.forEach(msg => {
                addMessageToUI(msg);
            });
        });
}

function addMessageToUI(msg) {
    const div = document.createElement("div");
    div.setAttribute("class", "message");
    div.setAttribute("data-timestamp", msg.timestamp);
    div.setAttribute("data-user", msg.user);
    div.innerHTML = `
    <div>Date: ${ msg.timestamp}</div>
    <div class="username"> Username: ${msg.user}</div>
    <div class="content">${msg.message}</div>`;

    if (msg.user=== displayName) {
        const button_delete= document.createElement("button");
        button_delete.setAttribute("class", "delete_message");
        button_delete.innerText="X";
        button_delete.onclick= function(){
            socket.emit("delete_message", {
                channel: currentChannel,
                timestamp: msg.timestamp,
                user:msg.user
            });
        };
        div.appendChild(button_delete);
    }else{
        const void_div = document.createElement("div");
        void_div.className="void";
        div.appendChild(void_div);
    }
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

formCreateChannel.onsubmit = function(e) {
    e.preventDefault();
    const name = channelNameInput.value.trim();
    if (name) {
        socket.emit("create_channel", { name });
        channelNameInput.value = "";
    }
};

socket.on("channel_created", data => {
    loadChannels();
});

socket.on("message_deleted", data => {
    Array.from(messagesDiv.children).forEach(div => {
        if (
            div.getAttribute("data-timestamp") === data.timestamp &&
            div.getAttribute("data-user") === data.user
        ) {
            div.remove();
        }
    });
});

sendMessageForm.onsubmit = function(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && currentChannel && displayName) {
        socket.emit("send_message", {
            channel: currentChannel,
            user: displayName,
            message: message
        });
        messageInput.value = "";
    }
};

socket.on("new_message", data => {
    if (data.channel === currentChannel) {
        addMessageToUI(data.message);
    }
});

socket.on("connect", () => {
    if (currentChannel) {
        socket.emit("join", { channel: currentChannel });
    }
});

loadChannels();
if (currentChannel) {
    selectChannel(currentChannel);
}