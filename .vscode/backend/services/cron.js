const cron = require("node-cron");
const Alert = require("../models/Alert");
const { getFromMoodleAPI } = require("./moodleService");

cron.schedule("0 8 * * *", async () => {
  // Ejecuta a las 8 AM diario
  const courses = await getCoursesFromMoodle(); // Implementa esta función
  courses.forEach(async (course) => {
    const students = await getFromMoodleAPI(course.id);
    students.forEach(async (student) => {
      if (Date.now() - student.lastaccess > 7 * 24 * 60 * 60 * 1000) {
        await Alert.create({
          studentId: student.id,
          courseId: course.id,
          reason: "inactividad",
        });
      }
    });
  });
});
