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

            subject: "Recuperación de contraseña - e2 Reservas",

   htmlContent: `
<!DOCTYPE html>
<html lang="es">

<body style="
margin:0;
padding:0;
background:#eef2f5;
font-family:Arial,Helvetica,sans-serif;">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="padding:40px 15px;">

<tr>

<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 15px 45px rgba(0,0,0,.12);">

<!-- CABECERA -->

<tr>

<td
align="center"
style="
background:linear-gradient(135deg,#c2d500,#9eb800);
padding:45px 20px;">

<img
src="https://e2reservas.e2academy.com.co/images/logo-E2.png"
alt="e2 Energía"
style="
width:220px;
display:block;
margin:auto;
margin-bottom:20px;">

<h1 style="
margin:0;
font-size:34px;
color:#1b1b1b;">

Recuperación de contraseña

</h1>

<p style="
margin-top:12px;
font-size:17px;
color:#334155;">

Sistema de Reservas de Salas

</p>

</td>

</tr>

<!-- CONTENIDO -->

<tr>

<td style="padding:50px;">

<h2 style="
margin-top:0;
font-size:28px;
color:#111827;">

Hola ${name},

</h2>

<p style="
font-size:16px;
line-height:1.8;
color:#4b5563;">

Recibimos una solicitud para restablecer la contraseña de tu cuenta en
<strong>e2 Reservas</strong>.

</p>

<p style="
font-size:16px;
line-height:1.8;
color:#4b5563;">

Si realizaste esta solicitud, presiona el botón de abajo para crear una nueva contraseña.

</p>

<div style="
text-align:center;
margin:45px 0;">

<a
href="${resetLink}"

style="
display:inline-block;
padding:18px 42px;
background:#c2d500;
border-radius:10px;
text-decoration:none;
font-size:18px;
font-weight:bold;
color:#1b1b1b;">

🔒 Restablecer contraseña

</a>

</div>

<div style="
background:#f8fafc;
border-left:5px solid #c2d500;
padding:18px;
border-radius:8px;
margin:35px 0;">

<p style="
margin:0;
font-size:15px;
color:#475569;
line-height:1.7;">

⏳ Este enlace expirará en <strong>15 minutos</strong>.

</p>

</div>

<p style="
font-size:15px;
color:#475569;
line-height:1.8;">

Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:

</p>

<div style="
background:#f3f4f6;
padding:18px;
border-radius:8px;
word-break:break-all;
font-size:13px;
color:#2563eb;">

${resetLink}

</div>

<p style="
margin-top:35px;
font-size:15px;
line-height:1.8;
color:#6b7280;">

Si no solicitaste este cambio, puedes ignorar este mensaje.
Tu contraseña seguirá siendo la misma.

</p>

<hr style="
margin:45px 0;
border:none;
border-top:1px solid #e5e7eb;">

<p style="
font-size:13px;
text-align:center;
color:#94a3b8;">

Este correo fue enviado automáticamente por el Sistema de Reservas.

<br><br>

Por favor no respondas este mensaje.

</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
align="center"
style="
background:#111827;
padding:35px;">

<img
src="https://e2reservas.e2academy.com.co/images/logo-E2.png"
style="
width:140px;
margin-bottom:20px;
filter:brightness(0) invert(1);">

<p style="
margin:0;
font-size:15px;
color:#ffffff;">

<strong>e2 Energía Eficiente</strong>

</p>

<p style="
margin-top:8px;
font-size:14px;
color:#cbd5e1;">

Sistema de Reservas de Salas

</p>

<p style="
margin-top:25px;
font-size:12px;
color:#94a3b8;">

© ${new Date().getFullYear()} e2 Energía Eficiente

</p>

</td>

</tr>

</table>

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