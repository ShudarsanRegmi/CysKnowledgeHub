import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { MapPin, DollarSign, Briefcase, Search, ChevronRight, Filter, SlidersHorizontal, Check, Loader2, ChevronLeft, ChevronFirst, ChevronLast, Building2 } from 'lucide-react';
import { getCompanies, getCompanyFilters, ApiCompany } from '../services/ctfApi';
import { CompanyDetailsModal } from './CompanyDetailsModal';

const PAGE_SIZE = 12;

const CompaniesPage: React.FC = () => {
    const [companies, setCompanies] = useState<ApiCompany[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState<ApiCompany | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedOpportunityTypes, setSelectedOpportunityTypes] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

    const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
    const [availableOpportunityTypes, setAvailableOpportunityTypes] = useState<string[]>([]);

    const activeFilters = selectedIndustries.length > 0 || selectedOpportunityTypes.length > 0 || debouncedSearch !== '';

    useEffect(() => { getCompanyFilters().then(f => { setAvailableIndustries(f.industries); setAvailableOpportunityTypes(f.opportunityTypes); }).catch(console.error); }, []);

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 300);
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [searchTerm]);

    const onFilterChange = useCallback((setter: React.Dispatch<React.SetStateAction<string[]>>) => (item: string) => {
        setter(prev => { const next = prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]; return next; });
        setPage(1);
    }, []);

    const toggleOpportunityType = onFilterChange(setSelectedOpportunityTypes);
    const toggleIndustry = onFilterChange(setSelectedIndustries);

    useEffect(() => {
        setLoading(true);
        const params: Record<string, string> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedIndustries.length > 0) params.industry = selectedIndustries.join(',');
        if (selectedOpportunityTypes.length > 0) params.opportunityType = selectedOpportunityTypes.join(',');
        params.page = String(page);
        params.limit = String(PAGE_SIZE);
        getCompanies(params)
            .then(r => { setCompanies(r.companies); setTotal(r.total); setTotalPages(r.totalPages); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [debouncedSearch, selectedIndustries, selectedOpportunityTypes, page]);

    const clearAll = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setSelectedIndustries([]);
        setSelectedOpportunityTypes([]);
        setPage(1);
    };

    // Pagination helpers
    const pageNumbers = useMemo(() => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    }, [totalPages, page]);

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
                    className="lg:hidden w-full py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-medium flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                    <SlidersHorizontal size={18} /> {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* ── Sidebar: Advanced Filters ── */}
                <aside className={`w-full lg:w-[280px] shrink-0 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24`}>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2">
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
                                    className="bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 w-full text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Opportunity Type Filter */}
                        {availableOpportunityTypes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Opportunity Type</h3>
                                <div className="space-y-2">
                                    {availableOpportunityTypes.map(type => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="hidden" checked={selectedOpportunityTypes.includes(type)} onChange={() => toggleOpportunityType(type)} />
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedOpportunityTypes.includes(type) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-cyan-400'}`}>
                                                {selectedOpportunityTypes.includes(type) && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-650 group-hover:text-cyan-605 dark:text-gray-300 dark:group-hover:text-white transition-colors">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Industry Filter */}
                        {availableIndustries.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Industry</h3>
                                <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                                    {availableIndustries.map(ind => (
                                        <label key={ind} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="hidden" checked={selectedIndustries.includes(ind)} onChange={() => toggleIndustry(ind)} />
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIndustries.includes(ind) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-cyan-400'}`}>
                                                {selectedIndustries.includes(ind) && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-650 group-hover:text-cyan-605 dark:text-gray-300 dark:group-hover:text-white transition-colors">{ind}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {activeFilters && (
                        <button
                            onClick={clearAll}
                            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 dark:bg-gray-950 dark:hover:bg-gray-900 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </aside>

                {/* ── Main Content Area ── */}
                <div className="flex-1 min-w-0">
                    <div className="mb-4 text-sm text-gray-500 font-medium px-1">
                        Showing <span className="text-gray-900 dark:text-white font-semibold">{total}</span> company{total !== 1 ? 'ies' : 'y'}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companies.map((company) => (
                                <div
                                    key={company._id}
                                    onClick={() => setSelectedCompany(company)}
                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col hover:shadow-xl hover:shadow-cyan-900/10 group h-full"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                                            {company.logo ? (
                                                <img src={company.logo} alt={`${company.companyName} logo`} className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-7 h-7 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{company.companyName}</h2>
                                            {company.industry && (
                                                <div className="text-cyan-600 dark:text-cyan-500 font-medium text-xs truncate">{company.industry}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800 flex-1">
                                        {company.opportunityType?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 text-gray-650 dark:text-gray-300 mb-3">
                                                {company.opportunityType.map(t => (
                                                    <span key={t} className="text-[10px] font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 py-1 px-2 rounded-full border border-cyan-200 dark:border-cyan-500/20">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {company.location && (
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                                <span className="text-sm truncate">{company.location}</span>
                                            </div>
                                        )}
                                        {company.salaryPackage && (
                                            <div className="flex items-center gap-3 text-gray-650 dark:text-gray-300">
                                                <DollarSign className="w-4 h-4 text-green-650 dark:text-green-500 shrink-0" />
                                                <span className="text-sm font-semibold">{company.salaryPackage}</span>
                                            </div>
                                        )}
                                        {company.roles?.length > 0 && (
                                            <div className="flex items-start gap-3 mt-4">
                                                <Briefcase className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                                                <div className="flex flex-wrap gap-1.5">
                                                    {company.roles.slice(0, 2).map((role, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-150 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 truncate max-w-full">
                                                            {role}
                                                        </span>
                                                    ))}
                                                    {company.roles.length > 2 && (
                                                        <span className="text-[10px] bg-gray-150 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                                                            +{company.roles.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800/50 flex items-center justify-between text-sm text-cyan-600 dark:text-cyan-500 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && companies.length === 0 && (
                        <div className="py-12 mt-4 text-center text-gray-550 border border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-900/50">
                            No companies found matching your filters.
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    {totalPages > 1 && !loading && (
                        <div className="mt-10 flex items-center justify-center gap-1.5">
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            ><ChevronFirst size={16} /></button>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            ><ChevronLeft size={16} /></button>
                            {pageNumbers.map((p, i) =>
                                p === '...' ? (
                                    <span key={`e${i}`} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-colors ${p === page ? 'bg-cyan-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'}`}
                                    >{p}</button>
                                )
                            )}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            ><ChevronRight size={16} /></button>
                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            ><ChevronLast size={16} /></button>
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
