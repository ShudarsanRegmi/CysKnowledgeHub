import React, { useState, useMemo } from 'react';
import { Search, Filter, SortDesc, SlidersHorizontal, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { MOCK_INTERVIEWS, INTERVIEW_DOMAINS } from '../constants';
import { InterviewExperienceCard } from './InterviewExperienceCard';
import { ContributeExperienceModal } from './ContributeExperienceModal';
import { InterviewExperience } from '../types';

export const InterviewExperiencesPage: React.FC = () => {
    const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter States
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [selectedResults, setSelectedResults] = useState<string[]>([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'views'>('helpful');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Derive unique options from mock data
    const companies = Array.from(new Set(MOCK_INTERVIEWS.map(i => i.company)));
    const domains = INTERVIEW_DOMAINS;
    const results = ['Selected', 'Rejected', 'Waiting'];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setState(prev =>
            prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
        );
    };

    const filteredAndSortedExperiences = useMemo(() => {
        let result = [...MOCK_INTERVIEWS];

        // Search filter
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            result = result.filter(exp =>
                exp.company.toLowerCase().includes(q) ||
                exp.role.toLowerCase().includes(q) ||
                exp.studentName.toLowerCase().includes(q) ||
                exp.tags?.some(t => t.toLowerCase().includes(q)) ||
                exp.rounds.some(r => r.topics.some(t => t.toLowerCase().includes(q)))
            );
        }

        // Checkbox filters
        if (selectedCompanies.length > 0) {
            result = result.filter(e => selectedCompanies.includes(e.company));
        }
        if (selectedDomains.length > 0) {
            result = result.filter(e => selectedDomains.includes(e.domain));
        }
        if (selectedResults.length > 0) {
            result = result.filter(e => selectedResults.includes(e.result));
        }
        if (selectedDifficulties.length > 0) {
            result = result.filter(e => selectedDifficulties.includes(e.difficulty));
        }

        // Sort
        if (sortBy === 'recent') {
            result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === 'helpful') {
            result.sort((a, b) => b.helpfulCount - a.helpfulCount);
        } else if (sortBy === 'views') {
            result.sort((a, b) => b.views - a.views);
        }

        return result;
    }, [searchTerm, selectedCompanies, selectedDomains, selectedResults, selectedDifficulties, sortBy]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between bg-gradient-to-r from-cyan-900/20 to-indigo-900/10 p-6 md:p-8 rounded-3xl border border-cyan-500/20">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                        Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Experiences</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Real interview questions, strategies, and insights shared by students. Prepare smarter with transparent data.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => setIsContributeModalOpen(true)} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white transition-colors shadow-lg shadow-cyan-900/20">
                        Share Experience
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">

                {/* ── Mobile Filter Toggle ── */}
                <button
                    className="lg:hidden w-full py-3 bg-gray-900 border border-gray-800 rounded-xl font-medium flex items-center justify-center gap-2"
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                    <SlidersHorizontal size={18} /> {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* ── Sidebar: Advanced Filters ── */}
                <aside className={`w-full lg:w-[280px] shrink-0 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24`}>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5 flex items-center gap-2">
                            <Filter size={16} className="text-cyan-500" /> Filters
                        </h2>

                        {/* Company Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Company</h3>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                                {companies.map(c => (
                                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={selectedCompanies.includes(c)} onChange={() => toggleFilter(setSelectedCompanies, c)} />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCompanies.includes(c) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'}`}>
                                            {selectedCompanies.includes(c) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Domain Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Domain</h3>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-hide pr-2">
                                {domains.map(d => (
                                    <label key={d} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={selectedDomains.includes(d)} onChange={() => toggleFilter(setSelectedDomains, d)} />
                                        <div className={`w-4 h-4 rounded border flex-shrink-0 items-center justify-center transition-colors ${selectedDomains.includes(d) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'}`}>
                                            {selectedDomains.includes(d) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">{d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Result Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Status</h3>
                            <div className="space-y-2">
                                {results.map(r => (
                                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={selectedResults.includes(r)} onChange={() => toggleFilter(setSelectedResults, r)} />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedResults.includes(r) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'}`}>
                                            {selectedResults.includes(r) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{r}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Difficulty</h3>
                            <div className="flex flex-wrap gap-2">
                                {difficulties.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => toggleFilter(setSelectedDifficulties, d)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedDifficulties.includes(d)
                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                            : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {(selectedCompanies.length > 0 || selectedDomains.length > 0 || selectedResults.length > 0 || selectedDifficulties.length > 0) && (
                        <button
                            onClick={() => {
                                setSelectedCompanies([]);
                                setSelectedDomains([]);
                                setSelectedResults([]);
                                setSelectedDifficulties([]);
                            }}
                            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}

                </aside>

                {/* ── Main Content Area ── */}
                <div className="flex-1 space-y-6 min-w-0">

                    {/* Top Bar: Search and Sort */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">

                        <div className="relative w-full md:w-96 flex-shrink-0 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 w-5 h-5 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by company, role, topic (e.g. Graph)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600 text-white"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto px-2 md:px-0">
                            <span className="text-sm font-medium text-gray-500 whitespace-nowrap hidden sm:block">Sort by:</span>
                            <div className="relative w-full sm:w-40 border border-gray-800 rounded-xl bg-gray-950">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full bg-transparent text-sm text-gray-300 py-3 pl-4 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded-xl cursor-pointer"
                                >
                                    <option value="helpful">Most Helpful</option>
                                    <option value="recent">Most Recent</option>
                                    <option value="views">Most Viewed</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                    </div>

                    {/* Results Count Summary */}
                    <div className="px-2 text-sm text-gray-400 font-medium">
                        Showing <span className="text-white">{filteredAndSortedExperiences.length}</span> experiences
                    </div>

                    {/* Cards Grid */}
                    <div className="space-y-6">
                        {filteredAndSortedExperiences.length > 0 ? (
                            filteredAndSortedExperiences.map((exp: InterviewExperience) => (
                                <InterviewExperienceCard key={exp.id} experience={exp} />
                            ))
                        ) : (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-lg">
                                <AlertCircle className="w-12 h-12 text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No experiences found</h3>
                                <p className="text-gray-400 max-w-sm">
                                    We couldn't find any interview experiences matching your current filters and search term.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCompanies([]); setSelectedDomains([]); setSelectedResults([]); setSelectedDifficulties([]); }}
                                    className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-bold uppercase tracking-wider"
                                >
                                    Clear search & filters
                                </button>
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {isContributeModalOpen && (
                <ContributeExperienceModal onClose={() => setIsContributeModalOpen(false)} />
            )}

        </div>
    );
};

export default InterviewExperiencesPage;
