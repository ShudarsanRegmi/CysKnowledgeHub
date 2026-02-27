import React, { useState } from 'react';
import { Building2, MapPin, Globe, DollarSign, Briefcase, GraduationCap, ClipboardList, MessageSquare, Lightbulb, Search, ExternalLink, ChevronRight } from 'lucide-react';
import companiesData from '../companiesData.json';
import { CompanyInfo } from '../types';
import { CompanyDetailsModal } from './CompanyDetailsModal';

const CompaniesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | null>(null);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                    <div
                        key={company.id}
                        onClick={() => setSelectedCompany(company)}
                        className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col hover:shadow-xl hover:shadow-cyan-900/10 group h-full"
                    >
                        {/* Core Info */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-gray-700">
                                <img src={company.logo} alt={`${company.companyName} logo`} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold truncate group-hover:text-cyan-400 transition-colors">{company.companyName}</h2>
                                <div className="text-cyan-500 font-medium text-xs truncate">{company.industry}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-800 flex-1">
                            <div className="flex items-center gap-3 text-gray-300">
                                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                                <span className="text-sm truncate">{company.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <DollarSign className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="text-sm font-semibold">{company.salaryPackage}</span>
                            </div>
                            <div className="flex items-start gap-3 mt-4">
                                <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                                <div className="flex flex-wrap gap-1.5">
                                    {company.roles.slice(0, 2).map((role, i) => (
                                        <span key={i} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded-md border border-gray-700 truncate max-w-full">
                                            {role}
                                        </span>
                                    ))}
                                    {company.roles.length > 2 && (
                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md border border-gray-700">
                                            +{company.roles.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-800/50 flex items-center justify-between text-sm text-cyan-500 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                            View Details <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>

            {filteredCompanies.length === 0 && (
                <div className="py-12 text-center text-gray-500 border border-gray-800 rounded-3xl bg-gray-900/50">
                    No companies found matching "{searchTerm}"
                </div>
            )}

            {selectedCompany && (
                <CompanyDetailsModal
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                />
            )}
        </div>
    );
};

export default CompaniesPage;
