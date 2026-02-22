import { Heart, MapPin } from "lucide-react";

const PhotoCard = ({ photo, t, index }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={`https://deveps.ddns.net/photos/${photo.url}`}
          alt={photo.comment || "Adventure photo"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTA4LjI4NCA3MCA3NSA4My43MTU3IDc1IDkyVjEyOEM3NSAxMzYuMjg0IDgzLjcxNTcgMTQ1IDkyIDE0NUgxMDhDMTE2LjI4NCAxNDUgMTI1IDEzNi4yODQgMTI1IDEyOFY5MkMxMjUgODMuNzE1NyAxMTYuMjg0IDc1IDEwOCA3NUgxMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">
            {photo.name || t.anonymous}
          </h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {photo.comment || "Sin comentarios"}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
            <MapPin className="w-3 h-3 mr-1" />
            {photo.lat && photo.len
              ? `${photo.lat.toFixed(2)}, ${photo.len.toFixed(2)}`
              : t.unknownLocation}
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3 text-red-400" />
            <span>{Math.floor(Math.random() * 20) + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
