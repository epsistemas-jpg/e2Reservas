let calendar;

window.currentEndpoint =
    "/api/reservations";

let editingReservationId = null;

let currentView = "all";

let currentRoomFilter = "all";

document.addEventListener("DOMContentLoaded", function () {

    const tooltip =
        document.getElementById("tooltip");

    const calendarEl =
        document.getElementById("calendar");

    const reservationModal =
        document.getElementById("reservationModal");

    const reservationForm =
        document.getElementById("reservationForm");

    const deleteReservationBtn =
        document.getElementById("deleteReservation");
    const openModalBtn =
        document.getElementById("openModal");

    /* =========================
       CALENDARIO
    ========================= */

    calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: "dayGridMonth",

        locale: "es",

        height: "auto",

        eventDisplay: "block",

        dayMaxEvents: true,

        eventTimeFormat: {

            hour: "2-digit",

            minute: "2-digit",

            hour12: false
        },

        /* =========================
           CARGAR EVENTOS
        ========================= */

        events: async function (
            fetchInfo,
            successCallback,
            failureCallback
        ) {

            try {

                const endpoint =
                    window.currentEndpoint ||
                    "/api/reservations";

                const res =
                    await fetch(endpoint);

                const data =
                    await res.json();

                const ahora =
                    new Date();

                const events =
                    data
                        .filter(r => {

                            const fechaFin =
                                new Date(
                                    `${new Date(r.date)
                                        .toISOString()
                                        .split("T")[0]}T${r.end_time}`
                                );

                            // FILTRO SALA
                            if (
                                currentRoomFilter !== "all" &&
                                r.room !== currentRoomFilter
                            ) {

                                return false;
                            }

                            // MIS RESERVAS
                            if (
                                endpoint ===
                                "/api/myreservations"
                            ) {

                                return fechaFin >= ahora;
                            }

                            // HISTORIAL
                            if (
                                endpoint ===
                                "/api/history"
                            ) {

                                return fechaFin < ahora;
                            }

                            // DASHBOARD
                            return fechaFin >= ahora;

                        })

                        .map(r => {

                            let color =
                                "#3a87ad";

                            if (
                                endpoint ===
                                "/api/history"
                            ) {

                                color =
                                    "#64748b";
                            }

                            if (
                                r.room ===
                                "Bocas de ceniza"
                            ) {

                                color =
                                    "#f39c12";

                            } else if (
                                r.room ===
                                "Rio Magdalena"
                            ) {

                                color =
                                    "#27ae60";

                            } else if (
                                r.room ===
                                "Piso 1109"
                            ) {

                                color =
                                    "#2980b9";
                            }

                            const fecha =
                                new Date(r.date)
                                    .toISOString()
                                    .split("T")[0];

                            return {

                                id: r.id,

                                title:
                                    `${r.room} • ${r.user_name || "Yo"}`,

                                start:
                                    `${fecha}T${r.start_time}`,

                                end:
                                    `${fecha}T${r.end_time}`,

                                backgroundColor:
                                    color,

                                borderColor:
                                    color,

                                textColor:
                                    "#ffffff",

                                classNames:
                                    ["custom-event"],

                                extendedProps: {

                                    horaInicio:
                                        r.start_time,

                                    horaFin:
                                        r.end_time,

                                    motivo:
                                        r.motivo,

                                    userId:
                                        r.user_id,

                                    room:
                                        r.room,

                                    userName:
                                        r.user_name || "Yo"
                                }
                            };
                        });

                successCallback(events);

                const skeleton =
                    document.getElementById(
                        "calendarSkeleton"
                    );

                if (skeleton) {

                    skeleton.style.display =
                        "none";
                }

                if (calendarEl) {

                    calendarEl.style.display =
                        "block";
                }

                calendar.updateSize();

            } catch (err) {

                console.error(
                    "ERROR CALENDARIO:",
                    err
                );

                failureCallback(err);
            }
        },

        /* =========================
           PERSONALIZAR EVENTOS
        ========================= */

        eventContent: function (arg) {

            const hora =
                arg.event.extendedProps.horaInicio
                    ?.substring(0, 5);

            const sala =
                arg.event.extendedProps.room;

            const usuario =
                arg.event.extendedProps.userName;

            return {

                html: `

                <div class="evento-box">

                    <div class="evento-hora">
                        ${hora}
                    </div>

                    <div class="evento-sala">
                        ${sala}
                    </div>

                    <div class="evento-usuario">
                        ${usuario}
                    </div>
                    

                </div>

                `
            };
        },

        /* =========================
           TOOLTIP
        ========================= */

        eventDidMount: function (info) {

            if (!tooltip) return;

            info.el.addEventListener(
                "mouseenter",
                (e) => {

                    tooltip.innerHTML = `

                    <div class="tooltip-title">
                        ${info.event.extendedProps.room}
                    </div>

                    <div class="tooltip-item">
                        <b>Usuario:</b>
                        ${info.event.extendedProps.userName}
                    </div>

                    <div class="tooltip-item">
                        <b>Inicio:</b>
                        ${info.event.extendedProps.horaInicio}
                    </div>

                    <div class="tooltip-item">
                        <b>Fin:</b>
                        ${info.event.extendedProps.horaFin}
                    </div>

                    <div class="tooltip-item">
                        <b>Motivo:</b>
                        ${info.event.extendedProps.motivo || "Sin motivo"}
                    </div>

                    `;

                    tooltip.style.opacity = "1";

                    const tooltipWidth =
                        tooltip.offsetWidth;

                    const tooltipHeight =
                        tooltip.offsetHeight;

                    let x =
                        e.clientX + 15;

                    let y =
                        e.clientY + 15;

                    if (
                        x + tooltipWidth >
                        window.innerWidth
                    ) {

                        x =
                            window.innerWidth -
                            tooltipWidth -
                            20;
                    }

                    if (
                        y + tooltipHeight >
                        window.innerHeight
                    ) {

                        y =
                            window.innerHeight -
                            tooltipHeight -
                            20;
                    }

                    tooltip.style.left =
                        x + "px";

                    tooltip.style.top =
                        y + "px";
                }
            );

            info.el.addEventListener(
                "mousemove",
                (e) => {

                    const tooltipWidth =
                        tooltip.offsetWidth;

                    const tooltipHeight =
                        tooltip.offsetHeight;

                    let x =
                        e.clientX + 15;

                    let y =
                        e.clientY + 15;

                    if (
                        x + tooltipWidth >
                        window.innerWidth
                    ) {

                        x =
                            window.innerWidth -
                            tooltipWidth -
                            20;
                    }

                    if (
                        y + tooltipHeight >
                        window.innerHeight
                    ) {

                        y =
                            window.innerHeight -
                            tooltipHeight -
                            20;
                    }

                    tooltip.style.left =
                        x + "px";

                    tooltip.style.top =
                        y + "px";
                }
            );

            info.el.addEventListener(
                "mouseleave",
                () => {

                    tooltip.style.opacity =
                        "0";
                }
            );
        },

        /* =========================
           CLICK EVENTO
        ========================= */

        eventClick: function (info) {

            const reservation =
                info.event;

            const currentUserId =
                localStorage.getItem("userId");

            const currentRole =
                localStorage.getItem("userRole");

            const ownerId =
                reservation.extendedProps.userId;

            /* =========================
               SI NO ES DUEÑO → SOLO VER
            ========================= */

            if (
                String(currentUserId) !==
                String(ownerId)
                &&
                currentRole !== "admin"
            ) {

                showToast(
                    "info",
                    reservation.extendedProps.room,

                    ` ${reservation.extendedProps.userName}
                    ${reservation.extendedProps.horaInicio} - ${reservation.extendedProps.horaFin}
                        ${reservation.extendedProps.motivo || "Sin motivo"}`
                );

                return;
            }

            /* =========================
               EDITAR RESERVA
            ========================= */

            editingReservationId =
                reservation.id;

            reservationModal
                .classList
                .add("active");

            const modalTitle =
                document.querySelector(
                    ".modal-header h2"
                );

            modalTitle.innerText =
                "Editar Reserva";

            const submitBtn =
                document.querySelector(
                    ".submit-btn"
                );

            submitBtn.innerText =
                "Actualizar Reserva";

            deleteReservationBtn.style.display =
                "block";

            document.getElementById("room").value =
                reservation.extendedProps.room;

            document.getElementById("date").value =
                reservation.startStr.split("T")[0];

            document.getElementById("start_time").value =
                reservation.extendedProps.horaInicio;

            document.getElementById("end_time").value =
                reservation.extendedProps.horaFin;

            document.getElementById("motivo").value =
                reservation.extendedProps.motivo || "";
        },

        /* =========================
           CLICK EN DIA VACÍO
        ========================= */

        dateClick: function (info) {

            // Solo permitir fechas de hoy en adelante
            const fechaActual = new Date();

            const hoy =
                `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, "0")
                }-${String(fechaActual.getDate()).padStart(2, "0")
                }`;

            if (info.dateStr < hoy) {

                showToast(
                    "warning",
                    "Fecha inválida",
                    "No puedes reservar días anteriores"
                );

                return;
            }

            // Limpiar modo edición
            editingReservationId = null;


            // Limpiar formulario
            reservationForm.reset();


            // Cambiar título del modal
            document.querySelector(
                ".modal-header h2"
            ).innerText =
                "Nueva Reserva";


            // Cambiar botón guardar
            document.querySelector(
                ".submit-btn"
            ).innerText =
                "Crear Reserva";


            // Ocultar botón eliminar
            if (deleteReservationBtn) {

                deleteReservationBtn.style.display =
                    "none";

            }


            // Colocar fecha seleccionada
            document.getElementById(
                "date"
            ).value =
                info.dateStr;


            // Abrir modal
            reservationModal.classList.add(
                "active"
            );


            showToast(
                "info",
                "Nueva Reserva",
                "Selecciona la hora y sala"
            );

        }
    });
    /* =========================
   NUEVA RESERVA
========================= */

    if (openModalBtn) {

        openModalBtn.addEventListener("click", () => {

            // Salir del modo edición
            editingReservationId = null;

            // Limpiar formulario
            reservationForm.reset();

            // Restaurar título
            document.querySelector(".modal-header h2").innerText =
                "Nueva Reserva";

            // Restaurar botón
            document.querySelector(".submit-btn").innerText =
                "Crear Reserva";

            // Ocultar botón eliminar
            deleteReservationBtn.style.display = "none";

            // Limpiar fecha
            document.getElementById("date").value = "";

            // Abrir modal
            reservationModal.classList.add("active");

        });

    }

    calendar.render();

    /* =========================
       FILTRO SALAS
    ========================= */

    const roomFilter =
        document.getElementById(
            "roomFilter"
        );

    if (roomFilter) {

        roomFilter.addEventListener(
            "change",
            () => {

                currentRoomFilter =
                    roomFilter.value;

                calendar.refetchEvents();
            }
        );
    }

    /* =========================
       CAMBIO DE VISTA
    ========================= */

    const calendarView =
        document.getElementById(
            "calendarView"
        );

    if (calendarView) {

        calendarView.addEventListener(
            "change",
            () => {

                calendar.changeView(
                    calendarView.value
                );
            }
        );
    }

    /* =========================
       ELIMINAR RESERVA
    ========================= */

    if (deleteReservationBtn) {

        deleteReservationBtn
            .addEventListener(
                "click",
                async () => {

                    if (!editingReservationId) {

                        showToast(
                            "warning",
                            "Reserva",
                            "No hay reserva seleccionada"
                        );

                        return;
                    }

                    const confirmModal =
                        document.getElementById(
                            "confirmModal"
                        );

                    const confirmDeleteBtn =
                        document.getElementById(
                            "confirmDelete"
                        );

                    const cancelDeleteBtn =
                        document.getElementById(
                            "cancelDelete"
                        );

                    confirmModal
                        .classList
                        .add("active");

                    cancelDeleteBtn.onclick =
                        () => {

                            confirmModal
                                .classList
                                .remove("active");
                        };

                    confirmDeleteBtn.onclick =
                        async () => {

                            confirmModal
                                .classList
                                .remove("active");

                            try {

                                const response =
                                    await fetch(

                                        `/api/reservations/${editingReservationId}`,

                                        {
                                            method: "DELETE"
                                        }
                                    );

                                if (response.ok) {

                                    showToast(
                                        "success",
                                        "Reserva",
                                        "Reserva eliminada"
                                    );

                                    reservationModal
                                        .classList
                                        .remove("active");

                                    reservationForm.reset();

                                    editingReservationId =
                                        null;

                                    calendar.refetchEvents();

                                } else {

                                    showToast(
                                        "error",
                                        "Error",
                                        "No se pudo eliminar"
                                    );
                                }

                            } catch (err) {

                                console.error(err);

                                showToast(
                                    "error",
                                    "Servidor",
                                    "Error interno"
                                );
                            }
                        };
                }
            );
    }

    /* =========================
   GUARDAR RESERVA
========================= */

    let reservationCalendarData = null;

    const googleCalendarBtn =
        document.getElementById("googleCalendarBtn");

    const downloadICSBtn =
        document.getElementById("downloadICSBtn");

    const closeReservationModal =
        document.getElementById("closeReservationModal");

    if (reservationForm) {

        reservationForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                const formData = new FormData(reservationForm);

                const data = Object.fromEntries(formData);

                try {

                    let url = "/api/reservations";
                    let method = "POST";

                    if (editingReservationId) {

                        url = `/api/reservations/${editingReservationId}`;
                        method = "PUT";

                    }

                    const response = await fetch(url, {

                        method,

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)

                    });

                    if (response.ok) {

                        reservationModal.classList.remove("active");

                        reservationForm.reset();

                        editingReservationId = null;

                        calendar.refetchEvents();

                        if (method === "POST") {

                            reservationCalendarData = {

                                room: data.room,
                                date: data.date,
                                start: data.start_time,
                                end: data.end_time,
                                reason: data.motivo || ""

                            };

                            document.getElementById("successRoom").innerText =
                                data.room;

                            document.getElementById("successDate").innerText =
                                data.date;

                            document.getElementById("successTime").innerText =
                                `${data.start_time} - ${data.end_time}`;

                            document.getElementById("successReason").innerText =
                                data.motivo || "Sin motivo";

                            document
                                .getElementById("reservationSuccessModal")
                                .classList.add("active");

                        } else {

                            showToast(
                                "success",
                                "Reserva",
                                "Reserva actualizada correctamente"
                            );

                        }

                    } else {

                        const errorText = await response.text();

                        showToast(
                            "error",
                            "Error",
                            errorText
                        );

                    }

                } catch (err) {

                    console.error(err);

                    showToast(
                        "error",
                        "Servidor",
                        "Error interno"
                    );

                }

            }

        );

    }

    /* =========================
       CERRAR MODAL EXTERIOR
    ========================= */

    window.addEventListener("click", (e) => {

        if (e.target === reservationModal) {

            reservationModal.classList.remove("active");

            editingReservationId = null;

            reservationForm.reset();

            document.querySelector(".modal-header h2").innerText =
                "Nueva Reserva";

            document.querySelector(".submit-btn").innerText =
                "Crear Reserva";

            deleteReservationBtn.style.display = "none";

        }

    });

    /* =========================
       MODAL ÉXITO
    ========================= */

    if (closeReservationModal) {

        closeReservationModal.addEventListener("click", () => {

            document
                .getElementById("reservationSuccessModal")
                .classList.remove("active");

        });

    }

    /* =========================
       GOOGLE CALENDAR
    ========================= */

    if (googleCalendarBtn) {

        googleCalendarBtn.addEventListener("click", () => {

            if (!reservationCalendarData) return;

            const fecha =
                reservationCalendarData.date.replace(/-/g, "");

            const start =
                fecha +
                "T" +
                reservationCalendarData.start.replace(":", "") +
                "00";

            const end =
                fecha +
                "T" +
                reservationCalendarData.end.replace(":", "") +
                "00";

            const title = encodeURIComponent(
                reservationCalendarData.reason || `Reserva - ${reservationCalendarData.room}`
            );
            const details = encodeURIComponent(
                `Sala: ${reservationCalendarData.room}

Motivo: ${reservationCalendarData.reason || "Sin motivo"}

Reserva realizada desde el Sistema de Reservas E2 Energía Eficiente.`
            );
            

        const location = encodeURIComponent(
            "E2 Energía Eficiente"
        );

        const calendarUrl =
            `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;

        window.open(calendarUrl, "_blank");

    });

    }

/* =========================
   DESCARGAR ICS
========================= */

if (downloadICSBtn) {

    downloadICSBtn.addEventListener("click", () => {

        if (!reservationCalendarData) return;

        const formatDate = (date, time) => {

            return date.replace(/-/g, "") +
                "T" +
                time.replace(":", "") +
                "00";

        };

        const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${reservationCalendarData.reason || `Reserva ${reservationCalendarData.room}`}
DESCRIPTION:Sala: ${reservationCalendarData.room}\nMotivo: ${reservationCalendarData.reason || "Sin motivo"}\nCreado desde el Sistema de Reservas E2
LOCATION:E2 Energía Eficiente
DTSTART:${formatDate(reservationCalendarData.date, reservationCalendarData.start)}
DTEND:${formatDate(reservationCalendarData.date, reservationCalendarData.end)}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([ics], {
            type: "text/calendar"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Reserva.ics";

        a.click();

        URL.revokeObjectURL(url);

    });

}

});