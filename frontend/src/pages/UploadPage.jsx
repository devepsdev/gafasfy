import FloatingParticles from "../components/FloatingParticles";
import PhotoUploadForm from "../components/PhotoUploadForm";

const UploadPage = ({ onNavigate, t }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 relative overflow-hidden">
      <FloatingParticles />

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-10">
          <button
            onClick={() => onNavigate("home")}
            className="mb-6 text-blue-600 hover:text-blue-800 font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center mx-auto group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">
              ←
            </span>
            <span className="ml-2">{t.backHome}</span>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {t.addDetails}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto" />
        </header>

        <div className="max-w-3xl mx-auto">
          <PhotoUploadForm t={t} onSuccess={() => onNavigate("home")} />
        </div>
        <footer className="mt-16 pt-8 pb-6 border-t border-gray-200/30">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                <a href="https://deveps.ddns.net">deveps</a>
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UploadPage;
