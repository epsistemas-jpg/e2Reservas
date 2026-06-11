let calendar;

let editingReservationId = null;

document.addEventListener("DOMContentLoaded", function () {

  const tooltip =
    document.getElementById("tooltip");

  const calendarEl =
    document.getElementById("calendar");

  const reservationModal =
    document.getElementById("reservationModal");

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

        let res =
          await fetch("/api/reservations");

        let data =
          await res.json();

        console.log("RESERVAS:", data);

        let events =
          data.map(r => {

            let color = "#3a87ad";

            if (r.room === "Bocas de ceniza") {

              color = "#f39c12";

            } else if (r.room === "Rio Magdalena") {

              color = "#27ae60";

            } else if (r.room === "Piso 1109") {

              color = "#2980b9";
            }

            // 🔹 Arreglar fecha PostgreSQL
            const fecha =
              new Date(r.date)
                .toISOString()
                .split("T")[0];

            return {

              id: r.id,

              title:
                `${r.room} - ${r.user_name}`,

              start:
                `${fecha}T${r.start_time}`,

              end:
                `${fecha}T${r.end_time}`,

              backgroundColor: color,

              borderColor: color,

              textColor: "#ffffff",

              classNames: ["custom-event"],

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
                  r.user_name
              }
            };

          });

        successCallback(events);

      } catch (err) {

        console.error(
          "ERROR CALENDARIO:",
          err
        );

        failureCallback(err);
      }
    },

    /* =========================
       PERSONALIZAR EVENTO
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

            <b>
              ${info.event.extendedProps.room}
            </b>

            <br>

            <b>Usuario:</b>
            ${info.event.extendedProps.userName}

            <br>

            <b>Inicio:</b>
            ${info.event.extendedProps.horaInicio}

            <br>

            <b>Fin:</b>
            ${info.event.extendedProps.horaFin}

            <br>

            <b>Motivo:</b>
            ${info.event.extendedProps.motivo || ""}

          `;

          tooltip.style.display =
            "block";

          tooltip.style.left =
            e.pageX + 10 + "px";

          tooltip.style.top =
            e.pageY + 10 + "px";
        }
      );

      info.el.addEventListener(
        "mousemove",
        (e) => {

          tooltip.style.left =
            e.pageX + 10 + "px";

          tooltip.style.top =
            e.pageY + 10 + "px";
        }
      );

      info.el.addEventListener(
        "mouseleave",
        () => {

          tooltip.style.display =
            "none";
        }
      );
    },

    /* =========================
       CLICK EVENTO
    ========================= */

    eventClick: function (info) {

      const reservation =
        info.event;

      // 🔹 Usuario logueado
      const currentUserId =
        localStorage.getItem("userId");

      // 🔹 Dueño de la reserva
      const ownerId =
        reservation.extendedProps.userId;

      // 🔹 Validar dueño
      if (
        String(currentUserId)
        !==
        String(ownerId)
      ) {

        Swal.fire({

          icon: "warning",

          title:
            "Reserva bloqueada",

          text:
            "Solo el creador puede abrir o editar esta reserva"

        });

        return;
      }

      // 🔹 Permitir edición
      editingReservationId =
        reservation.id;

      reservationModal
        .classList
        .add("active");

      document.querySelector(
        ".modal-header h2"
      ).innerText =
        "Editar Reserva";

      document.querySelector(
        ".submit-btn"
      ).innerText =
        "Actualizar Reserva";

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
       CLICK EN FECHA
    ========================= */

    dateClick: function (info) {

      const selectedDate =
        info.dateStr;

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      if (selectedDate < today) {

        Swal.fire({

          icon: "warning",

          title:
            "Fecha inválida",

          text:
            "No puedes reservar en una fecha pasada"

        });

        return;
      }

      editingReservationId = null;

      document.querySelector(
        ".modal-header h2"
      ).innerText =
        "Nueva Reserva";

      document.querySelector(
        ".submit-btn"
      ).innerText =
        "Crear Reserva";

      document.getElementById("reservationForm").reset();

      document.getElementById("date").value =
        selectedDate;

      reservationModal
        .classList
        .add("active");
    }

  });

  calendar.render();

  /* =========================
     TOOLTIP DINÁMICO
  ========================= */

  if (!tooltip) {

    let tooltipDiv =
      document.createElement("div");

    tooltipDiv.id =
      "tooltip";

    tooltipDiv.className =
      "fc-tooltip";

    document.body.appendChild(tooltipDiv);
  }

  /* =========================
     FORMULARIO
  ========================= */

  const reservationForm =
    document.getElementById(
      "reservationForm"
    );

  /* =========================
     GUARDAR RESERVA
  ========================= */

  reservationForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();

      const formData =
        new FormData(reservationForm);

      const data =
        Object.fromEntries(formData);

      try {

        let url =
          "/api/reservations";

        let method =
          "POST";

        if (editingReservationId) {

          url =
            `/api/reservations/${editingReservationId}`;

          method =
            "PUT";
        }

        let response =
          await fetch(url, {

            method: method,

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(data)
          });

        if (response.ok) {

          Swal.fire({

            icon: "success",

            title:
              editingReservationId
                ? "Reserva actualizada"
                : "Reserva creada",

            timer: 1800,

            showConfirmButton: false

          });

          reservationModal
            .classList
            .remove("active");

          reservationForm.reset();

          editingReservationId =
            null;

          calendar.refetchEvents();

          // 🔹 Solo actualizar mis reservas si existe el panel
          if (document.getElementById("listaMisReservas")) {
            mostrarMisReservas();
          }

        } else {

          const errorText =
            await response.text();

          Swal.fire({

            icon: "error",

            title:
              "Error",

            text:
              errorText
          });
        }

      } catch (err) {

        console.error(err);

        Swal.fire({

          icon: "error",

          title:
            "Servidor",

          text:
            "Error interno"
        });
      }
    }
  );

});

