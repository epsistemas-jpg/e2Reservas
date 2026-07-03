const toggle=document.getElementById("chatToggle");

const container=document.getElementById("chatContainer");

const close=document.getElementById("closeChat");

toggle.addEventListener("click",()=>{

    container.classList.add("active");

});

close.addEventListener("click",()=>{

    container.classList.remove("active");

});

document.getElementById("chatUser").innerText=
localStorage.getItem("userName") || "Usuario";