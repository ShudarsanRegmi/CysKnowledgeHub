import React, { useState, useMemo } from 'react';
import { Building2, MapPin, Globe, DollarSign, Briefcase, GraduationCap, ClipboardList, MessageSquare, Lightbulb, Search, ExternalLink, ChevronRight, Filter, SlidersHorizontal, Check } from 'lucide-react';
import companiesData from '../companiesData.json';
import { CompanyInfo } from '../types';
import { CompanyDetailsModal } from './CompanyDetailsModal';

const CompaniesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | null>(null);
    const companies: CompanyInfo[] = companiesData as CompanyInfo[];

    // Filter States
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedOpportunityTypes, setSelectedOpportunityTypes] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [minCtc, setMinCtc] = useState<number | ''>('');

    // Derived unique options
    const industries = Array.from(new Set(companies.map(c => c.industry)));
    const opportunityTypes = ['Internship', 'Placement'];

    const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setState(prev =>
            prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
        );
    };

    const filteredCompanies = useMemo(() => {
        return companies.filter(c => {
            // Search filter
            const matchesSearch =
                c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.roles.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;

            // Industry filter
            if (selectedIndustries.length > 0 && !selectedIndustries.includes(c.industry)) {
                return false;
            }

            // Opportunity filter
            if (selectedOpportunityTypes.length > 0) {
                if (!c.opportunityType) return false;
                const hasMatch = selectedOpportunityTypes.some(t => c.opportunityType?.includes(t as any));
                if (!hasMatch) return false;
            }

            // CTC filter
            if (minCtc !== '' && c.ctc !== undefined) {
                if (c.ctc < minCtc) return false;
            } else if (minCtc !== '' && c.ctc === undefined) {
                return false;
            }

            return true;
        });
    }, [companies, searchTerm, selectedIndustries, selectedOpportunityTypes, minCtc]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Company Directory</h1>
                    <p className="text-gray-400">Detailed insights, placement roles, and interview experiences.</p>
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

                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-950 border border-gray-800 rounded-xl py-2 pl-10 pr-4 w-full text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white"
                                />
                            </div>
                        </div>

                        {/* Opportunity Type Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Opportunity Type</h3>
                            <div className="space-y-2">
                                {opportunityTypes.map(type => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={selectedOpportunityTypes.includes(type)} onChange={() => toggleFilter(setSelectedOpportunityTypes, type)} />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedOpportunityTypes.includes(type) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'}`}>
                                            {selectedOpportunityTypes.includes(type) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Industry Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Industry</h3>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                                {industries.map(ind => (
                                    <label key={ind} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={selectedIndustries.includes(ind)} onChange={() => toggleFilter(setSelectedIndustries, ind)} />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIndustries.includes(ind) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'}`}>
                                            {selectedIndustries.includes(ind) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{ind}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Minimum CTC Filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-200 mb-3">Minimum CTC (LPA)</h3>
                            <input
                                type="number"
                                placeholder="e.g. 15"
                                value={minCtc}
                                onChange={(e) => setMinCtc(e.target.value === '' ? '' : Number(e.target.value))}
                                className="bg-gray-950 border border-gray-800 rounded-xl py-2 px-4 w-full text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white"
                            />
                        </div>

                    </div>

                    {(selectedIndustries.length > 0 || selectedOpportunityTypes.length > 0 || minCtc !== '' || searchTerm !== '') && (
                        <button
                            onClick={() => {
                                setSelectedIndustries([]);
                                setSelectedOpportunityTypes([]);
                                setMinCtc('');
                                setSearchTerm('');
                            }}
                            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </aside>

                {/* ── Main Content Area ── */}
                <div className="flex-1 min-w-0">
                    <div className="mb-4 text-sm text-gray-400 font-medium px-1">
                        Showing <span className="text-white">{filteredCompanies.length}</span> companies
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
                                    <div className="flex flex-wrap gap-2 text-gray-300 mb-3">
                                        {company.opportunityType?.map(t => (
                                            <span key={t} className="text-[10px] font-bold uppercase tracking-wider bg-cyan-900/40 text-cyan-400 py-1 px-2 rounded-full border border-cyan-500/20">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

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
                        <div className="py-12 mt-4 text-center text-gray-500 border border-gray-800 rounded-3xl bg-gray-900/50">
                            No companies found matching your filters.
                        </div>
                    )}
                </div>
            </div>

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
