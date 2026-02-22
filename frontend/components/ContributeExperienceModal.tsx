import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { INTERVIEW_DOMAINS } from '../constants';

interface ContributeExperienceModalProps {
    onClose: () => void;
}

export const ContributeExperienceModal: React.FC<ContributeExperienceModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        domain: 'Software Engineering',
        type: 'Full-time',
        result: 'Waiting',
        difficulty: 'Medium',
        rounds: [{ name: '', mode: 'Online', duration: '', topics: '', questions: '' }],
        prepStrategy: '',
        tips: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoundChange = (index: number, field: string, value: string) => {
        const newRounds = [...formData.rounds];
        newRounds[index] = { ...newRounds[index], [field]: value };
        setFormData({ ...formData, rounds: newRounds });
    };

    const addRound = () => {
        setFormData({
            ...formData,
            rounds: [...formData.rounds, { name: '', mode: 'Online', duration: '', topics: '', questions: '' }]
        });
    };

    const removeRound = (index: number) => {
        const newRounds = [...formData.rounds];
        newRounds.splice(index, 1);
        setFormData({ ...formData, rounds: newRounds });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Wait to close
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in relative">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-950/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Share Your Interview Experience</h2>
                        <p className="text-sm text-gray-400 mt-1">Help your peers by sharing insights from your interview process.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-gray-400">Your experience has been submitted for review. It will appear on the portal shortly after verification.</p>
                        </div>
                    ) : (
                        <form id="exp-form" onSubmit={handleSubmit} className="space-y-8">

                            {/* Step 1: Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest border-b border-gray-800 pb-2">1. Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Name *</label>
                                        <input required type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none" placeholder="e.g. Amazon" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Role Applied For *</label>
                                        <input required type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none" placeholder="e.g. SDE Intern" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Domain *</label>
                                        <select name="domain" value={formData.domain} onChange={handleInputChange} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none">
                                            {INTERVIEW_DOMAINS.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Type</label>
                                        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="On-campus">On-campus (General)</option>
                                            <option value="Off-campus">Off-campus (General)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Final Result</label>
                                        <select name="result" value={formData.result} onChange={handleInputChange} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none">
                                            <option value="Waiting">Waiting / Still in Process</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Overall Difficulty</label>
                                        <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none">
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Rounds */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                                    <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest">2. Interview Rounds</h3>
                                    <button type="button" onClick={addRound} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-900/20 px-3 py-1 rounded transition-colors">
                                        + Add Round
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.rounds.map((round, idx) => (
                                        <div key={idx} className="p-4 bg-gray-950 border border-gray-800 rounded-xl relative">
                                            {formData.rounds.length > 1 && (
                                                <button type="button" onClick={() => removeRound(idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            )}

                                            <div className="font-bold text-gray-300 mb-3 text-sm">Round {idx + 1}</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                                <input required type="text" placeholder="Round Name (e.g. Technical 1)" value={round.name} onChange={e => handleRoundChange(idx, 'name', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none" />
                                                <select value={round.mode} onChange={e => handleRoundChange(idx, 'mode', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none">
                                                    <option value="Online">Online / Virtual</option>
                                                    <option value="Offline">Offline / In-Person</option>
                                                </select>
                                                <input type="text" placeholder="Duration (e.g. 60 mins)" value={round.duration} onChange={e => handleRoundChange(idx, 'duration', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <input type="text" placeholder="Topics Covered (comma separated, e.g. DSA, Trees, HR)" value={round.topics} onChange={e => handleRoundChange(idx, 'topics', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none" />
                                                <textarea placeholder="List the questions asked in this round..." rows={3} value={round.questions} onChange={e => handleRoundChange(idx, 'questions', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"></textarea>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 3: Insights */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest border-b border-gray-800 pb-2">3. Insights & Advice</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Preparation Strategy & Resources</label>
                                        <textarea name="prepStrategy" value={formData.prepStrategy} onChange={handleInputChange} rows={3} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none" placeholder="How did you prepare? What resources did you use?"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Tips for Future Candidates</label>
                                        <textarea name="tips" value={formData.tips} onChange={handleInputChange} rows={2} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none" placeholder="Any specific advice or mistakes to avoid?"></textarea>
                                    </div>
                                </div>
                            </div>

                        </form>
                    )}

                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-4 border-t border-gray-800 bg-gray-950/80 flex items-center justify-between">
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <AlertCircle size={14} /> Submissions are reviewed by admins before publishing.
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} type="button" className="px-5 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="exp-form"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition-all ${isSubmitting ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Experience'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
