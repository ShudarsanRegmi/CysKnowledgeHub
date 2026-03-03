import React, { useState, useEffect, useRef } from 'react';
import { MapPin, BookOpen, Briefcase, Flag, Users, Star, Sun, Code, Trophy, Music, ChevronRight, Calendar, Sparkles } from 'lucide-react';

type Category = 'academic' | 'social' | 'sports';

interface EventData {
    id: string;
    title: string;
    month: string;
    shortDate: string;
    location: string;
    category: Category;
    x: number;
    y: number;
    icon: React.ElementType;
    description: string;
    image: string;
}

const EVENTS: EventData[] = [
    {
        id: 'e1', title: 'Freshman Welcome', month: 'SEPT 2024', shortDate: 'Sept 5 - 7, 2024', location: 'Main Auditorium', category: 'academic', x: 4, y: 65, icon: BookOpen,
        description: 'Welcome to the academic year! An overview of the curriculum, campus facilities, and a chance to meet the faculty and fellow freshmen.',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e2', title: 'Campus Tour', month: 'SEPT 2024', shortDate: 'Sept 10, 2024', location: 'Campus Grounds', category: 'social', x: 14, y: 82, icon: MapPin,
        description: 'Guided exploration of tech labs, student centers, and research facilities. Get familiar with your new home.',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e3', title: 'Career Fair', month: 'OCT 2024', shortDate: 'Oct 12, 2024', location: 'Tech Hall A', category: 'academic', x: 23, y: 40, icon: Briefcase,
        description: 'Connect with industry leading tech companies and promising startups for exciting placements and internship opportunities.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e4', title: 'Homecoming Parade', month: 'OCT 2024', shortDate: 'Oct 25, 2024', location: 'University Avenue', category: 'social', x: 30, y: 55, icon: Flag,
        description: 'The spectacular annual homecoming celebration with alumni and current students. Enjoy floats, marching bands, and festivities.',
        image: 'https://images.unsplash.com/photo-1561489396-888724a1543d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e5', title: 'Club Festival', month: 'NOV 2024', shortDate: 'Nov 8, 2024', location: 'Student Union', category: 'sports', x: 42, y: 85, icon: Users,
        description: 'Engage with diverse student organizations, tech clubs, and open-source communities. Find your tribe!',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e6', title: 'Midterm Studies', month: 'DEC 2024', shortDate: 'Dec 1 - 10, 2024', location: 'Library 24/7 Zone', category: 'academic', x: 51, y: 60, icon: BookOpen,
        description: 'Intensive peer study sessions and professor review periods before exams. Coffee and snacks provided nightly.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e7', title: 'Winter Gala', month: 'DEC 2024', shortDate: 'Dec 15, 2024', location: 'Grand Ballroom', category: 'social', x: 58, y: 42, icon: Star,
        description: 'A luxurious end of year celebration dinner and networking night under the stars to celebrate the semester’s success.',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e8', title: 'Spring Open Day', month: 'FEB 2025', shortDate: 'Feb 10, 2025', location: 'Central Quad', category: 'academic', x: 69, y: 78, icon: Sun,
        description: 'Showcasing the most innovative student projects to the public, press, and prospective students.',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e9', title: 'Hackathon', month: 'MAR 2025', shortDate: 'Mar 5 - 7, 2025', location: 'Innovation Hub', category: 'academic', x: 79, y: 50, icon: Code,
        description: 'A 48-hour continuous coding marathon. Build, break, and secure systems to win amazing prizes.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e10', title: 'Sports Meet', month: 'MAR 2025', shortDate: 'Mar 20 - 22, 2025', location: 'University Stadium', category: 'sports', x: 88, y: 80, icon: Trophy,
        description: 'Inter-department athletic competitions. Support your department and track medals across all track and field events.',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'e11', title: 'Spring Music Festival', month: 'APRIL 2025', shortDate: 'April 18-19, 2025', location: 'Student Union Lawn', category: 'social', x: 96, y: 45, icon: Music,
        description: 'An unforgettable lineup rounding out the year! Enjoy live music across 3 stages, art stations, and vibrant festival nights under the open sky.',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    }
];

const getCatColor = (cat: Category) => {
    switch (cat) {
        case 'academic': return { hex: '#38bdf8', tw: 'cyan', text: 'text-cyan-400', bg: 'bg-cyan-500', bgOp: 'bg-cyan-500/20', border: 'border-cyan-400', borderOp: 'border-cyan-400/50', glow: 'shadow-[0_0_30px_rgba(56,189,248,0.6)]' };
        case 'social': return { hex: '#fbbf24', tw: 'amber', text: 'text-amber-400', bg: 'bg-amber-500', bgOp: 'bg-amber-500/20', border: 'border-amber-400', borderOp: 'border-amber-400/50', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]' };
        case 'sports': return { hex: '#34d399', tw: 'emerald', text: 'text-emerald-400', bg: 'bg-emerald-500', bgOp: 'bg-emerald-500/20', border: 'border-emerald-400', borderOp: 'border-emerald-400/50', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.6)]' };
    }
};

