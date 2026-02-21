import React, { useState } from 'react';
import { Achievement } from '../types';
import { Trophy, Users, ExternalLink, Calendar, Shield } from 'lucide-react';

interface Props {
  achievement: Achievement;
  variant?: 'default' | 'podium';
  colSpan?: number;
  rowSpan?: number;
}

const HolographicAchievementCard: React.FC<Props> = ({ 
  achievement, 
  variant = 'default',
  colSpan = 1,
  rowSpan = 1 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    Hackathon: 'text-purple-400',
    Coding: 'text-blue-400',
    Cybersecurity: 'text-cyan-400',
    Other: 'text-green-400',
  };

  const categoryShort = {
    Hackathon: 'HCKS',
    Coding: 'CODE',
    Cybersecurity: 'CBSC',
    Other: 'MISC',
  };

  const isPodium = variant === 'podium';
  const gridClasses = `${colSpan === 2 ? 'md:col-span-2' : ''} ${rowSpan === 2 ? 'md:row-span-2' : ''}`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group ${gridClasses} ${isPodium ? 'w-full' : ''}`}
    >
      {/* Holographic Card */}
      <div
        className={`relative h-full bg-gray-900/40 backdrop-blur-md rounded-2xl overflow-hidden
          border transition-all duration-500 ${
            isHovered 
              ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-[1.02]' 
              : 'border-gray-800'
          } ${isPodium ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : ''}`}
        style={{
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(17,24,39,0.8) 100%)'
            : 'rgba(17, 24, 39, 0.4)'
        }}
      >
        {/* Scanning Line Animation */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan" 
                 style={{ animation: 'scan 2s ease-in-out infinite' }} />
          </div>
        )}

        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
             style={{
               background: 'linear-gradient(135deg, transparent 0%, rgba(6,182,212,0.2) 50%, transparent 100%)',
               backgroundSize: '200% 200%',
               animation: isHovered ? 'gradient-shift 3s ease infinite' : 'none'
             }} />

        {/* Image Section */}
        <div className={`relative ${rowSpan === 2 ? 'h-3/5' : 'h-40'} overflow-hidden`}>
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Top Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/90" />
          
          {/* Rank Badge - Top Right with Medal Shield */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full p-2">
                <Shield className="w-5 h-5 text-gray-900" />
              </div>
            </div>
            <div className="bg-gray-900/90 backdrop-blur-sm text-cyan-400 px-3 py-1 rounded-full font-mono font-bold text-xs border border-cyan-500/30">
              {achievement.rank.toUpperCase()}
            </div>
          </div>

          {/* Category Badge - Top Left */}
          <div className={`absolute top-4 left-4 ${categoryColors[achievement.category]} font-mono text-xs font-bold bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded border border-current/30`}>
            {categoryShort[achievement.category]}
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-5 space-y-3 ${rowSpan === 2 ? 'h-2/5 flex flex-col justify-between' : ''}`}>
          <div className="flex-1">
            {/* Title & Event */}
            <div className="mb-3">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                {achievement.title}
              </h3>
              <p className="text-sm text-gray-400 italic line-clamp-1">{achievement.eventName}</p>
            </div>

            {/* Students */}
            <div className="flex items-start gap-2 mb-3">
              <div className="relative mt-1">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm" />
                <Users className="relative w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-mono">SQUAD</div>
                <div className="text-sm text-gray-300 line-clamp-1">
                  {achievement.students.join(' • ')}
                </div>
              </div>
            </div>

            {/* Description - Only show on larger cards */}
            {rowSpan === 2 && (
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-3">
                {achievement.description}
              </p>
            )}
          </div>

          {/* Tech-Style Metadata Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>[{achievement.date.toUpperCase()}]</span>
              </div>
              <div>
                <span>[CAT: {categoryShort[achievement.category]}]</span>
              </div>
            </div>
            
            <a
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-cyan-500 hover:text-cyan-400 text-xs font-semibold transition-colors group/link"
            >
              <span className="hidden sm:inline">VIEW</span>
              <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default HolographicAchievementCard;
