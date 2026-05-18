import { useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  Droplets, 
  RefreshCw, 
  CloudRain,
  Music,
  Wind
} from 'lucide-react';

// --- Types ---

interface Plant {
  id: number;
  type: 'succulent' | 'fern' | 'mushroom';
  x: number;
  scale: number;
  rotation: number;
  color: string;
  leafCount: number;
  height: number;
}

interface Track {
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    title: "Solar Drift",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Eco Logic",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Ambient Garden",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

// --- Helpers ---

const getRandomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const generatePlants = (count: number): Plant[] => {
  const types: ('succulent' | 'fern' | 'mushroom')[] = ['succulent', 'fern', 'mushroom'];
  const colors = [
    '#6b8e23', '#8fbc8f', '#556b2f', // Greens
    '#cd5c5c', '#d2691e', '#f4a460', // Terracotta / Earth
    '#e9967a', '#deb887', '#bc8f8f'  // Soft tones
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: Math.random(),
    type: types[Math.floor(Math.random() * types.length)],
    x: getRandomRange(100, 400),
    scale: getRandomRange(0.6, 1.2),
    rotation: getRandomRange(-10, 10),
    color: colors[Math.floor(Math.random() * colors.length)],
    leafCount: Math.floor(getRandomRange(4, 12)),
    height: getRandomRange(20, 60),
  })).sort((a, b) => a.id - b.id);
};

// --- Components ---

