import { useEffect, useState } from "react";
import api from "../services/api";
import StudentList from "./StudentList";

const Dashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/students/2"); // Reemplaza 2 con courseId dinámico
        setStudents(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Monitoreo de Estudiantes</h1>
      <StudentList students={students} />
    </div>
  );
};
