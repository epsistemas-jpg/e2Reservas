/* =========================
VALIDAR SESIÓN
========================= */

(async () => {

    try {

        const res = await fetch("/api/check-auth");

        if (!res.ok) {

            localStorage.clear();

            window.location.replace("/pages/login.html");

            return;

        }

    } catch {

        localStorage.clear();

        window.location.replace("/pages/login.html");

    }

})();


/* =========================
USER INFO
========================= */

const userName =
    localStorage.getItem("userName") || "Usuario";

const userRole =
    localStorage.getItem("userRole") || "Usuario";


/* ROL FORMATEADO */

const roleText =
    userRole === "admin"
        ? "Administrador"
        : "Usuario";


/* =========================
NOMBRES
========================= */

const topbarUserName =
    document.getElementById("topbarUserName");

const sidebarUserName =
    document.getElementById("sidebarUserName");

const settingsUserName =
    document.getElementById("settingsUserName");


if (topbarUserName) {
    topbarUserName.innerText = userName;
}

if (sidebarUserName) {
    sidebarUserName.innerText = userName;
}

if (settingsUserName) {
    settingsUserName.innerText = userName;
}


/* =========================
ROLES
========================= */

const sidebarUserRole =
    document.getElementById("sidebarUserRole");

const topbarUserRole =
    document.getElementById("topbarUserRole");

const settingsUserRole =
    document.getElementById("settingsUserRole");


if (sidebarUserRole) {
    sidebarUserRole.innerText = roleText;
}

if (topbarUserRole) {
    topbarUserRole.innerText = roleText;
}

if (settingsUserRole) {
    settingsUserRole.innerText = roleText;
}


/* =========================
AVATARES
========================= */

const initials =
    userName
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();


const userAvatar =
    document.getElementById("userAvatar");

const sidebarAvatar =
    document.getElementById("sidebarAvatar");

const settingsAvatar =
    document.getElementById("settingsAvatar");


if (userAvatar) {
    userAvatar.innerText = initials;
}

if (sidebarAvatar) {
    sidebarAvatar.innerText = initials;
}

if (settingsAvatar) {
    settingsAvatar.innerText = initials;
}



/* =========================
WELCOME MESSAGE
========================= */

const currentHour =
    new Date().getHours();


let greeting = "Bienvenido";


if (currentHour >= 5 && currentHour < 12) {

    greeting = "Buenos días";

} else if (currentHour >= 12 && currentHour < 18) {

    greeting = "Buenas tardes";

} else {

    greeting = "Buenas noches";

}


const welcomeMessage =
    document.getElementById("welcomeMessage");


if (welcomeMessage) {

    welcomeMessage.innerText =
        `${greeting}, ${userName}`;

}


/* =========================
BLOQUEAR CACHE BACK
========================= */

window.addEventListener(
    "pageshow",
    async function (event) {

        if (event.persisted) {

            const res =
                await fetch("/api/check-auth");


            if (res.status === 401) {

                localStorage.clear();

                window.location.replace(
                    "/pages/login.html"
                );

            }

        }

    }
);