/* =========================
   MOSTRAR MIS RESERVAS
========================= */

async function mostrarMisReservas() {

  const res =
    await fetch("/api/myreservations");

  const data =
    await res.json();

  const lista =
    document.getElementById(
      "listaMisReservas"
    );

  if (!lista) return;

  lista.innerHTML = "";

  const ahora =
    new Date();

  data.forEach(r => {

    // 🔹 Fecha fin completa
    const fechaReserva =
      new Date(r.date);

    const hoy =
      new Date();

    fechaReserva.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    // 🔹 Ocultar reservas vencidas
    if (fechaReserva < hoy) {
      return;
    }

    let li =
      document.createElement("li");

    const fecha =
      new Date(r.date);

    const fechaFormateada =
      fecha.toLocaleDateString("es-CO");

    li.innerHTML = `

      <div class="mis-reserva-info">

        <strong>${r.room}</strong>

        <span>
          ${fechaFormateada}
        </span>

        <span>
          ${r.start_time} - ${r.end_time}
        </span>

      </div>

    `;

    // =========================
    // BOTÓN EDITAR
    // =========================

    let btnEditar =
      document.createElement("button");

    btnEditar.textContent =
      "Editar";

    btnEditar.className =
      "btn-editar";

    btnEditar.onclick =
      () => editarReserva(r);

    // =========================
    // BOTÓN ELIMINAR
    // =========================

    let btnEliminar =
      document.createElement("button");

    btnEliminar.textContent =
      "Eliminar";

    btnEliminar.className =
      "btn-eliminar";

    btnEliminar.onclick =
      async () => {

        Swal.fire({

          title:
            "¿Eliminar reserva?",

          text:
            `Se eliminará la reserva de ${r.room}`,

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonColor:
            "#d33",

          cancelButtonColor:
            "#3085d6",

          confirmButtonText:
            "Sí, eliminar",

          cancelButtonText:
            "Cancelar"

        }).then(async (result) => {

          if (result.isConfirmed) {

            let resp =
              await fetch(
                `/api/reservations/${r.id}`,
                {
                  method: "DELETE"
                }
              );

            if (resp.ok) {

              Swal.fire({

                icon:
                  "success",

                title:
                  "Eliminada",

                text:
                  "La reserva fue eliminada",

                timer:
                  2000,

                showConfirmButton:
                  false
              });

              mostrarMisReservas();
              const lista = document.getElementById("listaMisReservas");

              if (!lista) {
                return;
              }

              calendar.refetchEvents();

            } else {

              Swal.fire({

                icon:
                  "error",

                title:
                  "Error",

                text:
                  "No se pudo eliminar la reserva"
              });
            }
          }
        });
      };

    // =========================
    // ACCIONES
    // =========================

    let acciones =
      document.createElement("div");

    acciones.className =
      "mis-reserva-actions";

    acciones.appendChild(btnEditar);

    acciones.appendChild(btnEliminar);

    li.appendChild(acciones);

    lista.appendChild(li);

  });

  document.getElementById(
    "misReservas"
  ).style.display = "block";
}

/* =========================
   EDITAR RESERVA
========================= */

function editarReserva(reserva) {

  editingReservationId =
    reserva.id;

  document.getElementById("room").value =
    reserva.room;

  document.getElementById("date").value =
    new Date(reserva.date)
      .toISOString()
      .split("T")[0];

  document.getElementById("start_time").value =
    reserva.start_time;

  document.getElementById("end_time").value =
    reserva.end_time;

  document.getElementById("motivo").value =
    reserva.motivo || "";

  document.querySelector(
    ".modal-header h2"
  ).innerText =
    "Editar Reserva";

  document.querySelector(
    ".submit-btn"
  ).innerText =
    "Actualizar Reserva";

  document.getElementById(
    "reservationModal"
  ).classList.add("active");
}

/* =========================
   CERRAR MODAL
========================= */

function cerrarFormulario() {

  document.getElementById(
    "reservationModal"
  ).classList.remove("active");
}