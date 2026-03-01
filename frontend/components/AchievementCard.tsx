import React from 'react';
import { ApiAchievement } from '../services/ctfApi';
import { Users, Shield, Zap, ExternalLink } from 'lucide-react';

interface Props {
  achievement: ApiAchievement;
  onClick?: (achievement: ApiAchievement) => void;
}

const AchievementCard: React.FC<Props> = ({ achievement, onClick }) => {
  const typeIcons = {
    Hackathon: Shield,
    CTF: Shield,
    Coding: Zap,
    Other: Zap,
  };

  const TypeIcon = typeIcons[achievement.type];
  const displayImage = achievement.images && achievement.images.length > 0 
    ? achievement.images[0] 
    : '/demo/placeholder.svg';

  return (
    <div 
      onClick={() => onClick && onClick(achievement)}
      className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      {/* Image Background with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={displayImage} 
          alt={achievement.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
          onError={(e) => {
            e.currentTarget.src = '/demo/placeholder.svg';
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent transition-opacity duration-500" />
        
        {/* Cyber Brackets - Top Corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-cyan-500/50 z-10 transition-all duration-500 group-hover:border-cyan-400 group-hover:w-8 group-hover:h-8" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-cyan-500/50 z-10 transition-all duration-500 group-hover:border-cyan-400 group-hover:w-8 group-hover:h-8" />
        
        {/* Type Badge - Top Left */}
        <div className="absolute top-3 left-12 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded border border-gray-700 z-10 transition-all duration-300 group-hover:bg-gray-900/95 group-hover:border-cyan-500/50">
          <TypeIcon className="w-3 h-3 text-cyan-500 transition-all duration-300 group-hover:scale-110" />
          <span className="text-xs text-cyan-500 font-mono uppercase tracking-wider transition-all duration-300">
            {achievement.type}
          </span>
        </div>

        {/* Result Badge - Top Right */}
        <div className="absolute top-3 right-12 bg-cyan-500/10 backdrop-blur-sm text-cyan-500 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30 z-10 transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:scale-105">
          {achievement.result}
        </div>

        {/* View Details Overlay - Appears on Hover */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center z-20">
          <div className="text-center transform scale-95 group-hover:scale-100 transition-transform duration-500">
            <div className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105">
              <span>View Details</span>
              <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
            <p className="text-gray-300 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">Click to view full gallery</p>
          </div>
        </div>

        {/* Title at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transition-all duration-300 group-hover:pb-5">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 transition-all duration-300 group-hover:text-cyan-400">
            {achievement.title}
          </h3>
          <span className="text-xs text-gray-300 font-mono transition-all duration-300 group-hover:text-cyan-300">{achievement.date}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3 transition-all duration-300 group-hover:bg-gray-900/60">
        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 transition-colors duration-300 group-hover:text-gray-300">
          {achievement.description}
        </p>

        {/* Students */}
        <div className="flex items-start gap-2 pt-3 border-t border-gray-800 transition-all duration-300 group-hover:border-gray-700">
          <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0 transition-all duration-300 group-hover:text-cyan-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-400 line-clamp-1 transition-colors duration-300 group-hover:text-gray-300">
              {achievement.students.join(', ')}
            </p>
          </div>
        </div>

        {/* Image Counter */}
        {achievement.images && achievement.images.length > 1 && (
          <div className="flex items-center justify-end gap-1 text-xs text-cyan-500 font-mono transition-all duration-300 group-hover:text-cyan-400">
            <span>{achievement.images.length} Photos</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
