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

const StudentSnapshot = require("../models/StudentSnapshot");

const getStudentsFromCourseWithCache = async (req, res) => {
  try {
    // 1. Busca en caché (MongoDB)
    const cachedData = await StudentSnapshot.findOne({
      courseId: req.params.courseId,
    });
    if (cachedData) return res.json(cachedData.data);

    // 2. Si no hay caché, consulta Moodle
    const students = await getFromMoodleAPI(req.params.courseId);

    // 3. Guarda en caché
    await StudentSnapshot.create({
      courseId: req.params.courseId,
      data: students,
      updatedAt: new Date(),
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
