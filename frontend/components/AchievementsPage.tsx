import React, { useState, useMemo, useEffect } from 'react';
import AchievementCard from './AchievementCard';
import AchievementDetailModal from './AchievementDetailModal';
import { getAchievements, ApiAchievement } from '../services/ctfApi';
import { Shield } from 'lucide-react';

type TypeFilter = 'All' | 'Hackathon' | 'CTF' | 'Coding' | 'Other';

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<ApiAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<TypeFilter>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<ApiAchievement | null>(null);

  useEffect(() => {
    getAchievements().then(setAchievements).catch(console.error).finally(() => setLoading(false));
  }, []);

  const types: TypeFilter[] = ['All', 'Hackathon', 'CTF', 'Coding', 'Other'];

  const filteredAchievements = useMemo(() => {
    if (selectedType === 'All') return achievements;
    return achievements.filter((ach) => ach.type === selectedType);
  }, [selectedType, achievements]);

  const handleAchievementClick = (achievement: ApiAchievement) => {
    setSelectedAchievement(achievement);
  };

  const handleCloseModal = () => {
    setSelectedAchievement(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {loading && <div className="text-center text-gray-400 py-10">Loading achievements…</div>}
      {/* Header */}
      <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-bold text-white transition-all duration-500 hover:text-cyan-400">
          Field Victories
        </h1>
        <div className="w-16 h-1 bg-cyan-500 rounded-full transition-all duration-500 hover:w-24"></div>
        <p className="text-gray-400 mt-4 transition-colors duration-300">
          Showcasing our achievements in hackathons, CTF competitions, coding contests, and certifications.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-6 duration-700">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              selectedType === type
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-gray-900/40 text-gray-400 border border-gray-800 hover:border-cyan-500/50 hover:text-white hover:shadow-md hover:shadow-cyan-500/10'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement, index) => (
            <div
              key={achievement._id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
            >
              <AchievementCard 
                achievement={achievement}
                onClick={handleAchievementClick}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 animate-in fade-in duration-500">
            <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500 text-lg transition-all duration-300">
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
