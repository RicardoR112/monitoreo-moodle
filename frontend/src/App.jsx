// App.jsx

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Asegúrate de que la ruta sea correcta
import Dashboard from './components/Dashboard'; // Asegúrate de que la ruta sea correcta
import api from './api'; // Asegúrate de que tu instancia de Axios esté en este path



// --- Componente de Ruta Privada ---
// Este componente verifica si el usuario está autenticado antes de renderizar la ruta.
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Verifica la existencia del token
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// --- Componente Wrapper para Login ---
// Este wrapper maneja la lógica de login y la redirección con useNavigate
const LoginWrapper = () => {
  const navigate = useNavigate(); // Hook para la navegación programática

  const handleLoginSubmit = async (username, password, setShowErrorModal) => {
    try {
      const res = await api.post("/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setShowErrorModal(false); // Asegurarse de ocultar el modal de error
      navigate("/dashboard"); // Redirige al Dashboard
    } catch (error) {
      console.error("Error en el login:", error);
      setShowErrorModal(true); // Mostrar el modal de error
      // No necesitamos un alert aquí, ya que el modal de error lo maneja visualmente
      throw error; // Relanza el error para que el componente Login pueda capturarlo y manejarlo
    }
  };

  // Pasamos handleLoginSubmit al componente Login
  return <Login onLogin={handleLoginSubmit} />;
};

// --- Componente Wrapper para Dashboard ---
// Este wrapper maneja la lógica de logout
const DashboardWrapper = () => {
  const navigate = useNavigate(); // Hook para la navegación programática

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    navigate("/login"); // Redirige de vuelta al Login
  };

  // Pasamos handleLogout al componente Dashboard
  return <Dashboard onLogout={handleLogout} />;
};


function App() {
  // Nota: formData y handleSubmit ya no son necesarios directamente en App.jsx si los wrappers los manejan.
  // Los he movido dentro de LoginWrapper para centralizar la lógica de auth.
  return (
    <Router>
      <Routes>
        {/* Ruta del Login: accesible sin autenticación */}
        <Route path="/login" element={<LoginWrapper />} />

        {/* Ruta del Dashboard: protegida por PrivateRoute */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardWrapper />
            </PrivateRoute>
          }
        />

        {/* Redirigir cualquier otra ruta (como la raíz '/') al login si no está autenticado */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;