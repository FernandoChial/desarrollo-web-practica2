const express = require("express");
const cors = require("cors");
const pool = require("./conexionDB"); // tu conexión a PostgreSQL

const app = express();
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));

// ---------- Rutas ----------

// Registro de usuario
app.post("/users/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existe = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existe.rows.length > 0) return res.json({ success: false });

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
      [name, email, password]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Login de usuario
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );
    if (result.rows.length === 0) return res.json({ success: false });

    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Crear tarea
app.post("/tasks", async (req, res) => {
  const { userId, title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, description) VALUES ($1,$2,$3) RETURNING *",
      [userId, title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Listar tareas
app.get("/tasks/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id=$1 ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado de tarea
app.put("/tasks/:id/status", async (req, res) => {
  try {
    const task = await pool.query("SELECT * FROM tasks WHERE id=$1", [req.params.id]);
    if (task.rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });

    let nextStatus = "pending";
    if (task.rows[0].status === "pending") nextStatus = "in_progress";
    else if (task.rows[0].status === "in_progress") nextStatus = "done";

    const result = await pool.query(
      "UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *",
      [nextStatus, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
