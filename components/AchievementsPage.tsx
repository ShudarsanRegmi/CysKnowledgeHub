import React, { useState, useMemo } from 'react';
import AchievementCard from './AchievementCard';
import AchievementDetailModal from './AchievementDetailModal';
import { ACHIEVEMENTS } from '../achievementsData';
import { Achievement } from '../types';
import { Shield } from 'lucide-react';

type TypeFilter = 'All' | 'Hackathon' | 'CTF' | 'Coding' | 'Other';

const AchievementsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<TypeFilter>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const types: TypeFilter[] = ['All', 'Hackathon', 'CTF', 'Coding', 'Other'];

  const filteredAchievements = useMemo(() => {
    if (selectedType === 'All') {
      return ACHIEVEMENTS;
    }
    return ACHIEVEMENTS.filter((ach) => ach.type === selectedType);
  }, [selectedType]);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  const handleCloseModal = () => {
    setSelectedAchievement(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">
          Field Victories
        </h1>
        <div className="w-16 h-1 bg-cyan-500 rounded-full"></div>
        <p className="text-gray-400 mt-4">
          Showcasing our achievements in hackathons, CTF competitions, coding contests, and certifications.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              selectedType === type
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-900/40 text-gray-400 border border-gray-800 hover:border-cyan-500/50 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              onClick={handleAchievementClick}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No records found in this sector.
            </p>
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      <AchievementDetailModal 
        achievement={selectedAchievement}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AchievementsPage;
