// test-moodle-api.js
require("dotenv").config();
const axios = require("axios");

const MOODLE_URL =
  process.env.MOODLE_URL ||
  "https://virtuallab.ufps.edu.co/webservice/rest/server.php";
const TOKEN = process.env.MOODLE_TOKEN || "4d2414e263445c41182638a691d84949"; // Usa tu token real
const COURSE_ID = 4; // Cambia al ID de tu curso

async function testMoodleAPI() {
  try {
    console.log("🔍 Probando conexión con Moodle...");
    const response = await axios.get(
      `${MOODLE_URL}?wstoken=${TOKEN}&wsfunction=core_enrol_get_enrolled_users&courseid=${COURSE_ID}&moodlewsrestformat=json`
    );
    console.log(
      "✅ ÉXITO. Datos recibidos:",
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.error("❌ FALLO. Error:", error.response?.data || error.message);
    console.log("🔧 Solución: Verifica que:");
    console.log("1. El token sea válido");
    console.log("2. El courseId exista");
    console.log("3. El servicio esté habilitado en Moodle");
  }
}

testMoodleAPI();

const response = await axios.get(
  `${MOODLE_URL}?wstoken=${TOKEN}&wsfunction=core_enrol_get_enrolled_users&courseid=${courseId}`
);
