const { getStudents } = require("../services/moodleService");

// Obtiene estudiantes de un curso
const getStudentsFromCourse = async (req, res) => {
  try {
    const students = await getStudents(req.params.courseId);
    res.json(students);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener estudiantes",
      details: error.message,
    });
  }
};

module.exports = { getStudentsFromCourse };
