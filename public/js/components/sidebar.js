/* =========================
   MOBILE MENU
========================= */

const menuToggle =
    document.getElementById(
        "menuToggle"
    );

const sidebar =
    document.querySelector(
        ".sidebar"
    );

menuToggle.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "active"
        );
    }
);

/* =========================
   DASHBOARD
========================= */

document.getElementById(
    "dashboardMenu"
).addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        window.currentEndpoint =
            "/api/reservations";

        calendar.refetchEvents();

        showToast(
            "success",
            "Dashboard",
            "Mostrando todas las reservas"
        );
    }
);

/* =========================
   NUEVA RESERVA
========================= */

document.getElementById(
    "reserveMenu"
).addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        editingReservationId =
            null;

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

        // 🔹 Endpoint historial
        window.currentEndpoint =
            "/api/history";

        // 🔹 Refrescar calendario
        calendar.refetchEvents();

        showToast(
            "info",
            "Historial",
            "Mostrando reservas finalizadas"
        );
    }
    
);
