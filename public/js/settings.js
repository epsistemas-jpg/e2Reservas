/* =========================
   THEME
========================= */

const themeToggle =
document.getElementById(
    "themeToggle"
);

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.innerHTML =
    `<i class="fa-solid fa-sun"></i>`;
}

themeToggle.addEventListener(
    "click",
    ()=>{

        document.body.classList.toggle(
            "dark-mode"
        );

        const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeToggle.innerHTML =
        isDark
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;
    }
);

/* =========================
   SETTINGS MODAL
========================= */

const settingsModal =
document.getElementById(
    "settingsModal"
);

const closeSettingsModal =
document.getElementById(
    "closeSettingsModal"
);

document.getElementById(
    "settingsMenu"
).addEventListener("click",(e)=>{

    e.preventDefault();

    settingsModal
    .classList
    .add("active");

    const userName =
    localStorage.getItem(
        "userName"
    ) || "Usuario";

    document.getElementById(
        "settingsUserName"
    ).innerText =
    userName;

    const initials =
    userName
    .split(" ")
    .map(n=>n[0])
    .join("")
    .substring(0,2)
    .toUpperCase();

    document.getElementById(
        "settingsAvatar"
    ).innerText =
    initials;
});

closeSettingsModal
.addEventListener("click",()=>{

    settingsModal
    .classList
    .remove("active");
});

settingsModal
.addEventListener("click",(e)=>{

    if(e.target === settingsModal){

        settingsModal
        .classList
        .remove("active");
    }
});

/* THEME SETTINGS */

document.getElementById(
    "toggleThemeSettings"
).addEventListener("click",()=>{

    themeToggle.click();
});

/* LOGOUT */

document.getElementById(
    "logoutBtn"
).addEventListener("click",()=>{

    localStorage.clear();

    window.location.href =
    "/pages/login.html";
});