import React, { useState } from 'react';
import { Building2, MapPin, Globe, DollarSign, Briefcase, GraduationCap, ClipboardList, MessageSquare, Lightbulb, Search, ExternalLink } from 'lucide-react';
import companiesData from '../companiesData.json';
import { CompanyInfo } from '../types';

const CompaniesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const companies: CompanyInfo[] = companiesData;

    const filteredCompanies = companies.filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.roles.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Company Directory</h1>
                    <p className="text-gray-400">Detailed insights, placement roles, and interview experiences.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search companies, roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-full py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {filteredCompanies.map((company) => (
                    <div key={company.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row gap-8">
                        {/* Left Column: Core Info */}
                        <div className="md:w-1/3 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-gray-700">
                                    <img src={company.logo} alt={`${company.companyName} logo`} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{company.companyName}</h2>
                                    <div className="text-cyan-500 font-medium text-sm mb-2">{company.industry}</div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-800">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{company.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-500 hover:underline flex items-center gap-1">
                                        Website <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-semibold">{company.salaryPackage}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Roles
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {company.roles.map((role, i) => (
                                        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="md:w-2/3 space-y-6 md:border-l md:border-gray-800 md:pl-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-cyan-500" /> Eligibility
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">{company.eligibilityCriteria}</p>
                                </div>

                                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                        <ClipboardList className="w-4 h-4 text-cyan-500" /> Selection Process
                                    </h4>
                                    <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1.5 marker:text-gray-600">
                                        {company.selectionProcess.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            {company.interviewExperience && (
                                <div className="bg-cyan-900/10 p-5 rounded-2xl border border-cyan-500/20">
                                    <h4 className="text-sm font-bold text-cyan-500 uppercase mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Interview Experience
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-cyan-500/50 pl-3">
                                        "{company.interviewExperience}"
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
                                <h4 className="text-sm font-bold text-yellow-500 uppercase mb-2 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Notes & Tips
                                </h4>
                                <p className="text-sm text-gray-300 leading-relaxed">{company.notesTips}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCompanies.length === 0 && (
                    <div className="py-12 text-center text-gray-500 border border-gray-800 rounded-3xl bg-gray-900/50">
                        No companies found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompaniesPage;
