import React, { useState } from 'react';
import { ApiAchievement } from '../services/ctfApi';
import { X, ChevronLeft, ChevronRight, Users, Calendar, Award, Shield, Zap } from 'lucide-react';

interface Props {
  achievement: ApiAchievement | null;
  onClose: () => void;
}

const AchievementDetailModal: React.FC<Props> = ({ achievement, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!achievement) return null;

  const images = achievement.images && achievement.images.length > 0 
    ? achievement.images 
    : ['/demo/placeholder.svg'];

  const typeIcons = {
    Hackathon: Shield,
    CTF: Shield,
    Coding: Zap,
    Other: Award,
  };

  const TypeIcon = typeIcons[achievement.type];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl bg-gray-900 border border-gray-800 rounded-2xl overflow-auto max-h-[90vh] z-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-4 md:p-6 flex items-start justify-between transition-all duration-300">
          <div className="flex-1 animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 transition-all duration-300 hover:bg-cyan-500/20 hover:scale-105">
                <TypeIcon className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-500 font-mono uppercase tracking-wider transition-all duration-300">
                  {achievement.type}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-gray-400 font-mono transition-colors duration-300">{achievement.date}</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white transition-all duration-300 hover:text-cyan-400">{achievement.title}</h2>
            <div className="inline-block mt-3 bg-cyan-500/10 text-cyan-500 px-4 py-1.5 rounded-full text-sm font-semibold border border-cyan-500/30 transition-all duration-300 hover:bg-cyan-500/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
              {achievement.result}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-2 transition-all duration-300 rounded-lg hover:bg-gray-800 hover:rotate-90 active:scale-90 animate-in slide-in-from-right duration-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
          {/* Left Column - Photo Gallery */}
          <div className="space-y-4 animate-in slide-in-from-left duration-700">
            {/* Main Image Display */}
            <div className="relative aspect-video bg-gray-950 rounded-xl overflow-hidden border border-gray-800 group transition-all duration-300 hover:border-cyan-500/30">
              {/* Cyber Brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500 opacity-50 z-10 transition-all duration-500 group-hover:opacity-100 group-hover:w-10 group-hover:h-10" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-500 opacity-50 z-10 transition-all duration-500 group-hover:opacity-100 group-hover:w-10 group-hover:h-10" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500 opacity-50 z-10 transition-all duration-500 group-hover:opacity-100 group-hover:w-10 group-hover:h-10" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500 opacity-50 z-10 transition-all duration-500 group-hover:opacity-100 group-hover:w-10 group-hover:h-10" />

              <img 
                key={selectedImageIndex}
                src={images[selectedImageIndex]} 
                alt={`${achievement.title} - Image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500 animate-in fade-in zoom-in-95"
                onError={(e) => {
                  e.currentTarget.src = '/demo/placeholder.svg';
                }}
              />

              {/* Navigation Arrows - Only show if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-800 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 border border-gray-700 hover:border-cyan-500/50 hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-800 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 border border-gray-700 hover:border-cyan-500/50 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono text-gray-300 border border-gray-700 transition-all duration-300 group-hover:bg-gray-900/95 group-hover:border-cyan-500/30">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Row - Only show if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 transform ${
                      selectedImageIndex === index 
                        ? 'border-2 border-cyan-500 ring-2 ring-cyan-500/30 scale-105 shadow-lg shadow-cyan-500/20' 
                        : 'border-2 border-gray-700 hover:border-cyan-500/50 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/demo/placeholder.svg';
                      }}
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-cyan-500/20 animate-in fade-in duration-300" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Mission Brief & Operators */}
          <div className="space-y-6 animate-in slide-in-from-right duration-700">
            {/* Mission Brief */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-cyan-500 rounded-full transition-all duration-300 hover:h-6" />
                <h3 className="text-lg font-bold text-white font-mono transition-colors duration-300 hover:text-cyan-400">MISSION BRIEF</h3>
              </div>
              <p className="text-gray-300 leading-relaxed transition-colors duration-300">
                {achievement.description}
              </p>
            </div>

            {/* Operators (Team Members) */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-cyan-500 rounded-full transition-all duration-300 hover:h-6" />
                <h3 className="text-lg font-bold text-white font-mono transition-colors duration-300 hover:text-cyan-400">OPERATORS</h3>
              </div>
              <div className="space-y-3">
                {achievement.students.map((student, index) => (
                  <div key={index} className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                      <Users className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <p className="text-white font-medium transition-colors duration-300 group-hover:text-cyan-400">{student}</p>
                      <p className="text-xs text-gray-500 font-mono transition-colors duration-300 group-hover:text-gray-400">FIELD AGENT #{String(index + 1).padStart(2, '0')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/60 hover:border-cyan-500/30 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-xs text-gray-500 font-mono uppercase">Date</span>
                </div>
                <p className="text-white font-semibold transition-colors duration-300">{achievement.date}</p>
              </div>
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/60 hover:border-cyan-500/30 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-xs text-gray-500 font-mono uppercase">Result</span>
                </div>
                <p className="text-white font-semibold transition-colors duration-300">{achievement.result}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailModal;