const catmullRom2bezier = (points: { x: number, y: number }[]) => {
    let d = '';
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i === 0 ? points[0] : points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i + 2 < points.length ? points[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 5.5;
        const cp1y = p1.y + (p2.y - p0.y) / 5.5;

        const cp2x = p2.x - (p3.x - p1.x) / 5.5;
        const cp2y = p2.y - (p3.y - p1.y) / 5.5;

        d += (i === 0 ? `M ${p1.x},${p1.y} ` : '') + `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
    }
    return d;
};

// SVG Path rendering component for glowing, animated ribbon
const WindingPath = ({ points }: { points: { x: number, y: number }[] }) => {
    const d = catmullRom2bezier(points);

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="pathGradientGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(56,189,248,0.5)" />
                    <stop offset="50%" stopColor="rgba(251,191,36,0.5)" />
                    <stop offset="100%" stopColor="rgba(52,211,153,0.5)" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="heavyGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Dimmed static background path */}
            <path d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            <path d={d} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2" filter="url(#heavyGlow)" />

            {/* Animated glowing streak */}
            <path
                d={d}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="0.4"
                filter="url(#glow)"
                className="path-animate"
                strokeDasharray="20 100"
            />

            {/* Heavy glow underneath */}
            <path
                d={d}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="0.1"
                filter="url(#heavyGlow)"
                opacity="0.6"
            />
        </svg>
    );
};

const EventsGallery: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTranslate, setScrollTranslate] = useState(0);

    // Calculate dynamic canvas width so nodes NEVER clump together when you add more!
    const canvasWidth = Math.max(2600, EVENTS.length * 300);

    // Auto-select latest event on mount (removed by request)

    // 1. SCROLL LISTENER: Translate vertical scroll progress into horizontal track movement
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const wrap = containerRef.current;
            const rect = wrap.getBoundingClientRect();

            // The top of the container starts 64px from the viewport (under the header)
            const scrolledPast = 64 - rect.top;
            const totalScrollable = wrap.offsetHeight - (window.innerHeight - 64);

            let progress = 0;
            if (totalScrollable > 0 && scrolledPast > 0) {
                progress = Math.min(1, scrolledPast / totalScrollable);
            }

            // Add right padding to allow scrolling past the last element
            const rightPadding = window.innerWidth / 2;
            const absoluteTrackWidth = canvasWidth + rightPadding;

            // Subtract inner window width from canvas to find the absolute max pixels we can pan left
            const maxTranslate = absoluteTrackWidth - window.innerWidth;
            setScrollTranslate(Math.max(0, progress * maxTranslate));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Trigger immediately to sync layout

        return () => window.removeEventListener('scroll', handleScroll);
    }, [canvasWidth]);

    // 2. AUTO-PAN LOGIC: When a node is selected, smoothly scroll the window vertically to the correct translation
    useEffect(() => {
        if (selectedEvent && containerRef.current) {
            const wrap = containerRef.current;
            const totalScrollable = wrap.offsetHeight - (window.innerHeight - 64);
            if (totalScrollable <= 0) return;

            // Where the node lives horizontally
            const targetXPixel = (selectedEvent.x / 100) * canvasWidth;

            // The screen space covered by the floating info card
            const rightPaneWidth = window.innerWidth > 768 ? 440 : 0;
            const visibleWidth = window.innerWidth - rightPaneWidth;

            const rightPadding = window.innerWidth / 2;
            const absoluteTrackWidth = canvasWidth + rightPadding;
            const maxTranslate = absoluteTrackWidth - window.innerWidth;
            const targetTranslate = targetXPixel - (visibleWidth / 2);

            // Determine what vertical progress percentage translates to this ideal horizontal position
            let progress = targetTranslate / maxTranslate;
            progress = Math.max(0, Math.min(1, progress));

            const absoluteWrapTop = window.scrollY + wrap.getBoundingClientRect().top;
            const targetScrollY = (absoluteWrapTop - 64) + (progress * totalScrollable);

            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth' // Extremely smooth browser-native animation
            });
        }
    }, [selectedEvent, canvasWidth]);

    const pathPoints = EVENTS.map(e => ({ x: e.x, y: e.y }));

    return (
        // The container height is deliberately lengthened so the user has thousands of pixels to scroll vertically!
        <div ref={containerRef} className="w-full bg-[#050A15] relative font-sans border-t border-white/5" style={{ height: `${canvasWidth * 1.5}px` }}>

            {/* STICKY CONTAINER: Stays frozen under the header while the user scrolls down */}
            <div className="sticky top-[64px] w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center">

                {/* Dark Campus Blueprint Background Overlay */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 opacity-[0.15] blueprint-grid"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)',
                            backgroundSize: '100px 100px'
                        }}
                    />
                </div>

                {/* Modern Header - Top Center */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-30 w-full pointer-events-none px-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-2xl font-sans" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                        Campus Events Constellation
                    </h1>
                    <p className="text-xs md:text-sm font-bold text-cyan-400 tracking-[0.4em] uppercase">
                        Explore the Timeline <span className="text-white/50 ml-2">2024-2025</span>
                    </p>
                </div>

                {/* Legend - Top Left */}
                <div className="absolute left-8 top-12 z-30 hidden md:flex gap-6 text-[11px] md:text-sm font-bold uppercase tracking-widest text-slate-300">
                    <div className="flex items-center gap-3 cursor-pointer hover:text-cyan-400 transition-all hover:scale-105">
                        <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_12px_#38bdf8]"></div> Academic
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-amber-400 transition-all hover:scale-105">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_#fbbf24]"></div> Social
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-emerald-400 transition-all hover:scale-105">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#34d399]"></div> Sports
                    </div>
                </div>

                {/* Left indicator text */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none opacity-50 hidden md:flex items-center gap-4">
                    <div className="flex flex-col text-[11px] font-bold tracking-[0.3em] uppercase text-cyan-300">
                        <span>Winding</span>
                        <span>Pathway</span>
                    </div>
                    <div className="w-12 h-px bg-cyan-500/50" />
                </div>

                {/* The Horizontally Translating Canvas */}
                <div
                    className="absolute top-0 bottom-0 left-0 transition-transform duration-[400ms] ease-out flex items-center pr-[50vw]"
                    style={{
                        transform: `translate3d(${-scrollTranslate}px, 0, 0)`
                    }}
                >
                    <div className="h-full relative mx-auto my-auto min-h-[650px] flex items-center object-contain" style={{ width: `${canvasWidth}px` }}>

                        <WindingPath points={pathPoints} />

                        {/* Connective background glows for each node */}
                        {EVENTS.map((e, i) => (
                            <div key={`ambient-${i}`} className="absolute blur-[100px] w-56 h-56 rounded-full pointer-events-none opacity-[0.25]"
                                style={{ left: `${e.x}%`, top: `${e.y}%`, background: getCatColor(e.category).hex, transform: 'translate(-50%, -50%)' }} />
                        ))}

                        {/* Map Nodes */}
                        {EVENTS.map((event) => {
                            const cat = getCatColor(event.category);
                            const isSelected = selectedEvent?.id === event.id;

                            return (
                                <button
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    className={`absolute group z-20 focus:outline-none transition-all duration-500 ease-out 
                  ${isSelected ? 'z-50' : 'hover:z-40'}`}
                                    style={{
                                        left: `${event.x}%`,
                                        top: `${event.y}%`,
                                        transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.2)' : 'scale(1)'}`
                                    }}
                                >

                                    {/* Floating Date Badge (Top left of orb) */}
                                    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-all duration-300 ${isSelected ? 'opacity-100 -translate-y-2' : ''}`}>
                                        <p className={`text-xs md:text-sm font-extrabold tracking-[0.2em] uppercase ${cat.text} drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}>
                                            {event.month}
                                        </p>
                                    </div>

                                    {/* Main Orb */}
                                    <div className="relative">
                                        {/* Outer glowing ring */}
                                        <div className={`absolute inset-[-10px] rounded-full border border-white/20 transition-all duration-500 
                    ${isSelected ? `opacity-100 rotate-180 scale-100 ${cat.borderOp} shadow-[0_0_30px_rgba(255,255,255,0.1)]` : 'opacity-0 scale-90 group-hover:scale-95 group-hover:opacity-50'}`}
                                        />

                                        {/* Inner glowing bubble */}
                                        <div className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center 
                    backdrop-blur-md transition-all duration-500 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)]
                    ${cat.border} ${cat.bgOp} 
                    ${isSelected ? `${cat.glow} bg-opacity-40` : 'group-hover:bg-opacity-30 group-hover:scale-[1.05] group-hover:border-white'}`}
                                        >
                                            {/* Glass reflection effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 rounded-full" />

                                            {/* Pulsing inner glow for selected */}
                                            {isSelected && (
                                                <div className={`absolute inset-0 rounded-full ${cat.bg} opacity-40 animate-ping shadow-[0_0_20px_inset]`} style={{ animationDuration: '2.5s' }} />
                                            )}

                                            <event.icon className={`relative z-10 w-7 h-7 md:w-10 md:h-10 ${cat.text} drop-shadow-[0_2px_6px_rgba(0,0,0,1)] transition-transform duration-300 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_currentColor]' : ''}`} />
                                        </div>

                                        {/* Small connection dot on the orb edge */}
                                        <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${cat.bg} ring-[3px] ring-[#050A15] z-20 shadow-[0_0_10px_currentColor] ${isSelected ? 'animate-pulse scale-125' : ''}`} />
                                    </div>

                                    {/* Event Title Label */}
                                    <div className={`absolute left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap transition-all duration-500 
                  ${isSelected ? 'translate-y-2' : '-translate-y-1 group-hover:translate-y-0'}
                `}>
                                        <p className={`text-xs md:text-sm font-extrabold text-white px-4 py-2 rounded-full backdrop-blur-xl border 
                    ${isSelected ? `bg-slate-900/95 ${cat.border} shadow-[0_0_20px_rgba(0,0,0,0.8)]` : 'bg-slate-900/70 border-white/20 group-hover:border-white/40 group-hover:bg-slate-800/90'} 
                    shadow-xl leading-none`}>
                                            {event.title}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Floating Detailed Overlay Card (Right Side, absolute to screen) */}
            <div
                className={`fixed top-[55%] right-4 md:right-10 -translate-y-1/2 w-[340px] md:w-[400px] bg-[#0A1122]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.9)] z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${selectedEvent ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95 pointer-events-none'}
        `}
            >
                {selectedEvent && (
                    <div className="bg-gradient-to-b from-white/[0.04] to-transparent rounded-[1.75rem] p-6 h-full relative overflow-hidden ring-1 ring-inset ring-white/10">
                        {/* Ambient inner glow matching category */}
                        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-500" style={{ background: getCatColor(selectedEvent.category).hex }} />

                        <div className="relative z-10">
                            {/* Card Header */}
                            <div className="mb-6 border-b border-white/10 pb-5">
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider leading-none mb-4 flex items-start justify-between gap-3">
                                    <span style={{ textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>{selectedEvent.title}</span>
                                    <Sparkles className={`w-6 h-6 flex-shrink-0 mt-1 ${getCatColor(selectedEvent.category).text} animate-pulse`} />
                                </h3>

                                <div className="space-y-2.5">
                                    <p className="text-xs md:text-sm font-bold text-slate-300 flex items-center gap-3 uppercase tracking-wider">
                                        <div className={`p-1.5 rounded-md ${getCatColor(selectedEvent.category).bgOp}`}><Calendar className={`w-3.5 h-3.5 ${getCatColor(selectedEvent.category).text}`} /></div>
                                        {selectedEvent.shortDate}
                                    </p>
                                    <p className="text-xs md:text-sm font-bold text-slate-400 flex items-center gap-3 uppercase tracking-wider">
                                        <div className={`p-1.5 rounded-md ${getCatColor(selectedEvent.category).bgOp}`}><MapPin className={`w-3.5 h-3.5 ${getCatColor(selectedEvent.category).text}`} /></div>
                                        {selectedEvent.location}
                                    </p>
                                </div>
                            </div>

                            {/* Card Image */}
                            <div className="w-full h-52 md:h-60 rounded-2xl overflow-hidden mb-6 relative group ring-1 ring-white/10 shadow-[0_0_20px_inset_rgba(0,0,0,0.5)]">
                                <img
                                    key={selectedEvent.id} // Forces re-render/animation on change
                                    src={selectedEvent.image}
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out image-fade-in"
                                />

                                {/* Image Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1122]/95 via-[#0A1122]/30 to-transparent pointer-events-none" />

                                {/* Read More fading text over image */}
                                <div className="absolute bottom-4 left-4 right-4 text-sm text-slate-200 leading-relaxed font-medium opacity-95 drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,1)' }}>
                                    {selectedEvent.description}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button className={`w-full py-4 rounded-xl text-sm font-black text-[#050A15] tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-2 
                                    ${getCatColor(selectedEvent.category).bg} hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.97] group`}>
                                    RSVP
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        /* Hide scrollbar completely but allow scrolling */
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @keyframes flowPath {
          from { stroke-dashoffset: 120; }
          to { stroke-dashoffset: 0; }
        }
        
        .path-animate {
          animation: flowPath 3s linear infinite;
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(1.05); filter: blur(4px); }
          to { opacity: 1; transform: scale(1); filter: blur(0px); }
        }

        .image-fade-in {
          animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div >
    );
};

export default EventsGallery;
