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

<head>

<meta charset="UTF-8">

</head>

<body style="
margin:0;
padding:40px;
background:#edf2f7;
font-family:Segoe UI,Arial,sans-serif;">

<table
width="100%"
cellpadding="0"
cellspacing="0">

<tr>

<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
background:white;
border-radius:18px;
overflow:hidden;
box-shadow:0 12px 35px rgba(0,0,0,.10);
">

<!-- LOGO -->

<tr>

<td
align="center"
style="
padding:45px 30px 25px;
border-bottom:5px solid #c2d500;
">

<img
src="https://e2reservas.e2academy.com.co/images/logo-E2T.png"
width="220"
style="display:block;">

</td>

</tr>

<!-- ICONO -->

<tr>

<td
align="center"
style="padding-top:45px;">

<div
style="
width:90px;
height:90px;
border-radius:50%;
background:#eef8c4;
display:inline-flex;
align-items:center;
justify-content:center;
font-size:42px;
">

🔒

</div>

</td>

</tr>

<!-- TITULO -->

<tr>

<td
align="center"
style="padding:25px 50px 10px;">

<h1 style="
margin:0;
font-size:34px;
color:#1f2937;">

Recuperación de contraseña

</h1>

</td>

</tr>

<tr>

<td
align="center">

<p style="
margin-top:0;
font-size:18px;
color:#64748b;">

Sistema de Reservas de Salas

</p>

</td>

</tr>

<!-- CONTENIDO -->

<tr>

<td
style="
padding:20px 60px 10px;
">

<p style="
font-size:18px;
color:#111827;
">

Hola <strong>${name}</strong>,

</p>

<p style="
font-size:16px;
line-height:1.8;
color:#4b5563;
">

Recibimos una solicitud para cambiar la contraseña de tu cuenta del Sistema de Reservas.

</p>

<p style="
font-size:16px;
line-height:1.8;
color:#4b5563;
">

Para continuar presiona el siguiente botón.

</p>

</td>

</tr>

<!-- BOTON -->

<tr>

<td
align="center"
style="
padding:35px;
">

<a
href="${resetLink}"

style="
background:#c2d500;
padding:18px 40px;
display:inline-block;
border-radius:10px;
color:#1f2937;
font-size:18px;
font-weight:bold;
text-decoration:none;
">

Restablecer contraseña

</a>

</td>

</tr>

<!-- TARJETA -->

<tr>

<td
style="
padding:0 55px 25px;
">

<div style="
background:#f8fafc;
border-left:5px solid #c2d500;
padding:20px;
border-radius:10px;
">

<p style="
margin:0;
font-size:15px;
line-height:1.8;
color:#475569;
">

⏳ Este enlace tendrá una validez de <strong>15 minutos.</strong>

<br><br>

🔐 Solo puede utilizarse una única vez.

</p>

</div>

</td>

</tr>

<!-- LINK -->

<tr>

<td
style="
padding:0 55px;
">

<p style="
font-size:15px;
color:#475569;
">

Si el botón no funciona, copia este enlace:

</p>

<div style="
background:#f1f5f9;
padding:18px;
border-radius:8px;
font-size:13px;
word-break:break-all;
color:#2563eb;
">

${resetLink}

</div>

</td>

</tr>

<!-- MENSAJE -->

<tr>

<td
style="
padding:35px 55px;
">

<p style="
font-size:15px;
line-height:1.8;
color:#6b7280;
">

Si no solicitaste este cambio puedes ignorar este mensaje.

Nadie podrá acceder a tu cuenta sin confirmar esta acción.

</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
align="center"
style="
background:#111827;
padding:35px;
">

<img
src="https://e2reservas.e2academy.com.co/images/logo-E2t.png"
width="130">

<p style="
margin-top:20px;
font-size:18px;
color:white;
font-weight:bold;
">

e2 Energía Eficiente

</p>

<p style="
font-size:15px;
color:#cbd5e1;
">

Sistema de Reservas de Salas

</p>

<hr style="
margin:25px 0;
border:none;
border-top:1px solid rgba(255,255,255,.15);
">

<p style="
font-size:13px;
color:#94a3b8;
line-height:1.8;
">

Este es un correo generado automáticamente.

Por favor no respondas este mensaje.

<br><br>

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