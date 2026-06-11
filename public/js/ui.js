/* =========================
   MODAL RESERVA
========================= */

const openModal =
document.getElementById("openModal");

const closeModal =
document.getElementById("closeModal");

const reservationModal =
document.getElementById("reservationModal");

openModal.addEventListener("click",()=>{

    reservationModal
    .classList
    .add("active");
});

closeModal.addEventListener("click",()=>{

    reservationModal
    .classList
    .remove("active");
});

reservationModal.addEventListener("click",(e)=>{

    if(e.target === reservationModal){

        reservationModal
        .classList
        .remove("active");
    }
});

/* =========================
   TOAST
========================= */

function showToast(type,title,message){

    const toastContainer =
    document.getElementById(
        "toastContainer"
    );

    const toast =
    document.createElement("div");

    toast.className =
    `toast ${type}`;

    let icon = "fa-circle-info";

    if(type === "success"){

        icon = "fa-circle-check";

    }else if(type === "error"){

        icon = "fa-circle-xmark";

    }else if(type === "warning"){

        icon =
        "fa-triangle-exclamation";
    }

    toast.innerHTML = `

        <i class="fa-solid ${icon}"></i>

        <div class="toast-content">

            <h4>${title}</h4>

            <p>${message}</p>

        </div>
    `;

    toastContainer.appendChild(
        toast
    );

    setTimeout(()=>{

        toast.style.animation =
        "toastOut 0.4s ease forwards";

        setTimeout(()=>{

            toast.remove();

        },400);

    },3500);
}

/* =========================
   LOADER
========================= */

setTimeout(()=>{

    showToast(
        "success",
        "Sistema iniciado",
        "Dashboard cargado correctamente"
    );

},1200);