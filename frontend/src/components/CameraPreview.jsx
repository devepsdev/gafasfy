import { Camera, CheckCircle, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CameraPreview = ({ onCapture, onClose, t }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsStreaming(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(t.cameraError);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsStreaming(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        setCapturedPhoto({ blob, url });
      },
      "image/jpeg",
      0.9
    );
  };

  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const retakePhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto.url);
      setCapturedPhoto(null);
    }
    startCamera();
  };

  const usePhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto.blob);
      URL.revokeObjectURL(capturedPhoto.url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {/* Vista previa de video */}
        {!capturedPhoto && (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        )}

        {/* Foto capturada */}
        {capturedPhoto && (
          <img
            src={capturedPhoto.url}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay con guías de cámara */}
        {!capturedPhoto && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-4 border-2 border-white/30 rounded-2xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-medium">
                  Incluye las gafas en la foto
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Botón cambiar cámara */}
        {!capturedPhoto && (
          <button
            onClick={switchCamera}
            className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Controles */}
      <div className="bg-black/80 backdrop-blur-sm p-6">
        {!capturedPhoto ? (
          <div className="flex items-center justify-center space-x-8">
            <div className="w-16 h-16" /> {/* Espaciador */}
            <button
              onClick={capturePhoto}
              disabled={!isStreaming}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 shadow-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </button>
            <div className="w-16 h-16" /> {/* Espaciador */}
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={retakePhoto}
              className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t.retakePhoto}</span>
            </button>
            <button
              onClick={usePhoto}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{t.usePhoto}</span>
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPreview;
