const axios = require("axios");

async function sendResetEmail(to, name, resetLink) {

    try {

        const axios = require("axios");

        async function sendResetEmail(to, name, resetLink) {

            const response = await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: {
                        name: "e2 Reservas",
                        email: "epsistemas@e2energiaeficiente.com"
                    },

                    to: [
                        {
                            email: to,
                            name: name
                        }
                    ],

                    subject: "🔒 Recuperación de contraseña - e2 Reservas",

                    htmlContent: `
<!DOCTYPE html>
<html lang="es">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Recuperar contraseña</title>
</head>

<body style="
margin:0;
padding:40px 0;
background:#edf2f7;
font-family:Arial,Helvetica,sans-serif;">

<table align="center"
width="650"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 15px 40px rgba(0,0,0,.12);">

<!-- CABECERA -->
<tr>

<td
style="
background:linear-gradient(135deg,#c2d500,#9bb600);
padding:45px;
text-align:center;">

<h1 style="
margin:0;
font-size:34px;
color:#1b1b1b;
font-weight:bold;">

e2 Reservas

</h1>

<p style="
margin-top:10px;
font-size:17px;
color:#253000;">

Sistema de Reservas de Salas

</p>

</td>

</tr>

<!-- CONTENIDO -->

<tr>

<td style="padding:45px;">

<h2 style="
margin-top:0;
color:#1f2937;
font-size:28px;">

Hola ${name},

</h2>

<p style="
font-size:16px;
color:#4b5563;
line-height:1.8;">

Recibimos una solicitud para restablecer la contraseña de tu cuenta de
<b>e2 Reservas</b>.

</p>

<p style="
font-size:16px;
color:#4b5563;
line-height:1.8;">

Si realizaste esta solicitud, presiona el siguiente botón para crear una nueva contraseña.

</p>

<div style="
text-align:center;
margin:45px 0;">

<a
href="${resetLink}"

style="
display:inline-block;
background:#c2d500;
color:#1b1b1b;
font-weight:bold;
padding:18px 38px;
font-size:18px;
border-radius:10px;
text-decoration:none;">

🔑 Restablecer contraseña

</a>

</div>

<p style="
font-size:15px;
color:#6b7280;
line-height:1.7;">

Este enlace tendrá una validez de
<b>15 minutos</b>.

</p>

<p style="
font-size:15px;
color:#6b7280;
line-height:1.7;">

Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:

</p>

<div style="
background:#f4f4f4;
padding:15px;
border-radius:8px;
word-break:break-word;
font-size:14px;
color:#374151;">

${resetLink}

</div>

<p style="
margin-top:35px;
font-size:15px;
color:#6b7280;
line-height:1.8;">

Si no solicitaste este cambio puedes ignorar este correo.
Tu contraseña permanecerá sin modificaciones.

</p>

<hr style="
margin:40px 0;
border:none;
border-top:1px solid #e5e7eb;">

<p style="
text-align:center;
font-size:13px;
color:#9ca3af;">

Este correo fue generado automáticamente por el sistema.

<br><br>

Por favor no respondas este mensaje.

</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td style="
background:#111827;
padding:30px;
text-align:center;">

<h3 style="
margin:0;
color:#ffffff;">

e2 Energía Eficiente

</h3>

<p style="
margin-top:10px;
color:#cbd5e1;
font-size:14px;">

Sistema de Reservas de Salas

</p>

<p style="
margin-top:20px;
font-size:12px;
color:#94a3b8;">

© ${new Date().getFullYear()} e2 Energía Eficiente.

Todos los derechos reservados.

</p>

</td>

</tr>

</table>

</body>
</html>
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

        }

        module.exports = {
            sendResetEmail
        };

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