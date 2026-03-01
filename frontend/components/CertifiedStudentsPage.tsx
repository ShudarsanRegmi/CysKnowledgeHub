import React, { useState, useMemo } from 'react';
import { Search, Filter, Award, ChevronDown, CheckCircle, ExternalLink, Calendar, MapPin, Building } from 'lucide-react';
import { certifiedStudentsData } from '../certifiedStudentsData';
import { CertifiedStudent } from '../types';

type GroupMode = 'batch' | 'certification';

const CertifiedStudentsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBatch, setSelectedBatch] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All'); // 'All', 'Single', 'Multiple'
    const [groupMode, setGroupMode] = useState<GroupMode>('batch');
    const [selectedStudent, setSelectedStudent] = useState<CertifiedStudent | null>(null);

    // Extract unique batches for the filter dropdown
    const batches = useMemo(() => {
        const allBatches = certifiedStudentsData.map(s => s.batch);
        return ['All', ...Array.from(new Set(allBatches)).sort((a, b) => Number(b) - Number(a))];
    }, []);

    // Filter students based on search and selected filters
    const filteredStudents = useMemo(() => {
        return certifiedStudentsData.filter(student => {
            // Search logic (name or primary cert name)
            const matchesSearch =
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.primaryCertification.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Batch logic
            const matchesBatch = selectedBatch === 'All' || student.batch === selectedBatch;

            // Status logic (Single vs Multiple Certs)
            const hasMultiple = student.additionalCertifications.length > 0;
            const matchesStatus =
                selectedStatus === 'All' ||
                (selectedStatus === 'Multiple' && hasMultiple) ||
                (selectedStatus === 'Single' && !hasMultiple);

            return matchesSearch && matchesBatch && matchesStatus;
        });
    }, [searchTerm, selectedBatch, selectedStatus]);

    // Group the filtered students based on the selected grouping mode
    const groupedStudents = useMemo(() => {
        const groups: Record<string, CertifiedStudent[]> = {};

        filteredStudents.forEach(student => {
            let groupKey = '';
            if (groupMode === 'batch') {
                groupKey = `Class of ${student.batch}`;
            } else {
                groupKey = student.primaryCertification.name;
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(student);
        });

        // Optionally sort the groups (e.g. desc by batch)
        if (groupMode === 'batch') {
            return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
        }
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }, [filteredStudents, groupMode]);

    return (
        <div className="space-y-12 pb-16">
            {/* Header Section */}
            <section className="text-center space-y-4 pt-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight pb-2">
                    Certified Students Showcase
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Celebrating the exceptional achievements of our students who have mastered globally recognized cybersecurity and IT credentials.
                </p>
            </section>

            {/* Filters and Controls */}
            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by student or certification name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Batch Filter */}
                        <div className="relative group">
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="appearance-none bg-gray-950 border border-gray-800 rounded-xl py-3 pl-4 pr-10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer font-medium min-w-[140px]"
                            >
                                {batches.map(v => <option key={v} value={v}>{v === 'All' ? 'All Batches' : `Batch ${v}`}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-hover:text-cyan-400 transition-colors" />
                        </div>

                        {/* Status Filter */}
                        <div className="relative group">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="appearance-none bg-gray-950 border border-gray-800 rounded-xl py-3 pl-4 pr-10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer font-medium min-w-[160px]"
                            >
                                <option value="All">All Certifications</option>
                                <option value="Single">Single Certificate</option>
                                <option value="Multiple">Multiple Certificates</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-hover:text-cyan-400 transition-colors" />
                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px h-8 bg-gray-800 hidden md:block mx-1"></div>

                        {/* View/Group Toggle */}
                        <div className="bg-gray-950 rounded-xl border border-gray-800 p-1 flex">
                            <button
                                onClick={() => setGroupMode('batch')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${groupMode === 'batch'
                                    ? 'bg-cyan-900/40 text-cyan-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                Group by Batch
                            </button>
                            <button
                                onClick={() => setGroupMode('certification')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${groupMode === 'certification'
                                    ? 'bg-cyan-900/40 text-cyan-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                Group by Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase Grid */}
            <section className="space-y-12">
                {groupedStudents.length === 0 ? (
                    <div className="text-center py-20 border border-gray-800 border-dashed rounded-3xl bg-gray-900/30">
                        <Award className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No students found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    groupedStudents.map(([groupName, students]) => (
                        <div key={groupName} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-900/30 border border-cyan-500/20 flex items-center justify-center">
                                        <Award className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    {groupName}
                                </h2>
                                <div className="h-px bg-gray-800 flex-1 ml-4 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
                                <span className="text-sm font-bold text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800 shadow-inner">
                                    {students.length} Student{students.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Dynamic Grid Layout that avoids monotony */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                                {students.map((student) => {
                                    const hasMulti = student.additionalCertifications.length > 0;
                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => setSelectedStudent(student)}
                                            className="group cursor-pointer flex flex-col bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                                        >
                                            {/* Header Section */}
                                            <div className="relative h-40 overflow-hidden bg-gray-950">
                                                {/* Abstract Background element */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-indigo-900/20 z-0"></div>
                                                <div className="absolute -inset-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0"></div>

                                                {/* Central Certification Logo Highlight */}
                                                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
                                                    <img
                                                        src={student.primaryCertification.logo}
                                                        alt={`${student.primaryCertification.name} logo`}
                                                        className="w-32 h-32 object-contain filter grayscale invert opacity-50"
                                                    />
                                                </div>

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>

                                                {/* Float badges */}
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 items-end">
                                                    <span className="bg-gray-900/80 backdrop-blur border border-gray-700 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                                                        Batch {student.batch}
                                                    </span>
                                                    {hasMulti && (
                                                        <span className="bg-indigo-900/80 backdrop-blur border border-indigo-500/50 text-indigo-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                                            <Award className="w-3 h-3" /> Multiple Certs
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-5 flex-1 flex flex-col relative z-20 -mt-6 bg-gray-900 pt-8">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                        {student.name}
                                                    </h3>
                                                </div>

                                                {/* Primary Certification Card-in-Card */}
                                                <div className="mt-auto bg-gray-950 border border-gray-800 rounded-xl p-3 flex gap-3 items-center group-hover:border-gray-700 transition-colors">
                                                    <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 shadow-inner">
                                                        <img src={student.primaryCertification.logo} alt="Cert Logo" className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] text-cyan-500/80 font-bold uppercase tracking-wider mb-0.5 truncate">
                                                            {student.primaryCertification.organization}
                                                        </p>
                                                        <p className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug">
                                                            {student.primaryCertification.name}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Expanded Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedStudent(null)}
                    />

                    <div className="relative bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header Base */}
                        <div className="h-32 bg-gradient-to-r from-cyan-900/60 to-blue-900/40 relative">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors z-10 backdrop-blur"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="px-6 sm:px-8 pb-8 flex-1 overflow-y-auto block custom-scrollbar">
                            {/* Profile Block Overlapping Header */}
                            <div className="flex flex-col sm:flex-row gap-6 -mt-16 sm:-mt-12 relative z-10 pb-6 border-b border-gray-800">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-gray-900 shadow-xl bg-gray-800 shrink-0 flex items-center justify-center p-4">
                                    <img
                                        src={selectedStudent.primaryCertification.logo}
                                        alt={selectedStudent.name}
                                        className="max-w-full max-h-full object-contain filter "
                                    />
                                </div>
                                <div className="pt-2 sm:pt-14 flex-1">
                                    <div className="flex flex-col justify-end h-full">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedStudent.name}</h2>
                                            <span className="bg-gray-800 text-gray-300 text-xs font-bold uppercase px-2 py-0.5 rounded border border-gray-700">Batch {selectedStudent.batch}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">

                                {/* Left Area - Certifications */}
                                <div className="md:col-span-2 space-y-8">

                                    {/* Primary Cert */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Award className="w-4 h-4" /> Primary Certification
                                        </h3>

                                        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex gap-4">
                                            <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-gray-200">
                                                <img src={selectedStudent.primaryCertification.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">{selectedStudent.primaryCertification.organization}</p>
                                                <h4 className="text-base font-bold text-white leading-tight mb-2">{selectedStudent.primaryCertification.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" /> Achieved: {selectedStudent.primaryCertification.month} {selectedStudent.primaryCertification.year}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            Journey & Experience
                                        </h3>
                                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-5 relative">
                                            <span className="absolute -top-3 -left-2 text-4xl text-cyan-500/20 font-serif leading-none">"</span>
                                            <p className="text-gray-300 text-sm leading-relaxed relative z-10 italic">
                                                {selectedStudent.testimonial}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Area - Meta & Additional Certs */}
                                <div className="space-y-8">

                                    {/* Difficulty */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Difficulty</h3>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${selectedStudent.difficultyPerceived === 'Hard' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                                                selectedStudent.difficultyPerceived === 'Medium' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-500/30' :
                                                    'bg-green-900/20 text-green-400 border-green-500/30'
                                                }`}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                            {selectedStudent.difficultyPerceived}
                                        </span>
                                    </div>

                                    {/* Additional Certs */}
                                    {selectedStudent.additionalCertifications.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                Additional Credentials
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedStudent.additionalCertifications.map((cert, i) => (
                                                    <div key={i} className="flex gap-3 items-center bg-gray-950 border border-gray-800 rounded-xl p-2.5">
                                                        <div className="w-8 h-8 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 border border-gray-200">
                                                            <img src={cert.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-xs font-bold text-gray-200 truncate">{cert.name}</h4>
                                                            <p className="text-[10px] text-gray-500 mt-0.5">{cert.month} {cert.year}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertifiedStudentsPage;
