require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const path = require("path");
const transporter = require("./utils/mail");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3001;

// ---------------------------
// 🔹 Conexión a PostgreSQL
// ---------------------------
const pool = new Pool({

  connectionString:
    process.env.DATABASE_URL

});


// Ejemplo para probar conexión
pool.connect()
  .then(() => console.log("Conectado a PostgreSQL Local 🚀"))
  .catch(err => console.error("Error de conexión:", err));

// ---------------------------
// 🔹 Middlewares
// ---------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: "reservas.sid",
  store: new pgSession({

    pool: pool,

    tableName: "user_sessions",

    createTableIfMissing: true

  }),

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  proxy: true,

  rolling: true,

  cookie: {

    secure: process.env.NODE_ENV === "production",

    httpOnly: true,

    sameSite: "lax",

    maxAge: 1000 * 60 * 60 * 8 // 8 horas

  }

}));
app.use((req, res, next) => {

  const protectedPages = [

    "/pages/index.html",
    "/pages/dashboard.html"

  ];

  if (

    protectedPages.includes(req.path) &&
    !req.session.userId

  ) {

    return res.redirect(
      "/pages/login.html"
    );

  }

  next();

});
/* =========================
   NO CACHE
========================= */

app.use((req, res, next) => {

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );

  res.setHeader(
    "Pragma",
    "no-cache"
  );

  res.setHeader(
    "Expires",
    "0"
  );

  next();
});

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);
/* =========================
   RUTA INICIAL
========================= */

app.get("/", (req, res) => {

  if (req.session.userId) {

    return res.redirect(
      "/pages/index.html"
    );
  }

  res.redirect(
    "/pages/login.html"
  );
});
// ---------------------------
// 🔹 Redirigir raíz al login
// ---------------------------
app.post("/logout", (req, res) => {

  req.session.destroy(() => {

    res.clearCookie("connect.sid");

    res.json({
      success: true
    });

  });

});

// ---------------------------
// 🔹 Middleware de autenticación
// ---------------------------
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.status(401).send("No autenticado");
  next();
}
app.get("/api/check-auth", (req, res) => {

  if (!req.session.userId) {

    return res.status(401).json({
      authenticated: false
    });

  }

  res.json({

    authenticated: true,

    userId: req.session.userId,

    userName: req.session.userName,

    role: req.session.role

  });

});
/* =========================
   PROTEGER PAGINAS
========================= */

app.get(
  "/pages/index.html",
  requireLogin,
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public/pages/index.html"
      )
    );
  }
);

// ---------------------------
// 🔹 Rutas de autenticación
// ---------------------------
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hashed]
  )
    .then(() => res.redirect("/pages/login.html"))
    .catch(err => {
      console.error(err);
      res.status(400).send("Usuario ya existe o error.");
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  pool.query("SELECT * FROM users WHERE email = $1", [email])
    .then(async result => {

      if (result.rows.length === 0) {
        return res.status(400).send("Usuario no encontrado");
      }

      const row = result.rows[0];

      const match = await bcrypt.compare(password, row.password);

      if (!match) {
        return res.status(400).send("Contraseña incorrecta");
      }

      // Regenerar la sesión por seguridad
      req.session.regenerate(err => {

        if (err) {
          console.error(err);
          return res.status(500).send("Error al iniciar sesión");
        }

        // Guardar datos del usuario en la sesión
        req.session.userId = row.id;
        req.session.userName = row.name;
        req.session.role = row.role;

        // Guardar la sesión en PostgreSQL
        req.session.save(err => {

          if (err) {
            console.error(err);
            return res.status(500).send("Error al guardar la sesión");
          }

          res.json({
            success: true,
            userId: row.id,
            userName: row.name,
            userRole: row.role
          });

        });

      });

    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err.message);
    });
});


// ---------------------------
// 🔹 API Reservas
// ---------------------------
app.get("/api/reservations", requireLogin, (req, res) => {

  pool.query(`
  
    SELECT 
      reservations.*,
      users.name AS user_name

    FROM reservations

    JOIN users
    ON reservations.user_id = users.id

    ORDER BY date ASC

  `)

    .then(result => {

      res.json(result.rows);

    })

    .catch(err => {

      console.error(err);

      res.status(500)
        .send(err.message);

    });

});

