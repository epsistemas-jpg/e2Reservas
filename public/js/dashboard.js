/* =========================
   VALIDAR SESION
========================= */

(async function () {

    try {

        const res =
            await fetch(
                "/api/myreservations"
            );

        if (
            res.status === 401
        ) {

            window.location.replace(
                "/pages/login.html"
            );
        }

    } catch (err) {

        window.location.replace(
            "/pages/login.html"
        );
    }

})();

/* =========================
   USER INFO
========================= */

const userName =
    localStorage.getItem(
        "userName"
    ) || "Usuario";

const userRole =
    localStorage.getItem(
        "userRole"
    ) || "Usuario";

/* ROL FORMATEADO */

const roleText =
    userRole === "admin"
        ? "Administrador"
        : "Usuario";

/* =========================
   NOMBRES
========================= */

document.getElementById(
    "topbarUserName"
).innerText =
    userName;

document.getElementById(
    "sidebarUserName"
).innerText =
    userName;

document.getElementById(
    "settingsUserName"
).innerText =
    userName;

/* =========================
   ROLES
========================= */

document.getElementById(
    "sidebarUserRole"
).innerText =
    roleText;

document.getElementById(
    "topbarUserRole"
).innerText =
    roleText;

document.getElementById(
    "settingsUserRole"
).innerText =
    roleText;

/* =========================
   AVATAR
========================= */

const initials =
    userName
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

document.getElementById(
    "userAvatar"
).innerText =
    initials;

document.getElementById(
    "sidebarAvatar"
).innerText =
    initials;

document.getElementById(
    "settingsAvatar"
).innerText =
    initials;

/* =========================
   DASHBOARD BTN
========================= */

document.getElementById(
    "dashboardMenu"
).addEventListener("click", (e) => {

    e.preventDefault();

    currentView = "all";

    calendar.refetchEvents();
});

/* =========================
   WELCOME MESSAGE
========================= */

const currentHour =
    new Date().getHours();

let greeting =
    "Bienvenido";

if (currentHour >= 5 && currentHour < 12) {

    greeting =
        "Buenos días";

} else if (
    currentHour >= 12 &&
    currentHour < 18
) {

    greeting =
        "Buenas tardes";

} else {

    greeting =
        "Buenas noches";
}

document.getElementById(
    "welcomeMessage"
).innerText =
    `${greeting}, ${userName}`;

/* =========================
   BLOQUEAR CACHE BACK
========================= */

window.addEventListener(
    "pageshow",
    async function (event) {

        if (
            event.persisted
        ) {

            const res =
                await fetch(
                    "/api/myreservations"
                );

            if (
                res.status === 401
            ) {

                window.location.replace(
                    "/pages/login.html"
                );
            }
        }
    }
);