import { Camera, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import PhotoCard from "../components/PhotoCard";
import FloatingParticles from "../components/FloatingParticles";

const HomePage = ({ onNavigate, t }) => {
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPhotos();
  }, []);

  const fetchRecentPhotos = async () => {
    try {
      const response = await fetch(
        "https://deveps.ddns.net/api/gafasviajeras/photos"
      );
      if (response.ok) {
        const photos = await response.json();
        setRecentPhotos(photos.slice(-8).reverse());
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header animado */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold p-5 flex items-center justify-center gap-4">
              <span className="text-6xl md:text-8xl animate-bounce">🤓</span>
              <span className="bg-gradient-to-r p-5 from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Gafas Viajeras del Mundo
              </span>
            </h1>
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            {t.subtitle}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
          </div>
        </header>

        {/* Descripción principal con efectos */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-16 max-w-5xl mx-auto border border-white/20">
          <p className="text-xl text-gray-700 mb-10 leading-relaxed text-center">
            {t.description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {t.instructions.map((instruction, index) => (
              <div
                key={index}
                className="group flex items-start space-x-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1 font-medium leading-relaxed">
                  {instruction}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate("upload")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 animate-pulse-slow"
            >
              <Camera className="inline w-7 h-7 mr-3" />
              {t.takePhoto}
            </button>
          </div>
        </section>

        {/* Aventuras recientes mejoradas */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              <Users className="inline w-10 h-10 mr-3" />
              {t.recentAdventures}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto" />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
              {recentPhotos.map((photo, index) => (
                <PhotoCard key={photo.id} photo={photo} t={t} index={index} />
              ))}
              {recentPhotos.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    ¡Sé el primero!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Aún no hay aventuras. ¡Comienza la primera!
                  </p>
                  <button
                    onClick={() => onNavigate("upload")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Empezar Aventura
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
        <footer className="mt-20 pt-12 pb-8 border-t border-gray-200/50">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="mx-4 flex items-center space-x-2 text-gray-600">
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-sm font-medium">Hecho con amor</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            <p className="text-gray-600 font-medium">
              © 2025{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                <a href="https://deveps.ddns.net">deveps</a>
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Conectando aventureros alrededor del mundo
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
