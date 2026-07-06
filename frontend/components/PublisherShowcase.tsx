import React from 'react';
import { Publication } from '../types';
import { FilterState } from './PublicationsFilter';

interface Props {
  publications: Publication[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

interface PublisherBrand {
  key: string;
  name: string;
  initials: string;
  color: string;
  bgColor: string;
  textColor: string;
}

const PUBLISHER_BRANDS: Record<string, PublisherBrand> = {
  'IEEE': {
    key: 'IEEE', name: 'IEEE', initials: 'IEEE',
    color: '#00629B', bgColor: 'bg-blue-900/20', textColor: 'text-blue-300',
  },
  'Springer': {
    key: 'Springer', name: 'Springer', initials: 'SP',
    color: '#FF6600', bgColor: 'bg-orange-900/20', textColor: 'text-orange-300',
  },
  'Elsevier': {
    key: 'Elsevier', name: 'Elsevier', initials: 'EL',
    color: '#00838F', bgColor: 'bg-cyan-900/20', textColor: 'text-cyan-300',
  },
  'ACM': {
    key: 'ACM', name: 'ACM', initials: 'ACM',
    color: '#0085CA', bgColor: 'bg-sky-900/20', textColor: 'text-sky-300',
  },
  'IP India': {
    key: 'IP India', name: 'IP India', initials: 'IP',
    color: '#138808', bgColor: 'bg-emerald-900/20', textColor: 'text-emerald-300',
  },
};

function getBrand(publisher: string): PublisherBrand {
  const match = Object.keys(PUBLISHER_BRANDS).find(
    (k) => publisher.toLowerCase().includes(k.toLowerCase())
  );
  if (match) return PUBLISHER_BRANDS[match];

  const initial = publisher.charAt(0).toUpperCase();
  return {
    key: publisher,
    name: publisher,
    initials: initial,
    color: '#6B7280',
    bgColor: 'bg-gray-800',
    textColor: 'text-gray-300',
  };
}

const PublisherShowcase: React.FC<Props> = ({ publications, filters, onFilterChange }) => {
  // Count publications per publisher
  const publisherCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    publications.forEach((p) => {
      counts[p.publisher] = (counts[p.publisher] || 0) + 1;
    });
    return counts;
  }, [publications]);

  // Show only publishers with at least 1 publication, sorted by count desc
  const rankedPublishers = React.useMemo(
    () =>
      Object.entries(publisherCounts)
        .sort(([, a], [, b]) => b - a),
    [publisherCounts]
  );

  if (rankedPublishers.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-500">Top Publishers</span>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-700/50 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-3">
        {rankedPublishers.map(([publisher, count]) => {
          const brand = getBrand(publisher);
          const isActive = filters.publishers.includes(publisher);

          return (
            <button
              key={publisher}
              type="button"
              onClick={() => {
                const next = isActive
                  ? filters.publishers.filter((p) => p !== publisher)
                  : [...filters.publishers, publisher];
                onFilterChange({ ...filters, publishers: next });
              }}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'border-cyan-500/60 bg-cyan-500/10 shadow-sm shadow-cyan-500/10'
                  : 'border-gray-800 hover:border-gray-600 bg-gray-900/40 hover:bg-gray-800/60'
              }`}
            >
              {/* Brand initial logo */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border transition-all duration-200 ${
                  isActive
                    ? `${brand.bgColor} ${brand.textColor} border-current/30`
                    : 'bg-gray-800 text-gray-400 border-gray-700 group-hover:border-gray-600'
                }`}
                style={isActive ? { borderColor: brand.color + '60' } : undefined}
              >
                {brand.initials}
              </div>

              {/* Name + count */}
              <div className="text-left">
                <p className={`text-sm font-semibold leading-tight transition-colors ${
                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {brand.name}
                </p>
                <p className="text-[11px] text-gray-500">
                  {count} publication{count !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PublisherShowcase;
