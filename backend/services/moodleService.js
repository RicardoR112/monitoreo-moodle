import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MOODLE_API_URL = process.env.MOODLE_URL; // Asegúrate que esta sea la correcta
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

// Obtener estudiantes de un curso
export const getStudents = async (courseId) => {
  try {
    const response = await axios.get(MOODLE_API_URL, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_enrol_get_enrolled_users",
        courseid: courseId,
        moodlewsrestformat: "json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al llamar a Moodle (getStudents):", error.message);
    throw error;
  }
};

// Obtener todos los cursos
export const getCourses = async () => {
  try {
    const response = await axios.get(MOODLE_API_URL, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_course_get_courses",
        moodlewsrestformat: "json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos desde Moodle:", error.message);
    throw error;
  }
};
