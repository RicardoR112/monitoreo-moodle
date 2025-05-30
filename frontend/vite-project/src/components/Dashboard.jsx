import { useEffect, useState } from "react";
import StudentList from "./StudentList.jsx";
import CursoSelector from "./CursoSelector";
import StudentDetail from "./StudentDetail";

const Dashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectCurso, setSelectCurso] = useState("3");
  const [dataCurso, setDataCurso] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSelectChange = (e) => {
    setSelectCurso(e.target.value);
    console.log("Curso seleccionado:", e.target.value);
    setSelectedStudent(null);
  };

  // Resto de tus useEffects para fetching de datos...
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          onLogout();
          return;
        }
        const res = await fetch(
          `https://virtuallab.ufps.edu.co/webservice/rest/server.php?wstoken=4d2414e263445c41182638a691d84949&wsfunction=core_enrol_get_enrolled_users&courseid=${selectCurso}&moodlewsrestformat=json`
        );
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        } else {
          console.error("Error al cargar estudiantes, respuesta no OK:", res.status);
          setStudents([]);
          setError(`No se pudieron cargar los estudiantes para el curso ${selectCurso}.`);
        }
      } catch (err) {
        console.error("Error al cargar estudiantes (catch):", err);
        setError("Ocurrió un error al cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };
    if (selectCurso) {
      fetchData();
    } else {
      setStudents([]);
      setLoading(false);
    }
  }, [onLogout, selectCurso]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          onLogout();
          return;
        }
        const res = await fetch(
          `https://virtuallab.ufps.edu.co/webservice/rest/server.php?wstoken=4d2414e263445c41182638a691d84949&wsfunction=core_course_get_courses&moodlewsrestformat=json`
        );
        if (res.ok) {
          const data = await res.json();
          const cursos = data.map((item) => ({
            id: item.id,
            name: item.fullname,
          }));
          setDataCurso(cursos);
          if (cursos.length > 0 && !cursos.some(curso => String(curso.id) === selectCurso)) {
            setSelectCurso(String(cursos[0].id));
          } else if (cursos.length === 0) {
            setSelectCurso(null);
          }
        } else {
            console.error("Error al cargar cursos, respuesta no OK:", res.status);
            setError("No se pudieron cargar los cursos.");
        }
      } catch (err) {
        console.error("Error al cargar cursos (catch):", err);
        setError("Ocurrió un error al cargar los cursos.");
      }
    };
    fetchCourses();
  }, []);

  return (
    // El div principal del Dashboard
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Contenedor principal para todo el contenido del Dashboard */}
      {/* Las clases 'pointer-events-none' y 'relative' se aplicarán condicionalmente */}
      <div className={`relative ${selectedStudent ? 'pointer-events-none' : ''}`}>
        {/* El encabezado siempre visible */}
        <header className="flex items-center justify-between my-6 p-4 bg-white/70 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200 z-20">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="currentColor"
              className="w-10 h-10 text-rose-600 mr-3">
              <path strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <h1 className="text-3xl font-extrabold text-rose-700 tracking-wider">
              Monitoreo de Estudiantes
            </h1>
          </div>
          <button
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
            onClick={onLogout}
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Contenido principal del Dashboard */}
        <main className="max-w-screen-xl mx-auto bg-white/70 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 backdrop-blur-md border border-gray-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
              <p className="mt-4 text-xl text-gray-700">Cargando...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg py-10 px-4">
              <p className="mb-4 font-semibold">{error}</p>
              <button
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <CursoSelector
                dataCurso={dataCurso}
                selectCurso={selectCurso}
                onChange={handleSelectChange}
              />
              {selectCurso && (
                <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24"
                      strokeWidth="1.5" stroke="currentColor"
                      className="w-6 h-6">
                      <path strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Curso Seleccionado
                  </h2>
                  <p className="mt-2 text-gray-800">
                    <strong>Nombre:</strong>{" "}
                    {dataCurso.find((c) => c.id === Number(selectCurso))?.name || "N/A"}
                  </p>
                  <p className="text-gray-800">
                    <strong>ID:</strong> {selectCurso}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Activo
                  </span>
                </div>
              )}
              <StudentList
                courseId={selectCurso}
                students={students}
                onSelectStudent={setSelectedStudent}
              />
            </>
          )}
        </main>

        <footer className="mt-10 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Unidad Virtual UFPS. Todos los derechos reservados.
        </footer>
      </div> {/* Cierre del div que envuelve header, main y footer */}

      {/* Overlay global que cubre toda la página (excepto el StudentDetail) */}
      {selectedStudent && ( // Se renderiza solo si hay un estudiante seleccionado
        <div className="fixed inset-0 bg-gray-50/50 z-10"></div> 
      )}

      {/* StudentDetail se renderiza por encima de todo lo demás (z-index mayor) */}
      {selectedStudent && (
        <StudentDetail
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;