import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import emailjs from "@emailjs/browser";

const StudentDetail = ({ student, onClose }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (student) {
      setIsPanelOpen(true);
    } else {
      setIsPanelOpen(false);
    }
  }, [student]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMessageModal) return;

      if (panelRef.current && !panelRef.current.contains(event.target)) {
        handleClosePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, showMessageModal]);

  if (!student && !isPanelOpen) {
    return null;
  }

  const getImageDataUrl = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = (error) => {
        console.error(`Error al cargar la imagen: ${url}`, error);
        reject(new Error(`No se pudo cargar la imagen desde ${url}.`));
      };
      img.src = url;
    });
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const doc = new jsPDF();
      const fechaHoy = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const UFPS_LOGO_PATH = "/public/ufps-logo.png";
      const FIRMA_DOCENTE_PATH = "/public/firma-prueba.png";

      const ufpsLogoInfo = await getImageDataUrl(UFPS_LOGO_PATH);
      const firmaDocenteInfo = await getImageDataUrl(FIRMA_DOCENTE_PATH);

      const margin = 20;
      let currentY = margin;

      const logoMaxWidth = 60;
      const logoMaxHeight = 30;

      let logoWidth = ufpsLogoInfo.width;
      let logoHeight = ufpsLogoInfo.height;

      const aspectRatio = logoWidth / logoHeight;
      if (logoWidth > logoMaxWidth) {
        logoWidth = logoMaxWidth;
        logoHeight = logoWidth / aspectRatio;
      }
      if (logoHeight > logoMaxHeight) {
        logoHeight = logoMaxHeight;
        logoWidth = logoHeight * aspectRatio;
      }

      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;

      doc.addImage(
        ufpsLogoInfo.dataUrl,
        "PNG",
        logoX,
        currentY,
        logoWidth,
        logoHeight
      );
      currentY += logoHeight + 8;

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(
        "UNIVERSIDAD FRANCISCO DE PAULA SANTANDER",
        doc.internal.pageSize.getWidth() / 2,
        currentY,
        { align: "center" }
      );
      currentY += 5;
      doc.text(
        "FACULTAD DE INGENIERÍA",
        doc.internal.pageSize.getWidth() / 2,
        currentY,
        { align: "center" }
      );
      currentY += 5;
      doc.text(
        "UNIDAD DE EDUCACIÓN VIRTUAL",
        doc.internal.pageSize.getWidth() / 2,
        currentY,
        { align: "center" }
      );
      currentY += 5;
      doc.text(
        "PROYECTO: MONITOREO DE ESTUDIANTES DE MOODLE",
        doc.internal.pageSize.getWidth() / 2,
        currentY,
        { align: "center" }
      );
      currentY += 12;

      doc.setFontSize(10);
      doc.text(`Fecha del Informe: ${fechaHoy}`, margin, currentY);
      currentY += 18;

      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      doc.text(
        "INFORME DE SEGUIMIENTO DE ESTUDIANTE",
        doc.internal.pageSize.getWidth() / 2,
        currentY,
        { align: "center" }
      );
      currentY += 20;

      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text("Datos del Estudiante:", margin, currentY);
      currentY += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Nombre completo: ${student.fullname || "N/A"}`,
        margin,
        currentY
      );
      currentY += 7;
      doc.text(`ID Moodle: ${student.id}`, margin, currentY);
      currentY += 7;
      doc.text(
        `Correo electrónico: ${student.email || "No disponible"}`,
        margin,
        currentY
      );
      currentY += 7;
      doc.text(
        `Último acceso: ${
          student.lastaccess
            ? new Date(student.lastaccess * 1000).toLocaleString("es-ES")
            : "Sin registro"
        }`,
        margin,
        currentY
      );
      currentY += 7;

      doc.text(
        `Progreso estimado: ${
          student.progress !== undefined
            ? `${student.progress}%`
            : "No disponible"
        }`,
        margin,
        currentY
      );
      currentY += 15;

      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);

      currentY += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      // --- Sección de Observaciones ---
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text("Observaciones y Recomendaciones:", margin, currentY);
      currentY += 8;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const observacion =
        student.progress !== undefined && student.progress < 50
          ? `El estudiante presenta un progreso inferior al 50% (${student.progress}%). Se recomienda un acompañamiento académico más cercano para identificar las causas del bajo rendimiento y ofrecer un plan de apoyo que prevenga el riesgo de deserción.`
          : `El estudiante mantiene un desempeño adecuado (${student.progress}%) hasta la fecha en la plataforma Moodle. Se sugiere mantener el ritmo de estudio y participación activa para asegurar la culminación exitosa del curso.`;

      const splitText = doc.splitTextToSize(
        observacion,
        doc.internal.pageSize.getWidth() - 2 * margin - 5
      ); 
      doc.text(splitText, margin + 5, currentY);
      currentY += splitText.length * 5;
      currentY += 25;

      const firmaMaxWidth = 60;
      const firmaMaxHeight = 25;

      let firmaWidth = firmaDocenteInfo.width;
      let firmaHeight = firmaDocenteInfo.height;

      const firmaAspectRatio = firmaWidth / firmaHeight;
      if (firmaWidth > firmaMaxWidth) {
        firmaWidth = firmaMaxWidth;
        firmaHeight = firmaWidth / firmaAspectRatio;
      }
      if (firmaHeight > firmaMaxHeight) {
        firmaHeight = firmaMaxHeight;
        firmaWidth = firmaHeight * firmaAspectRatio;
      }

      const firmaX = doc.internal.pageSize.getWidth() - margin - firmaWidth;
      const firmaY =
        doc.internal.pageSize.getHeight() - margin - firmaHeight - 25;

      doc.addImage(
        firmaDocenteInfo.dataUrl,
        "PNG",
        firmaX,
        firmaY,
        firmaWidth,
        firmaHeight
      );
      doc.text("_________________________", firmaX, firmaY + firmaHeight + 5);
      doc.text("Firma del Responsable", firmaX, firmaY + firmaHeight + 11);
      doc.text("C.C. XXXXXXXX / Cargo", firmaX, firmaY + firmaHeight + 17);

      doc.save(
        `informe_${student.fullname.replace(/\s/g, "_") || "estudiante"}.pdf`
      );
      alert("Informe generado correctamente.");
    } catch (error) {
      console.error("Error al generar el informe PDF:", error);
      alert(
        `Ocurrió un error al generar el informe: ${error.message}. Por favor, verifica las rutas de las imágenes y la consola.`
      );
    } finally {
      setLoadingReport(false);
    }
  };

  const handleSendMessage = () => {
    if (!student.email) {
      alert("El estudiante no tiene correo disponible.");
      return;
    }
    setShowMessageModal(true);
  };

  const handleSubmitMessage = () => {
    const templateParams = {
      to_name: student.fullname,
      to_email: student.email,
      message: messageText || "Mensaje sin contenido.",
      reply_to: "tu.nombre@ufps.edu.co",
    };

    emailjs
      .send(
        "service_dvksb4x",
        "template_p311cmp",
        templateParams,
        "vzEyQQLrcFRRAYx1o"
      )
      .then(() => {
        alert(`Mensaje enviado a ${student.fullname}`);
        setMessageText("");
        setShowMessageModal(false);
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        alert("No se pudo enviar el mensaje.");
      });
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    const timer = setTimeout(() => {
      onClose();
    }, 300);
    return () => clearTimeout(timer);
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex justify-end transition-opacity duration-300 ${
        isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0" onClick={handleClosePanel}></div>

      <div
        ref={panelRef}
        className={`relative w-full max-w-sm sm:max-w-md bg-white shadow-2xl p-6 overflow-y-auto border-l border-gray-200 z-50 transform transition-transform duration-300 ease-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button
            onClick={handleClosePanel}
            className="text-gray-500 hover:text-red-600 text-sm font-medium"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="text-center mt-4">
          <img
            src={student.profileimageurl}
            alt={student.fullname}
            className="mx-auto w-24 h-24 rounded-full border-4 border-rose-200 shadow-md"
          />
          <h2 className="mt-4 text-xl font-bold text-rose-600">
            {student.fullname}
          </h2>
          <p className="text-sm text-gray-600">ID: {student.id}</p>
        </div>

        <div className="mt-6 space-y-3 text-sm text-gray-800">
          <p>
            <strong>Email:</strong> {student.email || "No disponible"}
          </p>
          <p>
            <strong>Último acceso:</strong>{" "}
            {student.lastaccess
              ? new Date(student.lastaccess * 1000).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Sin registro"}
          </p>

          {student.progress !== undefined && (
            <div className="pt-2">
              <p className="mb-1 font-semibold">Progreso</p>
              <div className="relative w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out 
                    ${
                      student.progress >= 80
                        ? "bg-green-500"
                        : student.progress <= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  style={{ width: `${student.progress}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                  {`${student.progress}%`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleSendMessage}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md 
              transition-all duration-200 ease-in-out 
              transform hover:scale-105 
              focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 focus:outline-none 
              flex items-center justify-center space-x-2 text-base font-semibold`}
          >
            <span className="text-lg">📧</span>
            <span>Enviar Mensaje</span>
          </button>

          <button
            onClick={handleGenerateReport}
            disabled={loadingReport}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-md 
              transition-all duration-200 ease-in-out 
              transform hover:scale-105 
              focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 focus:outline-none 
              flex items-center justify-center space-x-2 text-base font-semibold`}
          >
            {loadingReport ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <span className="text-lg">📊</span>
                <span>Generar Informe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-4">
              <p className="text-lg text-gray-700 mb-1">Enviar mensaje a:</p>
              <h3 className="text-2xl font-bold text-rose-700">
                {student.fullname}
              </h3>
            </div>
        
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className={`px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg 
                            transition-all duration-200 ease-in-out 
                            transform hover:scale-105 
                            focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 focus:outline-none`}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmitMessage}
                className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                            transition-all duration-200 ease-in-out 
                            transform hover:scale-105 
                            focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 focus:outline-none`}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
