import cron from "node-cron";
import Alert from "../models/Alert.js";
import { getCoursesFromMoodle, getFromMoodleAPI } from "./moodleService.js";

// Ejecutar cada minuto para pruebas
cron.schedule("* * * * *", async () => {
  console.log("Ejecutando tarea de verificación de inactividad...");

  try {
    const courses = await getCoursesFromMoodle();

    for (const course of courses) {
      const students = await getFromMoodleAPI(course.id);

      for (const student of students) {
        const lastAccess = student.lastaccess * 1000; // Convertir a ms
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        if (lastAccess < sevenDaysAgo) {
          await Alert.create({
            studentId: student.id,
            courseId: course.id,
            reason: "inactividad",
            createdAt: new Date(),
          });

          console.log(
            `Alerta registrada: Estudiante ${student.id} inactivo en curso ${course.id}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error al ejecutar el cron:", error.message);
  }
});
