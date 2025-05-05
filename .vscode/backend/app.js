// Importaciones
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Configuración inicial
const app = express();
app.use(cors()); // Permite conexiones desde el frontend
app.use(express.json()); // Para leer JSON en las peticiones

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Backend del sistema de monitoreo activo!");
});

// Importa las rutas de estudiantes
const studentsRoutes = require("./routes/students");
app.use("/api/students", studentsRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

// ... (después de app.use(express.json()))
app.use("/api/auth", authRoutes);

// Ejemplo de ruta protegida:
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Ruta protegida", user: req.user });
});
