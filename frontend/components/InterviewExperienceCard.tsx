import React, { useState } from 'react';
import {
    Building2, Calendar, Clock, Award, ChevronDown, ChevronUp,
    ThumbsUp, Bookmark, Users, ExternalLink, PlayCircle
} from 'lucide-react';
import { InterviewExperience, InterviewRound, InterviewQuestion } from '../types';

interface InterviewExperienceCardProps {
    experience: InterviewExperience;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Easy': return 'text-green-400 bg-green-900/20 border-green-500/20';
        case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
        case 'Hard': return 'text-red-400 bg-red-900/20 border-red-500/20';
        default: return 'text-gray-400 bg-gray-900/20 border-gray-500/20';
    }
};

const getResultColor = (result: string) => {
    switch (result) {
        case 'Selected': return 'text-green-400 bg-green-900/20 border-green-500/30';
        case 'Rejected': return 'text-red-400 bg-red-900/20 border-red-500/30';
        case 'Waiting': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
        default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
};

export const InterviewExperienceCard: React.FC<InterviewExperienceCardProps> = ({ experience }) => {
    const [expandedRounds, setExpandedRounds] = useState<Record<number, boolean>>({});
    const [showInsights, setShowInsights] = useState(false);
    const [saved, setSaved] = useState(false);
    const [helpful, setHelpful] = useState(false);

    const toggleRound = (index: number) => {
        setExpandedRounds(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all shadow-lg flex flex-col gap-6">

            {/* ── Basic Info Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/60 pb-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white tracking-tight">{experience.company}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getResultColor(experience.result)}`}>
                            {experience.result}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><Award size={15} className="text-cyan-500" /> {experience.role}</span>
                        <span className="flex items-center gap-1.5"><Building2 size={15} /> {experience.domain}</span>
                        <span className="flex items-center gap-1.5"><Users size={15} /> Batch {experience.batch} ({experience.studentName})</span>
                    </div>
                </div>

                <div className="text-right flex flex-row md:flex-col gap-3 md:gap-1 items-center md:items-end">
                    <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={13} /> {experience.date}</div>
                    <div className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${getDifficultyColor(experience.difficulty)}`}>
                        {experience.difficulty} Overall
                    </div>
                </div>
            </div>

            {/* ── Timeline Visualization ── */}
            {experience.rounds.length > 0 && (
                <div className="px-2">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Timeline</div>
                    <div className="flex items-start gap-0 w-full overflow-x-auto pb-2 scrollbar-hide">
                        {experience.rounds.map((round, idx) => (
                            <div key={idx} className="flex-1 flex flex-col relative min-w-[120px]">
                                {/* Line */}
                                <div className={`absolute top-2.5 left-0 w-full h-0.5 bg-gray-800 ${idx === experience.rounds.length - 1 ? 'hidden' : ''}`}></div>
                                <div className={`absolute top-2.5 left-0 w-1/2 h-0.5 bg-gray-800 ${idx === 0 ? 'hidden' : ''}`}></div>

                                {/* Dot */}
                                <div className="w-5 h-5 rounded-full bg-gray-950 border-2 border-cyan-500 z-10 mx-auto flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                </div>

                                {/* Labels */}
                                <div className="text-center mt-2 px-1">
                                    <div className="text-xs font-bold text-gray-300 truncate">{round.name}</div>
                                    <div className="text-[10px] text-gray-500">Day {round.dayOffset || (idx + 1) * 2}</div>
                                </div>
                            </div>
                        ))}

                        <div className="flex-shrink-0 flex flex-col relative min-w-[60px]">
                            <div className="absolute top-2.5 left-0 w-1/2 h-0.5 bg-gray-800"></div>
                            <div className={`w-5 h-5 rounded-full border-2 z-10 mx-auto ${experience.result === 'Selected' ? 'bg-green-500/20 border-green-500' : experience.result === 'Rejected' ? 'bg-red-500/20 border-red-500' : 'bg-yellow-500/20 border-yellow-500'}`}></div>
                            <div className="text-center mt-2 px-1">
                                <div className="text-xs font-bold text-gray-300">Result</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Rounds Breakdown (Accordion) ── */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Round-Wise Breakdown</h4>
                {experience.rounds.map((round, idx) => {
                    const isExpanded = expandedRounds[idx];
                    return (
                        <div key={idx} className="border border-gray-800 bg-gray-950/50 rounded-xl overflow-hidden transition-colors hover:border-gray-700">
                            <button
                                onClick={() => toggleRound(idx)}
                                className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
                            >
                                <div>
                                    <div className="font-bold text-gray-200 flex items-center gap-2">
                                        {round.name}
                                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${getDifficultyColor(round.difficulty)}`}>{round.difficulty}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-3 mt-1.5">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {round.duration}</span>
                                        <span className="flex items-center gap-1"><ExternalLink size={12} /> {round.mode} {round.platform ? `(${round.platform})` : ''}</span>
                                    </div>
                                </div>
                                <div className="text-gray-500 bg-gray-900 rounded-full p-1 border border-gray-800">
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-5 pb-5 pt-1 border-t border-gray-800/50">

                                    {round.topics.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1.5">Topics Covered</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {round.topics.map(t => (
                                                    <span key={t} className="text-xs px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-900/20 text-cyan-400">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {round.questions.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="text-[10px] uppercase text-gray-500 font-bold">Questions Asked</div>
                                            <ul className="space-y-4">
                                                {round.questions.map((q, qIdx) => (
                                                    <li key={qIdx} className="bg-gray-900 p-3.5 rounded-xl border border-gray-800/80">
                                                        <div className="flex justify-between items-start gap-3 mb-2">
                                                            <p className="text-sm text-gray-200 leading-relaxed font-medium">Q: {q.statement}</p>
                                                            <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${getDifficultyColor(q.difficulty)}`}>
                                                                {q.difficulty}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mb-2">Topic: <span className="text-gray-400">{q.topic}</span></div>
                                                        {q.followUps && q.followUps.length > 0 && (
                                                            <div className="mt-2 pl-3 border-l-2 border-gray-700 space-y-1">
                                                                {q.followUps.map((f, fIdx) => (
                                                                    <p key={fIdx} className="text-[12px] text-gray-400">↳ {f}</p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {round.feedback && (
                                        <div className="mt-4 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Performance Feedback</div>
                                            <p className="text-sm text-gray-300 italic">"{round.feedback}"</p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Additional Insights ── */}
            <div>
                <button
                    onClick={() => setShowInsights(!showInsights)}
                    className="w-full text-left bg-gradient-to-r from-cyan-900/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl px-5 py-3 transition-colors flex items-center justify-between"
                >
                    <span className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                        <PlayCircle size={16} /> Preparation Insights & Tips
                    </span>
                    {showInsights ? <ChevronUp size={16} className="text-cyan-500" /> : <ChevronDown size={16} className="text-cyan-500" />}
                </button>

                {showInsights && (
                    <div className="mt-3 p-5 rounded-xl border border-gray-800 bg-gray-950 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Strategy & Resources</div>
                            <p className="text-sm text-gray-300 mb-3">{experience.insights.prepStrategy}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {experience.insights.resources.map(r => (
                                    <span key={r} className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700">{r}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-red-500/70 uppercase mb-1.5">Mistakes Made</div>
                                <ul className="list-disc pl-4 space-y-1">
                                    {experience.insights.mistakes.map((m, i) => (
                                        <li key={i} className="text-sm text-gray-400">{m}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-green-500/70 uppercase mb-1.5">Pro Tips</div>
                                <ul className="list-disc pl-4 space-y-1">
                                    {experience.insights.tips.map((t, i) => (
                                        <li key={i} className="text-sm text-gray-400">{t}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Actions Footer ── */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800/60">
                <div className="flex gap-4">
                    <button
                        onClick={() => setHelpful(!helpful)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${helpful ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
                    >
                        <ThumbsUp size={16} className={helpful ? 'fill-current' : ''} />
                        {experience.helpfulCount + (helpful ? 1 : 0)} Helpful
                    </button>
                    <button
                        onClick={() => setSaved(!saved)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${saved ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
                    >
                        <Bookmark size={16} className={saved ? 'fill-current' : ''} />
                        {saved ? 'Saved' : 'Save'}
                    </button>
                </div>
                <div className="text-xs text-gray-500">
                    {experience.views} Views
                </div>
            </div>

        </div>
    );
};
