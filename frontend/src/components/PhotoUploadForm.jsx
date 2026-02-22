import { Camera, CheckCircle, MessageSquare, Upload, User } from "lucide-react";
import { useState } from "react";
import CameraPreview from "./CameraPreview";
import FloatingParticles from "./FloatingParticles";

const PhotoUploadForm = ({ t, onSuccess }) => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("photo");
  const [showCamera, setShowCamera] = useState(false);

  const handleCameraCapture = (blob) => {
    setPhoto(blob);
    setPhotoPreview(URL.createObjectURL(blob));
    setShowCamera(false);
    setStep("details");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setStep("details");
    }
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              len: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            resolve({ lat: 0, len: 0 });
          }
        );
      } else {
        resolve({ lat: 0, len: 0 });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) return;

    setLoading(true);

    try {
      const currentLocation = await getLocation();

      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name);
      formData.append("comment", comment);
      formData.append("lat", currentLocation.lat.toString());
      formData.append("len", currentLocation.len.toString());

      const response = await fetch(
        "https://deveps.ddns.net/api/gafasviajeras/photos/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // Animación de éxito
        const successDiv = document.createElement("div");
        successDiv.className =
          "fixed inset-0 bg-green-500/20 backdrop-blur-sm z-50 flex items-center justify-center";
        successDiv.innerHTML = `
          <div class="bg-white rounded-2xl p-8 shadow-2xl animate-bounce">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Éxito!</h3>
              <p class="text-gray-600">${t.photoUploaded}</p>
            </div>
          </div>
        `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
          document.body.removeChild(successDiv);
          onSuccess();
        }, 2000);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(t.uploadError);
    } finally {
      setLoading(false);
    }
  };

  if (showCamera) {
    return (
      <CameraPreview
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
        t={t}
      />
    );
  }

  if (step === "photo") {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
        <FloatingParticles />
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Camera className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.takePhoto}
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Haz clic para abrir la cámara y tomar una foto con las gafas
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setShowCamera(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Camera className="inline w-6 h-6 mr-2" />
              {t.openCamera}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-input"
            />
            <label
              htmlFor="photo-input"
              className="inline-block w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-2xl cursor-pointer hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              <Upload className="inline w-5 h-5 mr-2" />
              {t.fromGallery}
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-6 shadow-inner">
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600 font-medium text-lg">
            <CheckCircle className="w-5 h-5" />
            <span>{t.fillForm}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                {t.yourName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                placeholder="Tu nombre..."
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                {t.comment}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none text-lg"
                placeholder="Cuéntanos sobre tu aventura con las gafas..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep("photo")}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              {t.changePhoto}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.uploading}</span>
                </div>
              ) : (
                t.submit
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoUploadForm;
