import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";

// Hook para detectar el idioma del navegador
const useLanguage = () => {
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    setLanguage(browserLang === "en" ? "en" : "es");
  }, []);

  return language;
};

// Textos en diferentes idiomas
const translations = {
  es: {
    title: "🤓 Gafas Viajeras del Mundo",
    subtitle: "¡Ayuda a estas gafas a recorrer el mundo!",
    description:
      "¿Has encontrado estas gafas? ¡Genial! Tu misión es llevarlas contigo a un lugar especial, hacer una foto donde aparezcan las gafas, y luego dejarlas en un sitio concurrido para que otra persona las encuentre.",
    instructions: [
      "Llévate las gafas a cualquier lugar que te guste",
      "Haz una foto donde aparezcan las gafas",
      "Comparte tu aventura con nosotros",
      "Déjalas en un lugar concurrido para el siguiente aventurero",
    ],
    takePhoto: "Hacer Foto",
    addDetails: "Añadir Detalles",
    yourName: "Tu nombre (opcional)",
    comment: "Cuéntanos sobre este lugar...",
    submit: "Enviar Aventura",
    recentAdventures: "Aventuras Recientes",
    unknownLocation: "Ubicación desconocida",
    anonymous: "Aventurero Anónimo",
    photoUploaded: "¡Foto subida con éxito!",
    uploadError: "Error al subir la foto",
    locationError: "No se pudo obtener la ubicación",
    cameraError: "Error al acceder a la cámara",
    fillForm: "¡Ahora completa los detalles!",
    uploading: "Subiendo...",
    openCamera: "Abrir Cámara",
    capturePhoto: "Capturar Foto",
    retakePhoto: "Tomar Otra",
    usePhoto: "Usar Esta Foto",
    switchCamera: "Cambiar Cámara",
    fromGallery: "O subir desde galería",
    backHome: "← Volver al inicio",
    changePhoto: "Cambiar Foto",
  },
  en: {
    title: "🤓 Traveling Glasses",
    subtitle: "Help these glasses travel the world!",
    description:
      "Did you find these glasses? Great! Your mission is to take them with you to a special place, take a photo where the glasses appear, and then leave them in a crowded place for someone else to find.",
    instructions: [
      "Take the glasses anywhere you like",
      "Take a photo where the glasses appear",
      "Share your adventure with us",
      "Leave them in a crowded place for the next adventurer",
    ],
    takePhoto: "Take Photo",
    addDetails: "Add Details",
    yourName: "Your name (optional)",
    comment: "Tell us about this place...",
    submit: "Submit Adventure",
    recentAdventures: "Recent Adventures",
    unknownLocation: "Unknown location",
    anonymous: "Anonymous Adventurer",
    photoUploaded: "Photo uploaded successfully!",
    uploadError: "Error uploading photo",
    locationError: "Could not get location",
    cameraError: "Error accessing camera",
    fillForm: "Now complete the details!",
    uploading: "Uploading...",
    openCamera: "Open Camera",
    capturePhoto: "Capture Photo",
    retakePhoto: "Retake",
    usePhoto: "Use This Photo",
    switchCamera: "Switch Camera",
    fromGallery: "Or upload from gallery",
    backHome: "← Back to home",
    changePhoto: "Change Photo",
  },
};

// Componente principal
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {currentPage === "home" && <HomePage onNavigate={setCurrentPage} t={t} />}
      {currentPage === "upload" && (
        <UploadPage onNavigate={setCurrentPage} t={t} />
      )}
    </div>
  );
};

export default App;
