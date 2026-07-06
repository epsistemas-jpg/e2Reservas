/* =========================
   ELEMENTOS DEL CHAT
========================= */

const toggle = document.getElementById("chatToggle");
const container = document.getElementById("chatContainer");
const close = document.getElementById("closeChat");

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

/* =========================
   ABRIR / CERRAR CHAT
========================= */

toggle.addEventListener("click", () => {

    container.classList.add("active");

    // Poner el cursor automáticamente en el input
    chatInput.focus();

});

close.addEventListener("click", () => {

    container.classList.remove("active");

});

document.getElementById("chatUser").innerText =
    localStorage.getItem("userName") || "Usuario";

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

// Permitir enviar con Enter
chatInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        sendChat.click();

    }

});