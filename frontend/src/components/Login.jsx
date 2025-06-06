
import React, { useState } from "react";



const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await onLogin(formData.username, formData.password, setShowErrorModal);
      
      setShowErrorModal(false);
    } catch (error) {
      
      console.error("Error capturado en Login.jsx:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 relative">
     
      <div className="bg-white/70 shadow-xl rounded-3xl p-8 sm:p-10 w-full max-w-sm md:max-w-md transform transition-all duration-500 hover:scale-105 relative overflow-hidden backdrop-blur-md border border-gray-200">

        {/* Contenedor del Icono/Logo */}
        <div className="flex justify-center mb-6 -mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-20 h-20 text-rose-600 animate-bounce-in"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-rose-700 mb-8 tracking-wide">
Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
          <div>
            <label
              htmlFor="username"
              className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              required
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-rose-500 focus:border-transparent transition duration-300 placeholder-gray-400 text-gray-800"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              required
              className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-rose-500 focus:border-transparent transition duration-300 placeholder-gray-400 text-gray-800"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold shadow-md transform hover:scale-105 transition duration-300 ease-in-out text-base sm:text-lg"
          >
            Acceder
          </button>
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
            ¿Olvidaste tu contraseña?{" "}
            <a href="#" className="text-rose-600 hover:underline font-medium">
              Recupérala aquí
            </a>
          </p>
        </form>
      </div>

      {/* MODAL DE ERROR DE PANTALLA COMPLETA */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-sm w-full text-center transform scale-100 transition-transform duration-300 ease-out">
            <div className="mb-4 pt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-16 h-16 text-red-500 mx-auto animate-shake"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-3">¡Error de Acceso!</h3>
            <p className="text-gray-700 text-sm sm:text-base mb-6">
              Usuario o contraseña incorrectos. Por favor, verifica tus credenciales y vuelve a intentarlo.
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 ease-in-out"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;