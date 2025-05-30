import { getStudents } from "../services/moodleService.js";
import StudentSnapshot from "../models/StudentSnapshot.js";
import { getCourses as fetchCoursesFromMoodle } from "../services/moodleService.js";

// Consulta a Moodle directamente
export const getStudentsFromCourse = async (req, res) => {
  try {
    const students = await getStudents(req.params.courseId);
    res.json(students);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener estudiantes desde Moodle",
      details: error.message,
    });
  }
  
};

// Consulta con caché (MongoDB)
export const getStudentsFromCourseWithCache = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // 1. Verificar caché
    const cachedData = await StudentSnapshot.findOne({ courseId });
    if (cachedData) {
      console.log("Datos desde caché");
      return res.json(cachedData.data);
    }

    // 2. Obtener de Moodle
    const students = await getStudents(courseId);

    // 3. Guardar en caché
    await StudentSnapshot.create({
      courseId,
      data: students,
      updatedAt: new Date(),
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener estudiantes con caché",
      details: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await fetchCoursesFromMoodle();
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "No se pudieron obtener los cursos.",
        details: error.message,
      });
  }
};
