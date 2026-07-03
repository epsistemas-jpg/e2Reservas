const axios = require("axios");

async function sendResetEmail(to, name, resetLink) {

    try {

        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Sistema de Reservas",
                    email: "epsistemas@energiaeficiente.com"
                },

                to: [
                    {
                        email: to,
                        name: name
                    }
                ],

                subject: "Recuperación de contraseña",

                htmlContent: `
                    <h2>Recuperación de contraseña</h2>

                    <p>Hola ${name},</p>

                    <p>Haz clic en el siguiente botón para cambiar tu contraseña.</p>

                    <p>
                        <a href="${resetLink}"
                           style="
                                background:#c2d500;
                                color:#000;
                                padding:12px 20px;
                                text-decoration:none;
                                border-radius:6px;
                                font-weight:bold;
                           ">
                            Cambiar contraseña
                        </a>
                    </p>

                    <p>Este enlace expirará en 15 minutos.</p>
                `
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("====== BREVO OK ======");
        console.log(response.data);

        return response.data;

    } catch (error) {

        console.log("====== BREVO ERROR ======");

        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        throw error;
    }

}

module.exports = {
    sendResetEmail
};