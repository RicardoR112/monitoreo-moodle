const express = require("express");
const { getStudentsFromCourse } = require("../controllers/studentsController");
const router = express.Router();

// GET /api/students/:courseId
router.get("/:courseId", getStudentsFromCourse);

module.exports = router;
