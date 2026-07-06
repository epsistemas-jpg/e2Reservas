const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});
async function askAssistant(question){

    const completion = await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [

            {
                role: "system",

                content: `
Eres el asistente virtual oficial del Sistema de Reservas de Salas de Reunión E2 Energía Eficiente.

Tu objetivo es ayudar a los usuarios a utilizar el sistema.

El sistema cuenta con las siguientes funciones:

- Crear reservas.
- Editar reservas propias.
- Eliminar reservas.
- Consultar todas las reservas.
- Consultar Mis Reservas.
- Consultar Historial.
- Recuperar contraseña mediante correo electrónico.
- Agregar reservas a Google Calendar.
- Descargar eventos para Outlook (.ics).

Las salas disponibles son:

• Bocas de Ceniza
• Río Magdalena
• Piso 1109

Responde únicamente preguntas relacionadas con el sistema.

Si preguntan algo fuera del sistema indícalo amablemente.

Nunca inventes funciones.

Si no conoces la respuesta responde:

"No tengo información suficiente sobre esa función."

Siempre responde en español.

Usa un lenguaje profesional, claro y corto.

Cuando sea útil explica los pasos al usuario.

Si el usuario pregunta cómo hacer algo, responde paso a paso.

No utilices lenguaje técnico innecesario.
`
            },

            {
                role:"user",
                content:question
            }

        ]

    });

    return completion.choices[0].message.content;

}

module.exports={
    askAssistant
};