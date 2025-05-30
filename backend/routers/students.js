import express from "express";
import axios from "axios";
import { getStudentsFromCourse } from "../controllers/studentsController.js";
import { getStudents as getFromMoodleAPI } from "../services/moodleService.js";
import { getCourses } from "../controllers/studentsController.js";
const router = express.Router();

router.get("/courses", getCourses);

// GET /api/students/:courseId
router.get("/:courseId", getStudentsFromCourse);

// Alertas de deserción (ej: inactividad > 7 días)
router.get("/:courseId/alerts", async (req, res) => {
  try {
    const students = await getFromMoodleAPI(req.params.courseId);
    const inactiveStudents = students.filter((s) => {
      const lastAccessDays =
        (Date.now() - s.lastaccess * 1000) / (1000 * 60 * 60 * 24);
      return lastAccessDays > 7;
    });
    res.json(inactiveStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Progreso académico (ej: calificaciones < 3.0)
router.get("/:courseId/progress", async (req, res) => {
  try {
    const grades = await axios.get(process.env.MOODLE_URL, {
      params: {
        wstoken: process.env.MOODLE_TOKEN,
        wsfunction: "gradereport_user_get_grade_items",
        courseid: req.params.courseId,
        moodlewsrestformat: "json",
      },
    });
    const atRiskStudents = grades.data.filter((g) => g.grade < 3.0);
    res.json(atRiskStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
