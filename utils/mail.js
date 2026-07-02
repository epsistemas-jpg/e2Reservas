const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

async function sendResetEmail(to, name, resetLink) {

    const email = new Brevo.SendSmtpEmail();

    email.sender = {
        name: "Sistema de Reservas",
        email: "epsistemas@e2energiaeficiente.com"
    };

    email.to = [
        {
            email: to,
            name: name
        }
    ];

    email.subject = "Recuperación de contraseña";

    email.htmlContent = `
        <h2>Recuperación de contraseña</h2>

        <p>Hola ${name},</p>

        <p>Haz clic en el siguiente botón para cambiar tu contraseña.</p>

        <p style="margin:30px 0;">
            <a href="${resetLink}"
               style="
                    background:#2563eb;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:6px;
               ">
               Cambiar contraseña
            </a>
        </p>

        <p>Este enlace expirará en 15 minutos.</p>

        <p>Si no solicitaste este cambio, ignora este correo.</p>
    `;

    return apiInstance.sendTransacEmail(email);

}

module.exports = {
    sendResetEmail
};