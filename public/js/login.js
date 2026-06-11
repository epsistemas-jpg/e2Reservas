// public/js/login.js

const loginTab = document.getElementById("loginTab");

const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");

// CAMBIO TABS

loginTab.addEventListener("click", () => {
  clearForms();

  loginTab.classList.add("active");

  registerTab.classList.remove("active");

  loginForm.classList.add("active");

  registerForm.classList.remove("active");

});

registerTab.addEventListener("click", () => {

  registerTab.classList.add("active");

  loginTab.classList.remove("active");

  registerForm.classList.add("active");

  loginForm.classList.remove("active");

});

// LOGIN

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

      window.location.href =
        "/pages/index.html";

    } else {

      alert(
        "Credenciales incorrectas"
      );
    }

  } catch (err) {

    alert("Error al iniciar sesión");
  }

});

// REGISTER

registerForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = new FormData(registerForm);
  function clearForms() {

    loginForm.reset();

    registerForm.reset();
  }

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

      alert("Usuario registrado correctamente");

      loginTab.click();

    } else {

      alert("Error al registrar usuario");
    }

  } catch (err) {

    alert("Error del servidor");
  }

});
const goLogin =
    document.getElementById(
        "goLogin"
    );

if (goLogin) {

    goLogin.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            loginTab.click();
        }
    );
}