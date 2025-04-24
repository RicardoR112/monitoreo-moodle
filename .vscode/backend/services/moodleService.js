const axios = require("axios");

// Función para obtener estudiantes de un curso
const getStudents = async (courseId) => {
  try {
    const response = await axios.get(process.env.MOODLE_URL, {
      params: {
        wstoken: process.env.MOODLE_TOKEN,
        wsfunction: "core_enrol_get_enrolled_users",
        courseid: courseId,
        moodlewsrestformat: "json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al llamar a Moodle:", error.message);
    throw error; // Relanzamos el error para manejarlo en el controlador
  }
};

module.exports = { getStudents };
