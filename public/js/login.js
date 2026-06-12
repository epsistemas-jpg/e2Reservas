// public/js/login.js
import TubesCursor from
"https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const goLogin = document.getElementById("goLogin");
/* =========================
   FONDO ANIMADO
========================= */

const canvas = document.getElementById("canvas");

if (canvas) {

    TubesCursor(canvas, {

        tubes: {

            colors: [
                "#c2d500",
                "#9db100",
                "#d4ea1c"
            ],

            lights: {

                intensity: 200,

                colors: [
                    "#c2d500",
                    "#d4ea1c",
                    "#8ea300",
                    "#ffffff"
                ]
            }
        }
    });
}

/* =========================
   LIMPIAR FORMULARIOS
========================= */

function clearForms() {

    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();

}

/* =========================
   CAMBIO DE TABS
========================= */

loginTab.addEventListener("click", () => {

    clearForms();

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.add("active");
    registerForm.classList.remove("active");

});

registerTab.addEventListener("click", () => {

    clearForms();

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.add("active");
    loginForm.classList.remove("active");

});

/* =========================
   LINK VOLVER A LOGIN
========================= */

if (goLogin) {

    goLogin.addEventListener("click", (e) => {

        e.preventDefault();

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginForm.classList.add("active");
        registerForm.classList.remove("active");

        clearForms();

    });

}

/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(
                "userId",
                result.userId
            );

            localStorage.setItem(
                "userName",
                result.userName
            );

            localStorage.setItem(
                "userRole",
                result.userRole
            );

            loginForm.reset();

            window.location.replace(
                "/pages/index.html"
            );

        } else {

            alert(
                "Credenciales incorrectas"
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Error al iniciar sesión"
        );

    }

});

/* =========================
   REGISTRO
========================= */

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);

    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        if (response.ok) {

            registerForm.reset();

            alert(
                "Usuario registrado correctamente"
            );

            // Volver automáticamente al login

            loginTab.classList.add("active");
            registerTab.classList.remove("active");

            loginForm.classList.add("active");
            registerForm.classList.remove("active");

        } else {

            alert(
                "Error al registrar usuario"
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Error del servidor"
        );

    }
    

});