app.get("/api/myreservations", requireLogin, (req, res) => {

  pool.query(

    `SELECT
        reservations.*,
        users.name AS user_name

     FROM reservations

     JOIN users
     ON reservations.user_id = users.id

     WHERE reservations.user_id = $1

     ORDER BY reservations.date ASC`,

    [req.session.userId]
  )

    .then(result => {

      res.json(result.rows);

    })

    .catch(err => {

      console.error(err);

      res.status(500).send(
        "Error interno del servidor"
      );

    });
});
const moment = require("moment-timezone");
app.post("/api/reservations", requireLogin, (req, res) => {
  const { room, date, start_time, end_time, motivo } = req.body;

  // 🔹 Hora actual en Colombia
  const now = moment.tz("America/Bogota");

  // 🔹 Construir horas de la reserva en zona Colombia
  const startDateTime = moment.tz(`${date} ${start_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");
  const endDateTime = moment.tz(`${date} ${end_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");

  const today = now.clone().startOf("day");
  const selectedDate = moment.tz(date, "YYYY-MM-DD", "America/Bogota");

  // Validaciones
  if (selectedDate.isBefore(today, "day")) {
    return res.status(400).send("No se puede reservar en un día anterior.");
  }

  if (selectedDate.isSame(today, "day") && startDateTime.isSameOrBefore(now)) {
    return res.status(400).send("La hora de inicio ya pasó.");
  }

  if (endDateTime.isSameOrBefore(startDateTime)) {
    return res.status(400).send("La hora de fin debe ser después de la hora de inicio.");
  }
  const duracionHoras =
    endDateTime.diff(
      startDateTime,
      "hours",
      true
    );

  if (duracionHoras > 4) {

    return res.status(400).send(
      "La reserva no puede superar 4 horas."
    );
  }

  // 🔹 Verificar choque de horarios
  pool.query(
    `SELECT * FROM reservations 
   WHERE date = $1 AND room = $2 
   AND NOT (end_time <= $3 OR start_time >= $4)`,
    [date, room, start_time, end_time]
  )
    .then(result => {
      if (result.rows.length > 0) {
        return res.status(400).send("Horario ocupado.");
      }

      pool.query(
        "INSERT INTO reservations (user_id, room, date, start_time, end_time, motivo) VALUES ($1, $2, $3, $4, $5, $6)",
        [req.session.userId, room, date, start_time, end_time, motivo]
      )
        .then(() => res.send("Reserva creada ✅"))
        .catch(err => res.status(500).send(err.message));
    })
    .catch(err => res.status(500).send(err.message));

});

app.put("/api/reservations/:id", requireLogin, (req, res) => {
  const { room, date, start_time, end_time, motivo } = req.body;

  // 🔹 Hora actual en Colombia
  const now = moment.tz("America/Bogota");
  const startDateTime = moment.tz(`${date} ${start_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");
  const endDateTime = moment.tz(`${date} ${end_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");

  const today = now.clone().startOf("day");
  const selectedDate = moment.tz(date, "YYYY-MM-DD", "America/Bogota");

  // Validaciones
  if (selectedDate.isBefore(today, "day")) {
    return res.status(400).send("No se puede reservar en un día anterior.");
  }

  if (selectedDate.isSame(today, "day") && startDateTime.isSameOrBefore(now)) {
    return res.status(400).send("La hora de inicio ya pasó.");
  }

  if (endDateTime.isSameOrBefore(startDateTime)) {
    return res.status(400).send("La hora de fin debe ser después de la hora de inicio.");
  }
  const duracionHoras =
    endDateTime.diff(
      startDateTime,
      "hours",
      true
    );

  if (duracionHoras > 4) {

    return res.status(400).send(
      "La reserva no puede superar 4 horas."
    );
  }

  // 🔹 Validar solapamientos (excluyendo la misma reserva que se edita)
  pool.query(
    `SELECT * FROM reservations 
   WHERE date = $1 AND room = $2 AND id <> $5
   AND NOT (end_time <= $3 OR start_time >= $4)`,
    [date, room, start_time, end_time, req.params.id]
  )
    .then(result => {
      if (result.rows.length > 0) {
        return res.status(400).send("Horario ocupado.");
      }

      pool.query(
        `UPDATE reservations 
       SET room = $1, date = $2, start_time = $3, end_time = $4, motivo = $5 
       WHERE id = $6 AND user_id = $7`,
        [room, date, start_time, end_time, motivo, req.params.id, req.session.userId]
      )
        .then(dbRes => {
          if (dbRes.rowCount === 0) {
            return res.status(403).send("No puedes editar esta reserva.");
          }
          res.send("Reserva actualizada ✅");
        })
        .catch(err => res.status(500).send(err.message));
    })
    .catch(err => res.status(500).send(err.message));

});

app.delete(
  "/api/reservations/:id",
  requireLogin,
  async (req, res) => {

    try {

      // 🔹 ADMIN
      if (
        req.session.role ===
        "admin"
      ) {

        await pool.query(

          "DELETE FROM reservations WHERE id = $1",

          [req.params.id]
        );

      } else {

        // 🔹 USUARIO NORMAL
        await pool.query(

          `DELETE FROM reservations
           WHERE id = $1
           AND user_id = $2`,

          [
            req.params.id,
            req.session.userId
          ]
        );
      }

      res.send(
        "Reserva eliminada"
      );

    } catch (err) {

      console.error(err);

      res.status(500)
        .send(err.message);
    }
  });
process.on("uncaughtException", err => {

  console.error(
    "UNCAUGHT ERROR:",
    err
  );

});

process.on("unhandledRejection", err => {

  console.error(
    "UNHANDLED PROMISE:",
    err
  );

});
/* =========================
   HISTORIAL
========================= */

app.get("/api/history", requireLogin, (req, res) => {

  pool.query(`

        SELECT 
            reservations.*,
            users.name AS user_name

        FROM reservations

        JOIN users
        ON reservations.user_id = users.id

        ORDER BY date ASC

    `)
    .then(result => {

      res.json(result.rows);

    })
    .catch(err => {

      console.error(err);

      res.status(500)
        .send(err.message);
    });
});
app.get("/test-email", async (req, res) => {

    try {

        await transporter.sendMail({

            from: `"Sistema de Reservas" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER,

            subject: "Prueba de correo",

            html: `
                <h2>Correo de prueba</h2>
                <p>Si recibiste este correo significa que Gmail está configurado correctamente.</p>
            `

        });

        res.send("Correo enviado correctamente.");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
