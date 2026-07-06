/* =========================
   ELEMENTOS
========================= */

const toggle = document.getElementById("chatToggle");
const container = document.getElementById("chatContainer");
const close = document.getElementById("closeChat");

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

document.getElementById("chatUser").innerText =
localStorage.getItem("userName") || "Usuario";

/* =========================
   ABRIR CHAT
========================= */

toggle.addEventListener("click",()=>{

    container.classList.add("active");

    chatInput.focus();

});

close.addEventListener("click",()=>{

    container.classList.remove("active");

});

/* =========================
   HORA
========================= */

function getTime(){

    const now=new Date();

    return now.toLocaleTimeString("es-CO",{

        hour:"2-digit",

        minute:"2-digit"

    });

}

/* =========================
   GUARDAR HISTORIAL
========================= */

function saveHistory(){

    localStorage.setItem(

        "chatHistory",

        chatMessages.innerHTML

    );

}

function loadHistory(){

    const history=

    localStorage.getItem("chatHistory");

    if(history){

        chatMessages.innerHTML=history;

        chatMessages.scrollTop=

        chatMessages.scrollHeight;

    }

}

loadHistory();

/* =========================
   MENSAJES
========================= */

function addMessage(type,text){

    const div=document.createElement("div");

    div.className=

        type==="user"

        ?"user-message"

        :"bot-message";

    div.innerHTML=`

        <div>${text}</div>

        <span class="chat-time">

            ${getTime()}

        </span>

    `;

    chatMessages.appendChild(div);

    chatMessages.scrollTop=

    chatMessages.scrollHeight;

    saveHistory();

}

/* =========================
   ENTER
========================= */

chatInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        sendChat.click();

    }

});

/* =========================
   ENVIAR
========================= */

sendChat.addEventListener("click",async()=>{

    const text=

    chatInput.value.trim();

    if(!text)return;

    addMessage("user",text);

    chatInput.value="";

    chatInput.focus();

    sendChat.disabled=true;

    const typing=document.createElement("div");

    typing.className="bot-message";

    typing.id="typing";

    typing.innerHTML="🤖 Escribiendo...";

    chatMessages.appendChild(typing);

    chatMessages.scrollTop=

    chatMessages.scrollHeight;

    try{

        const response=

        await fetch("/api/chat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:text

            })

        });

        const result=

        await response.json();

        typing.remove();

        addMessage(

            "bot",

            result.response

        );

    }catch(err){

        console.error(err);

        typing.remove();

        addMessage(

            "bot",

            "⚠️ No fue posible conectarse con el asistente."

        );

    }

    sendChat.disabled=false;

});