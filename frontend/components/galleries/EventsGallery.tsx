import React, { useState } from 'react';
import {
  MapPin, BookOpen, Briefcase, Flag, Users, Star, Sun, Code, Trophy, Music,
  Calendar, Sparkles, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type Category = 'academic' | 'social' | 'sports';

interface EventData {
  id: string;
  title: string;
  month: string;
  shortDate: string;
  location: string;
  category: Category;
  icon: React.ElementType;
  description: string;
  image: string;
}

const EVENTS: EventData[] = [
  {
    id: 'e1', title: 'Freshman Welcome', month: 'SEPT 2024', shortDate: 'Sept 5 - 7, 2024', location: 'Main Auditorium', category: 'academic', icon: BookOpen,
    description: 'Welcome to the academic year! An overview of the curriculum, campus facilities, and a chance to meet the faculty and fellow freshmen.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e2', title: 'Campus Tour', month: 'SEPT 2024', shortDate: 'Sept 10, 2024', location: 'Campus Grounds', category: 'social', icon: MapPin,
    description: 'Guided exploration of tech labs, student centers, and research facilities. Get familiar with your new home.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e3', title: 'Career Fair', month: 'OCT 2024', shortDate: 'Oct 12, 2024', location: 'Tech Hall A', category: 'academic', icon: Briefcase,
    description: 'Connect with industry leading tech companies and promising startups for exciting placements and internship opportunities.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e4', title: 'Homecoming Parade', month: 'OCT 2024', shortDate: 'Oct 25, 2024', location: 'University Avenue', category: 'social', icon: Flag,
    description: 'The spectacular annual homecoming celebration with alumni and current students. Enjoy floats, marching bands, and festivities.',
    image: 'https://images.unsplash.com/photo-1561489396-888724a1543d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e5', title: 'Club Festival', month: 'NOV 2024', shortDate: 'Nov 8, 2024', location: 'Student Union', category: 'sports', icon: Users,
    description: 'Engage with diverse student organizations, tech clubs, and open-source communities. Find your tribe!',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e6', title: 'Midterm Studies', month: 'DEC 2024', shortDate: 'Dec 1 - 10, 2024', location: 'Library 24/7 Zone', category: 'academic', icon: BookOpen,
    description: 'Intensive peer study sessions and professor review periods before exams. Coffee and snacks provided nightly.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e7', title: 'Winter Gala', month: 'DEC 2024', shortDate: 'Dec 15, 2024', location: 'Grand Ballroom', category: 'social', icon: Star,
    description: 'A luxurious end of year celebration dinner and networking night under the stars to celebrate the semester\'s success.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e8', title: 'Spring Open Day', month: 'FEB 2025', shortDate: 'Feb 10, 2025', location: 'Central Quad', category: 'academic', icon: Sun,
    description: 'Showcasing the most innovative student projects to the public, press, and prospective students.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e9', title: 'Hackathon', month: 'MAR 2025', shortDate: 'Mar 5 - 7, 2025', location: 'Innovation Hub', category: 'academic', icon: Code,
    description: 'A 48-hour continuous coding marathon. Build, break, and secure systems to win amazing prizes.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e10', title: 'Sports Meet', month: 'MAR 2025', shortDate: 'Mar 20 - 22, 2025', location: 'University Stadium', category: 'sports', icon: Trophy,
    description: 'Inter-department athletic competitions. Support your department and track medals across all track and field events.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e11', title: 'Spring Music Festival', month: 'APRIL 2025', shortDate: 'April 18-19, 2025', location: 'Student Union Lawn', category: 'social', icon: Music,
    description: 'An unforgettable lineup rounding out the year! Enjoy live music across 3 stages, art stations, and vibrant festival nights under the open sky.',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  }
];

const CAT_COLORS: Record<Category, { hex: string; text: string; bg: string; bgLight: string; border: string; ring: string; glow: string }> = {
  academic: {
    hex: '#38bdf8', text: 'text-cyan-300', bg: 'bg-cyan-500', bgLight: 'bg-cyan-500/15',
    border: 'border-cyan-500/40', ring: 'ring-cyan-400/30', glow: 'shadow-cyan-500/30'
  },
  social: {
    hex: '#fbbf24', text: 'text-amber-300', bg: 'bg-amber-500', bgLight: 'bg-amber-500/15',
    border: 'border-amber-500/40', ring: 'ring-amber-400/30', glow: 'shadow-amber-500/30'
  },
  sports: {
    hex: '#34d399', text: 'text-emerald-300', bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/15',
    border: 'border-emerald-500/40', ring: 'ring-emerald-400/30', glow: 'shadow-emerald-500/30'
  },
};

const EventsGallery: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 font-sans ${isLight ? 'bg-gradient-to-b from-slate-50 to-white' : 'bg-gradient-to-b from-[#050A15] via-[#070D1A] to-[#050A15]'}`}>

      {/* ─── Hero Header ───────────────────────────────────────────── */}
      <div className={`relative overflow-hidden border-b ${isLight ? 'border-gray-200' : 'border-white/5'}`}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full border ${isLight ? 'text-cyan-700 bg-cyan-50 border-cyan-300' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Academic Year 2024-2025
              </div>
              <h1 className={`text-4xl md:text-6xl font-black tracking-tight leading-none ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Event <span className="text-cyan-500">Timeline</span>
              </h1>
              <p className={`mt-3 text-sm md:text-base max-w-xl ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                Explore the year&aposs key moments — from freshman orientation to the spring music festival.
              </p>
            </div>

            {/* Legend */}
            <div className={`flex gap-5 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              {(Object.entries(CAT_COLORS) as [Category, typeof CAT_COLORS[Category]][]).map(([key, c]) => (
                <div key={key} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Timeline Tree ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative">

        {/* Centre line (tree trunk) - hidden on mobile, use left line instead */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
          <div className={`h-full w-full ${isLight ? 'bg-gradient-to-b from-cyan-300/50 via-gray-300 to-cyan-300/50' : 'bg-gradient-to-b from-cyan-500/30 via-white/10 to-cyan-500/30'}`} />
          {/* Glow on line */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full blur-sm ${isLight ? 'bg-cyan-300/20' : 'bg-cyan-500/20'}`} />
        </div>

        {/* Mobile: left-aligned trunk */}
        <div className="md:hidden absolute left-[18px] top-0 bottom-0 w-px">
          <div className={`h-full w-full ${isLight ? 'bg-gradient-to-b from-cyan-300/70 via-gray-300 to-cyan-300/70' : 'bg-gradient-to-b from-cyan-500/40 via-white/10 to-cyan-500/40'}`} />
        </div>

        <div className="relative space-y-8 md:space-y-16">

          {EVENTS.map((event, i) => {
            const cat = CAT_COLORS[event.category];
            const isExpanded = expandedId === event.id;
            const isLeft = i % 2 === 0;

            return (
              <div key={event.id} className="relative">

                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex items-start gap-4 pl-10">
                    {/* Node circle */}
                    <button
                      onClick={() => toggle(event.id)}
                      className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isExpanded
                          ? `${cat.bg} ${isLight ? 'border-gray-700' : 'border-white'} scale-110 ${cat.glow} shadow-lg`
                          : `${cat.bgLight} ${cat.border} hover:scale-110`
                        }`}
                    >
                      <event.icon className={`w-4 h-4 ${isExpanded ? 'text-white' : cat.text}`} />
                    </button>

                    {/* Title + date */}
                    <div className="flex-1 min-w-0 pt-1">
                      <button
                        onClick={() => toggle(event.id)}
                        className={`text-left w-full font-bold text-sm leading-tight tracking-tight ${isLight ? 'text-gray-900' : 'text-white'} hover:text-cyan-500 transition-colors`}
                      >
                        {event.title}
                      </button>
                      <p className={`text-[11px] font-semibold mt-0.5 tracking-wider ${cat.text}`}>
                        {event.month}
                      </p>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    {isExpanded && (
                      <div className={`ml-[58px] rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-gray-200' : 'bg-[#0A1122]/80 border-white/10'} shadow-xl`}>
                        <div className="relative h-40 overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white via-white/30 to-transparent' : 'from-[#0A1122] via-[#0A1122]/30 to-transparent'}`} />
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider">
                              <Calendar className="w-3 h-3" />
                              {event.shortDate}
                              <span className="mx-1">·</span>
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>{event.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop layout: alternating tree branches */}
                <div className="hidden md:block">
                  {/* Branch line from trunk to node */}
                  <svg className={`absolute top-[26px] h-px overflow-visible transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-40'}`}
                    style={{
                      left: isLeft ? '50%' : '0',
                      right: isLeft ? '0' : '50%',
                      width: '50%',
                      zIndex: 1,
                    }}>
                    <line x1={isLeft ? '0' : '100%'} y1="0" x2={isLeft ? '100%' : '0'} y2="0"
                      stroke={cat.hex}
                      strokeWidth="1.5"
                      strokeDasharray={isExpanded ? 'none' : '4 4'}
                      className="transition-all duration-500"
                      opacity={isExpanded ? '0.6' : '0.3'}
                    />
                  </svg>

                  <div className={`flex items-start gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Content side (text) */}
                    <div className={`flex-1 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'} pt-2`}>
                      <button
                        onClick={() => toggle(event.id)}
                        className="text-left w-full"
                      >
                        <p className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-1 ${cat.text}`}>
                          {event.month}
                        </p>
                        <h3 className={`text-lg font-bold leading-tight transition-colors ${isLight ? 'text-gray-900' : 'text-white'} hover:text-cyan-500`}>
                          {event.title}
                        </h3>
                        <div className={`flex items-center gap-2 mt-1 text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'} ${isLeft ? 'justify-end' : 'justify-start'}`}>
                          <Calendar className="w-3 h-3" />
                          {event.shortDate}
                          <span className="mx-0.5">·</span>
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </button>

                      {/* Expanded card */}
                      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        {isExpanded && (
                          <div className={`rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-gray-200 shadow-lg' : 'bg-[#0A1122]/90 border-white/10 shadow-2xl'} ${isLeft ? 'text-right' : 'text-left'}`}>
                            <div className="relative h-44 overflow-hidden">
                              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                              <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white via-white/20 to-transparent' : 'from-[#0A1122] via-[#0A1122]/20 to-transparent'}`} />
                            </div>
                            <div className="p-5">
                              <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>{event.description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Node circle */}
                    <button
                      onClick={() => toggle(event.id)}
                      className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer
                        ${isExpanded
                          ? `${cat.bg} ${isLight ? 'border-gray-700' : 'border-white'} scale-110 ${cat.glow} shadow-2xl`
                          : `${cat.bgLight} ${cat.border} hover:scale-110 hover:shadow-lg`
                        }`}
                    >
                      <event.icon className={`w-5 h-5 ${isExpanded ? 'text-white' : cat.text}`} />
                      {/* Ping ring on expand */}
                      {isExpanded && (
                        <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${cat.bg}`} style={{ animationDuration: '2s' }} />
                      )}
                    </button>

                    {/* Spacer side (opposite of content) */}
                    <div className="flex-1" />
                  </div>
                </div>

              </div>
            );
          })}

          {/* End node */}
          <div className="hidden md:flex justify-center pt-4">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-sm ${isLight ? 'bg-white/70 border-gray-200' : 'bg-[#0A1122]/70 border-white/10'}`}>
              <Sparkles className={`w-4 h-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
              <span className={`text-xs font-bold tracking-wider ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>End of Academic Year</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .timeline-enter {
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventsGallery;
