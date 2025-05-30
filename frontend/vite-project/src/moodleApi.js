// src/api/moodleApi.js

const MOODLE_URL = "https://virtuallab.ufps.edu.co/webservice/rest/server.php";
const TOKEN = "4d2414e263445c41182638a691d84949"; // reemplaza por el tuyo

export const getUserGrades = async (courseId, userId) => {
  const params = new URLSearchParams({
    wstoken: TOKEN,
    wsfunction: "gradereport_user_get_grade_items",
    moodlewsrestformat: "json",
    courseid: courseId,
    userid: userId,
  });

  const url = `${MOODLE_URL}?${params.toString()}`;
  console.log("📡 Llamando a Moodle API:", url);

  const response = await fetch(url);
  const data = await response.json();

  console.log("📥 Respuesta completa de Moodle:", data);

  return data.usergrades?.[0]?.gradeitems || [];
};


