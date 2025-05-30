import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import api from "../api";

const Alerts = ({ courseId }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get(`/students/${courseId}/alerts`);
        setAlerts(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAlerts();
  }, [courseId]);

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <h3 className="font-bold text-red-800 flex items-center gap-2">
        <FaExclamationTriangle /> Alertas de Deserción ({alerts.length})
      </h3>
      <ul className="mt-2">
        {alerts.map((alert) => (
          <li key={alert.id} className="text-red-700">
            {alert.fullname} - Inactivo por más de 7 días
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
