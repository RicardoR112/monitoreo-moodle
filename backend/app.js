import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./services/db.js";
import studentsRoutes from "./routers/students.js";
import authRoutes from "./routers/auth.js";
import authMiddleware from "./middleware/auth.js";


dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // si estás usando cookies o autenticación
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Backend del sistema de monitoreo activo!");
});

//app.use("/api/students", studentsRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Ruta protegida", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
