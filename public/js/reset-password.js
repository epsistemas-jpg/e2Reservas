const form = document.getElementById("resetForm");

const token =
    new URLSearchParams(window.location.search)
        .get("token");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password =
        document.getElementById("password").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    if (password !== confirm) {

        alert("Las contraseñas no coinciden");

        return;

    }

    try {

        const response = await fetch("/reset-password", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                token,

                password

            })

        });

        const result =
            await response.json();

        alert(result.message);

        if (result.success) {

            window.location.replace(
                "/pages/login.html"
            );

        }

    } catch (err) {

        console.error(err);

        alert("Error del servidor");

    }

});