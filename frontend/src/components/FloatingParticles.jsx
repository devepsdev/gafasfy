import { Globe, Heart, Sparkles, Star } from "lucide-react";

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          {i % 4 === 0 ? (
            <Sparkles className="w-4 h-4 text-blue-400" />
          ) : i % 4 === 1 ? (
            <Star className="w-3 h-3 text-purple-400" />
          ) : i % 4 === 2 ? (
            <Globe className="w-4 h-4 text-green-400" />
          ) : (
            <Heart className="w-3 h-3 text-pink-400" />
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;
