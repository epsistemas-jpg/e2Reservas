const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

function addMessage(type, text){

    const div = document.createElement("div");

    div.className =
        type === "user"
        ? "user-message"
        : "bot-message";

    div.innerHTML = text;

    chatMessages.appendChild(div);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}

sendChat.addEventListener("click", async () => {

    const text = chatInput.value.trim();

    if (!text) return;

    addMessage("user", text);

    chatInput.value = "";

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: text

            })

        });

        const result = await response.json();

        addMessage("bot", result.response);

    } catch (err) {

        console.error(err);

        addMessage(

            "bot",

            "⚠️ No fue posible conectarse con el asistente."

        );

    }

});