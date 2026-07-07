import React, { useState, useMemo } from "react";
import { X, Award } from "lucide-react";

import { Certification, certificationsData, certificationRoadmaps, fourYearPlan } from "../certificationsData";

const levelStyles: Record<string, string> = {
  Beginner: "bg-green-900/30 text-green-400 border-green-500/40",
  Intermediate: "bg-yellow-900/30 text-yellow-400 border-yellow-500/40",
  Advanced: "bg-red-900/30 text-red-400 border-red-500/40",
};

const levelBubbleStyles: Record<string, string> = {
  Beginner: "bg-green-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-red-500",
};

const levelIcons: Record<string, string> = {
  Beginner: "●",
  Intermediate: "◆",
  Advanced: "★",
};

function findCert(name: string): Certification | undefined {
  for (const cat of certificationsData) {
    const c = cat.certifications.find(c => c.name === name);
    if (c) return c;
  }
  return undefined;
}

interface CategorySectionProps {
  title: string;
  certifications: Certification[];
  onSelectCert: (cert: Certification) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, certifications, onSelectCert }) => {
  const sorted = useMemo(
    () => [...certifications].sort((a, b) => {
      const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      return order[a.level] - order[b.level];
    }),
    [certifications]
  );

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-4">
        {title}
        <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/40 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#3b82f6]" />
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {sorted.map((cert, i) => (
          <div
            key={i}
            className="group relative flex items-center w-full cursor-pointer h-24 sm:h-28 transform transition-transform duration-300 hover:-translate-y-1"
            onClick={() => onSelectCert(cert)}
          >
            {/* Badge container — no outer gradient circle, just a subtle rounded square */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl z-20 bg-[#f5f6f8] dark:bg-[#1a1a2e] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative border border-gray-200 dark:border-gray-700 group-hover:border-cyan-500/50 overflow-hidden p-1.5">
              {cert.badgeUrl ? (
                <img
                  src={cert.badgeUrl}
                  alt={`${cert.name} badge`}
                  className="w-full h-full object-contain drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${cert.badgeUrl ? 'hidden' : ''} flex items-center justify-center w-full h-full`}>
                <Award className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
              </div>
            </div>

            {/* Right Rectangle (Content) */}
            <div className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md py-1 pr-4 sm:pr-6 pl-[44px] sm:pl-[52px] -ml-[32px] sm:-ml-[40px] flex items-center justify-between h-24 sm:h-28 shadow-lg relative z-10 rounded-r-3xl border border-l-0 border-gray-700 group-hover:border-cyan-500/50 transition-colors duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />

              <div className="flex flex-col justify-center gap-1 relative z-10 flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-gray-100 truncate group-hover:text-cyan-300 transition-colors tracking-wide leading-tight">
                  {cert.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] sm:text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm border max-w-max tracking-wider leading-none ${levelStyles[cert.level]}`}>
                    {cert.level} <span className="mx-1 opacity-40">|</span> {cert.organization}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0 ml-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-950/60 border border-gray-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/50 transition-all duration-300 shadow-inner group-hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <span className="text-gray-400 group-hover:text-cyan-300 transition-colors duration-300 text-sm font-bold flex items-center justify-center transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoadmapSection: React.FC = () => {
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center gap-4">
        Certification Roadmaps
        <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
        </div>
      </h2>
      <p className="text-gray-400 mb-12 text-sm max-w-2xl">
        Curated certification paths from beginner to advanced. Follow these roadmaps to build expertise step by step.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {certificationRoadmaps.map((roadmap, ri) => (
          <div key={ri} className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-3 h-12 rounded-full bg-gradient-to-b ${roadmap.gradient}`} />
              <div>
                <h3 className="text-xl font-bold text-white">{roadmap.name}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{roadmap.description}</p>
              </div>
            </div>

            <div className="relative">
              {roadmap.steps.map((step, si) => {
                const cert = findCert(step.certName);
                const isLast = si === roadmap.steps.length - 1;
                const color = cert ? levelBubbleStyles[cert.level] : 'bg-gray-500';

                return (
                  <div key={si} className="relative flex gap-4 pb-6 last:pb-0">
                    {!isLast && (
                      <div className="absolute left-[17px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-gray-700 to-gray-800" />
                    )}

                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-gray-900`}>
                        {si + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-100">{step.certName}</span>
                        {cert && (
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${levelStyles[cert.level]}`}>
                            {cert.level}
                          </span>
                        )}
                      </div>
                      {step.note && (
                        <p className="text-xs text-gray-500 mt-0.5 italic">{step.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FourYearPlanSection: React.FC = () => {
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 flex items-center gap-4">
        4-Year Certification Roadmap
        <div className="h-[2px] flex-1 bg-gradient-to-r from-green-500/40 to-cyan-500/40 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
        </div>
      </h2>
      <p className="text-gray-400 mb-8 text-sm max-w-2xl">
        Recommended certification journey across a 4-year degree program — from foundation to expert level.
      </p>

      <div className="relative">
        {/* Central timeline line */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-green-500/40 via-cyan-500/40 to-purple-500/40 -translate-x-1/2" />

        {fourYearPlan.map((plan, yi) => {
          const isLeft = yi % 2 === 0;
          return (
            <div key={yi} className="relative mb-8 last:mb-0">
              <div className={`flex flex-col lg:flex-row items-start gap-6 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Year badge */}
                <div className={`lg:w-1/2 flex ${isLeft ? 'lg:justify-end' : 'lg:justify-start'}`}>
                  <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-5 lg:p-6 w-full lg:max-w-lg shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${plan.gradient}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                            {plan.year}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${plan.gradient} text-white`}>
                            {plan.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {plan.certs.map((cert, ci) => (
                        <div key={ci} className="flex items-start gap-3 bg-gray-800/40 rounded-xl p-3 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold mt-0.5 flex-shrink-0 ${cert.level === 'Beginner' ? 'bg-green-600' : cert.level === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                            {ci + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-gray-100">{cert.name}</span>
                              <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${levelStyles[cert.level]}`}>
                                {cert.level}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{cert.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center connector dot (desktop only) */}
                <div className="hidden lg:flex lg:w-0 items-center justify-center relative">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-b ${plan.gradient} ring-4 ring-gray-950 z-10 flex-shrink-0`} />
                </div>

                {/* Empty space on the other side */}
                <div className="hidden lg:block lg:w-1/2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CertificationsPage: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = selectedCert ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedCert]);

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Award className="w-10 h-10 text-cyan-500" /> Professional Certifications Vault
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore globally recognized certifications across cybersecurity,
          cloud platforms, networking, and governance.
        </p>
      </section>

      {/* Certification Categories */}
      <div className="space-y-14">
        {certificationsData.map((category, idx) => (
          <CategorySection
            key={idx}
            title={category.title}
            certifications={category.certifications}
            onSelectCert={setSelectedCert}
          />
        ))}
      </div>

      {/* Roadmaps */}
      <RoadmapSection />

      {/* 4-Year Plan */}
      <FourYearPlanSection />

      {/* Popup Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCert(null)} />

          <div
            className="bg-gradient-to-b from-gray-900 to-gray-950 border border-cyan-500/30 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] z-10 ring-1 ring-white/10 overflow-hidden"
            style={{ animation: 'cardFloat 0.4s ease-out forwards' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group z-20"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pr-10 relative z-10">
              {selectedCert.badgeUrl ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-2xl group-hover:bg-cyan-400/30 transition-colors" />
                  <img
                    src={selectedCert.badgeUrl}
                    alt={`${selectedCert.name} badge`}
                    className="w-24 h-24 object-contain bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-gray-700/50 shadow-lg relative z-10"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-2xl group-hover:bg-cyan-400/30 transition-colors" />
                  <div className="w-24 h-24 bg-gray-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-cyan-400 border border-gray-700/50 shadow-lg relative z-10">
                    <Award className="w-12 h-12" />
                  </div>
                </div>
              )}

              <div>
                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-full inline-block mb-3 shadow-inner ${
                  selectedCert.level === 'Beginner' ? 'bg-green-900/40 text-green-400 border border-green-500/30' :
                  selectedCert.level === 'Intermediate' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-900/40 text-red-400 border border-red-500/30'
                }`}>
                  {levelIcons[selectedCert.level]} {selectedCert.level}
                </span>
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight mb-2">
                  {selectedCert.name}
                </h3>
                <p className="text-cyan-400 text-sm font-semibold tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {selectedCert.organization}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-gray-300 relative z-10">
              <div className="bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-gray-700/50 shadow-inner">
                <span className="text-cyan-500/80 flex items-center gap-2 uppercase text-xs font-bold tracking-widest block mb-3">
                  At a Glance
                </span>
                <p className="leading-relaxed text-[15px]">{selectedCert.shortDesc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-gray-700/50 shadow-inner group hover:bg-gray-800/60 transition-colors">
                  <span className="text-gray-400 uppercase text-[10px] font-bold tracking-widest block mb-2 group-hover:text-cyan-400 transition-colors">
                    Exam Details
                  </span>
                  <span className="text-white font-medium block">{selectedCert.exam}</span>
                </div>
                <div className="bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-gray-700/50 shadow-inner group hover:bg-gray-800/60 transition-colors">
                  <span className="text-gray-400 uppercase text-[10px] font-bold tracking-widest block mb-2 group-hover:text-cyan-400 transition-colors">
                    Recommended Prep
                  </span>
                  <span className="text-white font-medium block">{selectedCert.prep}</span>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-gray-700/50 shadow-inner group hover:bg-gray-800/60 transition-colors">
                <span className="text-gray-400 uppercase text-[10px] font-bold tracking-widest block mb-2 group-hover:text-cyan-400 transition-colors">
                  Target Career Roles
                </span>
                <span className="text-gray-100 font-medium">{selectedCert.roles}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/80 relative z-10">
              <button
                onClick={() => setSelectedCert(null)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-50 font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.7)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Close Details
              </button>
            </div>

            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes cardFloat {
                0% { opacity: 0; transform: scale(0.95) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;
