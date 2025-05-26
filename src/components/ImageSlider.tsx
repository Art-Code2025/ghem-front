import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Pause, RotateCcw } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  currentIndex?: number;
}

function ImageSlider({ images, currentIndex = 0 }: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buttonLoaded, setButtonLoaded] = useState(false);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && images.length > 1) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
            return 0;
          }
          return prev + 1.5;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  useEffect(() => {
    setTimeout(() => setButtonLoaded(true), 200);
  }, []);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSlider = () => {
    setActiveIndex(0);
    setProgress(0);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[800px] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200/30 via-transparent to-transparent" />
        <p className="text-gray-600 text-2xl font-light tracking-wide">لا توجد صور متاحة</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[800px] overflow-hidden bg-gray-50">
      {/* Images with Smooth Transitions */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-[2000ms] ease-out ${
            index === activeIndex 
              ? 'opacity-100 scale-100 z-10' 
              : index === (activeIndex - 1 + images.length) % images.length
              ? 'opacity-20 scale-105 z-5'
              : 'opacity-0 scale-98 z-0'
          }`}
        >
          <img
            src={image}
            alt={`مجموعة مميزة ${index + 1}`}
            className={`w-full h-full object-cover transition-all duration-[4000ms] ease-out ${
              index === activeIndex ? 'scale-102 filter brightness-105 saturate-110' : 'scale-100'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          
          {/* Elegant Overlay */}
          <div className={`absolute inset-0 transition-all duration-2000 ${
            index === activeIndex 
              ? 'bg-gradient-to-br from-black/20 via-gray-900/10 to-black/30' 
              : 'bg-gradient-to-br from-black/40 via-gray-900/30 to-black/50'
          }`} />
          
          {/* Subtle Floating Elements */}
          {index === activeIndex && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 bg-white/20 rounded-full animate-pulse`}
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${20 + (i % 2) * 50}%`,
                    animationDelay: `${i * 1.2}s`,
                    animationDuration: '3s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Refined CTA Section */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center space-y-12">
          {/* Elegant Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-light text-white leading-relaxed tracking-wider">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                مجموعة
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent font-extralight">
                استثنائية
              </span>
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-24 mx-auto" />
          </div>

          {/* Sophisticated CTA Button */}
          <div className="relative">
            <a
              href="/products"
              className={`group relative inline-flex items-center gap-5 bg-pink-500/90 backdrop-blur-md text-white px-10 py-5 rounded-full border border-pink-400/50 hover:border-pink-300/70 transition-all duration-700 transform ${
                buttonLoaded ? 'translate-x-0 opacity-100' : '-translate-x-[150px] opacity-0'
              } hover:scale-105 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30 text-lg font-light shadow-xl overflow-hidden ease-[cubic-bezier(0.4,0,0.2,1)]`}
            >
              {/* Pink Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 ease-out" />
              
              {/* Floating Animation */}
              <div className="absolute inset-0 bg-pink-400/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 ease-out" />
              
              <span className="relative z-10 text-xl opacity-90">🎓</span>
              <span className="relative z-10 tracking-wide font-light"> استكشف منتجاتنا </span>
              <ChevronLeft className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Minimalist Navigation */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-5 bg-white/15 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 shadow-lg">
          {/* Play/Pause Control */}
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 group"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-white/80 group-hover:text-white transition-colors" />
            ) : (
              <Play className="w-3 h-3 text-white/80 group-hover:text-white transition-colors" />
            )}
          </button>

          {/* Elegant Navigation Dots */}
          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`relative transition-all duration-500 ${
                  index === activeIndex ? 'w-8 h-2' : 'w-2 h-2'
                }`}
              >
                {/* Base Dot */}
                <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? 'bg-gradient-to-r from-amber-300/80 to-yellow-200/80'
                    : 'bg-white/30 hover:bg-white/50'
                }`} />
                
                {/* Progress Indicator */}
                {index === activeIndex && (
                  <div 
                    className="absolute inset-0 bg-white/60 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSlider}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 group"
          >
            <RotateCcw className="w-3 h-3 text-white/80 group-hover:text-white group-hover:rotate-180 transition-all duration-300" />
          </button>
        </div>
      </div>

      {/* Subtle Corner Accents */}
      <div className="absolute top-6 left-6 w-16 h-16 z-20">
        <div className="absolute top-0 left-0 w-4 h-px bg-white/40" />
        <div className="absolute top-0 left-0 w-px h-4 bg-white/40" />
      </div>
      <div className="absolute top-6 right-6 w-16 h-16 z-20">
        <div className="absolute top-0 right-0 w-4 h-px bg-white/40" />
        <div className="absolute top-0 right-0 w-px h-4 bg-white/40" />
      </div>
      <div className="absolute bottom-6 left-6 w-16 h-16 z-20">
        <div className="absolute bottom-0 left-0 w-4 h-px bg-white/40" />
        <div className="absolute bottom-0 left-0 w-px h-4 bg-white/40" />
      </div>
      <div className="absolute bottom-6 right-6 w-16 h-16 z-20">
        <div className="absolute bottom-0 right-0 w-4 h-px bg-white/40" />
        <div className="absolute bottom-0 right-0 w-px h-4 bg-white/40" />
      </div>

      {/* Gentle Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/5 via-transparent to-yellow-100/5 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-white/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-100/3 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

export default ImageSlider;