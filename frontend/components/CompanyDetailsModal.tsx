import React from 'react';
import { X, GraduationCap, ClipboardList, MessageSquare, Lightbulb, Building2 } from 'lucide-react';
import { ApiCompany } from '../services/ctfApi';

interface CompanyDetailsModalProps {
    company: ApiCompany;
    onClose: () => void;
}

export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({ company, onClose }) => {
    const hasAnyBodySection = company.eligibilityCriteria || company.selectionProcess?.length > 0 || company.interviewExperience || company.notesTips;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in relative">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                            {company.logo ? (
                                <img src={company.logo} alt={`${company.companyName} logo`} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{company.companyName}</h2>
                            {company.industry && <p className="text-sm text-cyan-600 dark:text-cyan-500 mt-0.5">{company.industry}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                {hasAnyBodySection && (
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                        {(company.eligibilityCriteria || company.selectionProcess?.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {company.eligibilityCriteria && (
                                    <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-500" /> Eligibility
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{company.eligibilityCriteria}</p>
                                    </div>
                                )}

                                {company.selectionProcess?.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <ClipboardList className="w-4 h-4 text-cyan-600 dark:text-cyan-500" /> Selection Process
                                        </h4>
                                        <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1.5 marker:text-gray-500">
                                            {company.selectionProcess.map((step, i) => (
                                                <li key={i}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        )}

                        {company.interviewExperience && (
                            <div className="bg-cyan-500/5 dark:bg-cyan-900/10 p-5 rounded-2xl border border-cyan-200 dark:border-cyan-500/20">
                                <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-500 uppercase mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Interview Experience
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-2 border-cyan-500/50 pl-3">
                                    "{company.interviewExperience}"
                                </p>
                            </div>
                        )}

                        {company.notesTips && (
                            <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                                <h4 className="text-sm font-bold text-yellow-600 dark:text-yellow-550 uppercase mb-2 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Notes & Tips
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{company.notesTips}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/80 flex items-center justify-end">
                    <button onClick={onClose} type="button" className="px-5 py-2 rounded-xl text-sm font-bold text-gray-750 dark:text-gray-400 hover:text-gray-955 dark:hover:text-white transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-805 dark:bg-gray-800">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
