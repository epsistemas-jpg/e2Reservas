/* =========================
SIDEBAR - BOTÓN HAMBURGUESA
========================= */

const sidebarToggle =
document.getElementById(
    "sidebarToggle"
);

const sidebar =
document.querySelector(
    ".sidebar"
);

if (sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        () => {

            // MÓVIL: abrir y cerrar menú
            if (window.innerWidth <= 900) {

                sidebar.classList.toggle(
                    "active"
                );

            } 
            
            // PC: contraer y expandir sidebar
            else {

                sidebar.classList.toggle(
                    "collapsed"
                );

            }
        }
    );
}


/* =========================
DASHBOARD
========================= */

const reserveMenu = document.getElementById("reserveMenu");

if (reserveMenu) {
    reserveMenu.addEventListener("click", () => {
        
    });
}


/* =========================
NUEVA RESERVA
========================= */

document.getElementById(
    "reserveMenu"
).addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        editingReservationId = null;

        document.getElementById(
            "reservationForm"
        ).reset();

        document.querySelector(
            ".modal-header h2"
        ).innerText =
            "Nueva Reserva";

        document.querySelector(
            ".submit-btn"
        ).innerText =
            "Crear Reserva";

        const deleteBtn =
            document.getElementById(
                "deleteReservation"
            );

        if (deleteBtn) {

            deleteBtn.style.display =
                "none";

        }

        reservationModal
            .classList
            .add("active");

    }
);


/* =========================
MIS RESERVAS
========================= */

document.getElementById(
    "myReservationsMenu"
).addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        window.currentEndpoint =
            "/api/myreservations";

        calendar.refetchEvents();

        showToast(
            "success",
            "Mis Reservas",
            "Mostrando tus reservas activas"
        );

    }
);


/* =========================
HISTORIAL
========================= */

document.getElementById(
    "historyMenu"
).addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        window.currentEndpoint =
            "/api/history";

        calendar.refetchEvents();

        showToast(
            "info",
            "Historial",
            "Mostrando reservas finalizadas"
        );

    }
);