const Fireflies = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full blur-[1px]"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            opacity: 0 
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.6, 0.4, 0.8, 0],
          }}
          transition={{
            duration: getRandomRange(10, 20),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [growth, setGrowth] = useState(1);
  const [isRaining, setIsRaining] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [bgGradient, setBgGradient] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize environment and plants
  useEffect(() => {
    setPlants(generatePlants(8));
    
    // Set time-based gradient
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) setBgGradient('from-orange-200 via-rose-300 to-indigo-400'); // Sunrise
    else if (hour >= 8 && hour < 17) setBgGradient('from-sky-300 via-blue-200 to-blue-400'); // Midday
    else if (hour >= 17 && hour < 20) setBgGradient('from-orange-400 via-red-300 to-indigo-900'); // Sunset
    else setBgGradient('from-slate-900 via-indigo-950 to-black'); // Night
  }, []);

  const handleWater = () => {
    if (isRaining) return;
    setIsRaining(true);
    setTimeout(() => {
      setIsRaining(false);
      setGrowth(prev => Math.min(prev + 0.05, 1.5));
    }, 3000);
  };

  const handleRefresh = () => {
    setPlants(generatePlants(8));
    setGrowth(1);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-4 transition-colors duration-[2000ms] relative overflow-hidden font-sans text-slate-800`}>
      
      {/* Ambient Effects */}
      <Fireflies />
      
      {/* Rain Effect */}
      <AnimatePresence>
        {isRaining && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-8 bg-blue-200/40"
                initial={{ top: -100, x: `${Math.random() * 100}%` }}
                animate={{ top: '120%' }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: Math.random() * 1,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Terrarium Display */}
      <div className="relative group perspective-1000">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20"
        >
          {/* Glass Jar Glow */}
          <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-125 -z-10" />
          
          <svg width="500" height="600" viewBox="0 0 500 600" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
              <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3d2b1f" />
                <stop offset="100%" stopColor="#1a120d" />
              </linearGradient>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>

            {/* Jar Base Shape (Geometric Vase) */}
            <path 
              d="M100,500 L400,500 L450,400 L450,150 Q450,100 400,80 L100,80 Q50,100 50,150 L50,400 Z" 
              fill="url(#glassGradient)" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth="2"
            />
            
            {/* Top Lip */}
            <ellipse cx="250" cy="80" rx="150" ry="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" />

            {/* Ground Layers */}
            <g clipPath="url(#jarClip)">
              <defs>
                <clipPath id="jarClip">
                  <path d="M100,500 L400,500 L450,400 L450,150 Q450,100 400,80 L100,80 Q50,100 50,150 L50,400 Z" />
                </clipPath>
              </defs>
              
              {/* Soil */}
              <rect x="50" y="420" width="400" height="80" fill="url(#soilGradient)" />
              
              {/* Pebbles */}
              {Array.from({ length: 40 }).map((_, i) => (
                <circle 
                  key={i} 
                  cx={getRandomRange(70, 430)} 
                  cy={getRandomRange(430, 490)} 
                  r={getRandomRange(2, 6)} 
                  fill={['#555', '#777', '#333'][Math.floor(Math.random() * 3)]}
                  opacity="0.6"
                />
              ))}

              {/* Moss Patches */}
              {Array.from({ length: 6 }).map((_, i) => (
                <path
                  key={i}
                  d={`M${getRandomRange(80, 380)},425 Q${getRandomRange(100, 400)},410 ${getRandomRange(120, 420)},425`}
                  fill="#4a5d23"
                  stroke="#3a4d13"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ))}

              {/* Procedural Plants */}
              {plants.map((plant) => (
                <motion.g 
                  key={plant.id}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: plant.scale * growth,
                    y: 425 // Ground level
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="origin-bottom"
                >
                  {plant.type === 'succulent' && (
                    <g transform={`translate(${plant.x}, 0) rotate(${plant.rotation})`}>
                      {Array.from({ length: plant.leafCount }).map((_, li) => (
                        <motion.ellipse
                          key={li}
                          rx={10}
                          ry={20}
                          fill={plant.color}
                          stroke="rgba(0,0,0,0.1)"
                          transform={`rotate(${li * (360 / plant.leafCount)}) translateY(-15)`}
                          animate={{ rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
                        />
                      ))}
                      <circle r="8" fill={plant.color} className="brightness-75" />
                    </g>
                  )}

                  {plant.type === 'fern' && (
                    <g transform={`translate(${plant.x}, 0) rotate(${plant.rotation})`}>
                      <motion.path
                        d={`M0,0 Q10,-${plant.height} 0,-${plant.height * 1.5}`}
                        fill="none"
                        stroke={plant.color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        animate={{ d: [
                          `M0,0 Q10,-${plant.height} 0,-${plant.height * 1.5}`,
                          `M0,0 Q20,-${plant.height} 10,-${plant.height * 1.5}`,
                          `M0,0 Q10,-${plant.height} 0,-${plant.height * 1.5}`
                        ]}}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {Array.from({ length: 6 }).map((_, fi) => (
                        <motion.path
                          key={fi}
                          d="M0,0 Q15,-10 25,-5"
                          fill="none"
                          stroke={plant.color}
                          strokeWidth="2"
                          transform={`translate(0, -${fi * 15})`}
                          animate={{ skewY: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, delay: fi * 0.1 }}
                        />
                      ))}
                    </g>
                  )}

                  {plant.type === 'mushroom' && (
                    <g transform={`translate(${plant.x}, 0) rotate(${plant.rotation})`}>
                      <rect x="-4" y="-20" width="8" height="20" rx="4" fill="#eee" />
                      <path 
                        d="M-15,-20 Q0,-45 15,-20 Z" 
                        fill={plant.color} 
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <circle cx="-5" cy="-30" r="2" fill="white" opacity="0.6" />
                      <circle cx="4" cy="-25" r="1.5" fill="white" opacity="0.6" />
                    </g>
                  )}
                </motion.g>
              ))}
            </g>

            {/* Glass Reflections */}
            <path d="M120,100 Q100,150 100,300" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" strokeLinecap="round" filter="url(#blur)" />
            <path d="M380,120 Q400,150 400,250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeLinecap="round" filter="url(#blur)" />
          </svg>
        </motion.div>

        {/* Action Buttons */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <ControlButton 
            icon={<Droplets size={20} />} 
            label="Water" 
            onClick={handleWater} 
            active={isRaining}
            tooltip="Care for your garden"
          />
          <ControlButton 
            icon={<RefreshCw size={20} />} 
            label="Reshape" 
            onClick={handleRefresh}
            tooltip="New procedural layout"
          />
          <div className="h-20 w-px bg-white/20 mx-auto my-2" />
          <div className="flex flex-col items-center text-white/50 text-xs font-medium uppercase tracking-widest vertical-text select-none">
            Digital Terrarium
          </div>
        </div>
      </div>

      {/* Lo-Fi Lounge Player */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl relative z-30 overflow-hidden"
      >
        {/* Background Visualizer Animation */}
        <div className="absolute inset-x-0 bottom-0 h-1 flex items-end justify-between px-2 gap-1 opacity-40">
          {isPlaying && Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white rounded-t-full"
              animate={{ height: [4, getRandomRange(10, 40), 4] }}
              transition={{ duration: getRandomRange(0.5, 1.2), repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>

        <div className="flex items-center gap-6 relative">
          {/* Vinyl/Art */}
          <div className="relative group">
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-4 border-white/20 bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden shadow-lg"
            >
              <Music className="text-white/40" size={32} />
              <div className="absolute w-4 h-4 bg-white/20 rounded-full border border-black/20" />
            </motion.div>
            {isPlaying && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 rounded-full -z-10"
              />
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1">
            <h3 className="text-white font-medium text-lg tracking-tight mb-0.5 truncate">{TRACKS[currentTrackIndex].title}</h3>
            <p className="text-white/60 text-sm font-light tracking-wide">{TRACKS[currentTrackIndex].artist}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
              </button>
              <button 
                onClick={skipTrack}
                className="text-white/70 hover:text-white transition-colors"
              >
                <SkipForward size={20} />
              </button>
              
              <div className="flex-1" />
              
              <div className="flex items-center gap-2 group/vol relative">
                <Volume2 size={16} className="text-white/50" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-white h-1 rounded-full cursor-pointer opacity-30 group-hover/vol:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>

        <audio 
          ref={audioRef} 
          src={TRACKS[currentTrackIndex].url}
          onEnded={skipTrack}
        />
      </motion.div>

      {/* Footer Quote */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
        className="mt-8 text-white text-[10px] uppercase tracking-[0.3em] font-light text-center"
      >
        Atmosphere: {isRaining ? 'Restorative Rain' : 'Gentle Breeze'} • Growth: {(growth * 100).toFixed(0)}%
      </motion.p>
    </div>
  );
}

function ControlButton({ 
  icon, 
  onClick, 
  active = false, 
  tooltip 
}: { 
  icon: ReactNode; 
  label: string; 
  onClick: () => void; 
  active?: boolean;
  tooltip: string;
}) {
  return (
    <div className="relative group/btn">
      <button 
        onClick={onClick}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden backdrop-blur-md border shadow-lg
          ${active 
            ? 'bg-white/40 border-white/50 text-white scale-110 shadow-white/20' 
            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30'
          }`}
      >
        <span className="relative z-10">{icon}</span>
        {active && (
          <motion.div 
            layoutId="active-bg"
            className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
          />
        )}
      </button>
      <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] tracking-widest rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </span>
    </div>
  );
}
