import React, { useEffect, useState } from "react";
import { getUserGrades } from "/src/moodleApi.js";

const StudentList = ({ courseId, students, onSelectStudent }) => {
  const [gradesMap, setGradesMap] = useState({});
  const [hasGrades, setHasGrades] = useState(true); // ← Nuevo estado
console.log('courseId changed:', courseId);
console.log('students changed:', students);

  useEffect(() => {
    const fetchGrades = async () => {
      const newGrades = {};
      let algunaNota = false;

      for (const student of students) {
        try {
          const gradeItems = await getUserGrades(courseId, student.id);
          const total = gradeItems.reduce((acc, item) => acc + (item.grade || 0), 0);
          const avg = gradeItems.length > 0 ? total / gradeItems.length : 0;
          newGrades[student.id] = Math.round(avg);

          if (avg > 0) {
            algunaNota = true;
          }
        } catch (error) {
          console.error(`Error al obtener notas de ${student.fullname}:`, error);
          newGrades[student.id] = 0;
        }
      }

      setGradesMap(newGrades);
      setHasGrades(algunaNota); // ← Evaluamos si hubo al menos una nota válida
    };

    if (students.length > 0 && courseId) {
      fetchGrades();
    }
  }, [students, courseId]);

  const studentsWithGrades = students.map((student) => ({
    ...student,
    grade: gradesMap[student.id] ?? null,
  }));

  const calcularProgreso = (student) => {
    const nota = typeof student.grade === "number" ? student.grade : 0;
    const notaNormalizada = Math.min(Math.max(nota, 0), 100);

    const ahora = Date.now();
    const ultimoAcceso = student.lastaccess ? student.lastaccess * 1000 : 0;
    const diasDesdeUltimoAcceso = ultimoAcceso
      ? Math.floor((ahora - ultimoAcceso) / (1000 * 60 * 60 * 24))
      : 30;

    const accesoNormalizado =
      diasDesdeUltimoAcceso >= 30 ? 0 : ((30 - diasDesdeUltimoAcceso) / 30) * 100;

    return Math.round((notaNormalizada* 0.55 + accesoNormalizado * 0.55) );
  };

  if (!students || students.length === 0) {
    return (
      <div className="text-center text-white text-lg py-10 px-4">
        <p className="mb-4">No hay estudiantes disponibles para este curso.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-xl shadow-lg overflow-hidden border border-white/20 backdrop-blur-sm">
      <div className="overflow-x-auto">
        {!hasGrades && (
          <div className="p-4 bg-yellow-100 text-yellow-800 font-medium border-b border-yellow-400">
            ⚠️ Este curso aún no tiene calificaciones asignadas por los docentes.
          </div>
        )}

        <table className="min-w-full divide-y divide-white/20">
          <thead className="bg-white/15">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                Último Acceso
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                Nota
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-black">
            {studentsWithGrades.map((student) => {
              const progreso = calcularProgreso(student);
              const isAtRisk = progreso < 50;
              const nota = typeof student.grade === "number" ? student.grade.toFixed(1) : "N/D";

              return (
                <tr
                  key={student.id}
                  className={`transition duration-200 cursor-pointer ${
                    isAtRisk ? "bg-red-100 hover:bg-red-200" : "hover:bg-white/5"
                  }`}
                  onClick={() => onSelectStudent && onSelectStudent(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium flex items-center gap-2">
                    {student.fullname || "N/A"}
                    {isAtRisk && (
                      <span className="text-red-600 text-xs font-bold">⚠️ En riesgo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                    {student.lastaccess
                      ? new Date(student.lastaccess * 1000).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Nunca ha ingresado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                    <div className="relative w-full bg-gray-600/50 rounded-full h-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          progreso >= 80
                            ? "bg-green-500"
                            : progreso >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${progreso}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                        {`${progreso}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                    {nota}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;