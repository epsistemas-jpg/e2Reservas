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
function getBotResponse(message){

    message = message.toLowerCase();

    if(message.includes("hola")){

        return "👋 Hola, ¿en qué puedo ayudarte?";

    }

    if(message.includes("crear reserva")){

        return "Para crear una reserva solo debes hacer clic sobre el día del calendario o en el botón Nueva Reserva.";

    }

    if(message.includes("editar")){

        return "Haz clic sobre una reserva que sea tuya para editarla.";

    }

    if(message.includes("eliminar")){

        return "Haz clic sobre tu reserva y luego presiona Eliminar.";

    }

    if(message.includes("google")){

        return "Cuando crees una reserva aparecerá la opción Agregar a Google Calendar.";

    }

    if(message.includes("outlook")){

        return "También puedes descargar un archivo .ICS compatible con Outlook.";

    }

    if(message.includes("historial")){

        return "En el menú lateral encontrarás la opción Historial donde podrás consultar reservas pasadas.";

    }

    if(message.includes("mis reservas")){

        return "Selecciona Mis Reservas para visualizar únicamente las reservas creadas por ti.";

    }

    if(message.includes("salas")){

        return "Actualmente puedes reservar Bocas de Ceniza, Río Magdalena y Piso 1109.";

    }

    return "Lo siento 😅 todavía estoy aprendiendo. Reformula la pregunta o comunícate con el administrador.";

}
sendChat.addEventListener("click",()=>{

    const text = chatInput.value.trim();

    if(text==="") return;

    addMessage("user",text);

    const response =
        getBotResponse(text);

    setTimeout(()=>{

        addMessage("bot",response);

    },500);

    chatInput.value="";

});
chatInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        sendChat.click();

    }

});