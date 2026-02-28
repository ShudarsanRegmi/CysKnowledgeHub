import React, { useState } from "react";
import { X, Award } from "lucide-react";

import { Certification, certificationsData } from "../certificationsData";

interface CategoryProps {
  title: string;
  certifications: Certification[];
  onSelectCert: (cert: Certification) => void;
}

const Category: React.FC<CategoryProps> = ({ title, certifications, onSelectCert }) => {
  const levelStyles = {
    Beginner: "bg-green-900/20 text-green-400 border border-green-500/20",
    Intermediate: "bg-yellow-900/20 text-yellow-400 border border-yellow-500/20",
    Advanced: "bg-red-900/20 text-red-400 border border-red-500/20",
  };

  const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const sortedCerts = [...certifications].sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-cyan-500">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCerts.map((cert, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/40 transition-all flex flex-col items-start shadow-sm hover:shadow-cyan-900/20 hover:shadow-lg"
          >
            <div className="flex justify-between w-full items-start mb-4">
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${levelStyles[cert.level]}`}>
                {cert.level}
              </span>
              {cert.badgeUrl ? (
                <img
                  src={cert.badgeUrl}
                  alt={`${cert.name} badge`}
                  className="w-12 h-12 object-contain bg-white/5 rounded-md p-1 border border-gray-800"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center text-gray-500 border border-gray-700">
                  <Award className="w-6 h-6" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2">{cert.name}</h3>

            <p className="text-gray-400 text-sm mb-4 flex-grow">
              {cert.shortDesc}
            </p>

            <button
              onClick={() => onSelectCert(cert)}
              className="w-full flex items-center justify-center gap-2 py-2 mt-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-sm font-semibold transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CertificationsPage: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);


  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Award className="w-10 h-10 text-cyan-500" /> Professional Certifications Vault
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore globally recognized certifications across cybersecurity,
          cloud security, system administration, and governance.
        </p>
      </section>

      <div className="space-y-14">
        {certificationsData.map((category, idx) => (
          <Category
            key={idx}
            title={category.title}
            certifications={category.certifications}
            onSelectCert={setSelectedCert}
          />
        ))}
      </div>

      {/* Popup Modal for Certification Details */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
          {/* Modal Overlay / Backdrop Click */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCert(null)}></div>

          <div
            className="bg-gradient-to-b from-gray-900 to-gray-950 border border-cyan-500/30 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] z-10 ring-1 ring-white/10 overflow-hidden"
            style={{ animation: 'cardFloat 0.4s ease-out forwards' }}
          >
            {/* Subtle glow effect behind the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group z-20"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pr-10 relative z-10">
              {selectedCert.badgeUrl ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-2xl group-hover:bg-cyan-400/30 transition-colors"></div>
                  <img
                    src={selectedCert.badgeUrl}
                    alt={`${selectedCert.name} badge`}
                    className="w-24 h-24 object-contain bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-gray-700/50 shadow-lg relative z-10"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-2xl group-hover:bg-cyan-400/30 transition-colors"></div>
                  <div className="w-24 h-24 bg-gray-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-cyan-400 border border-gray-700/50 shadow-lg relative z-10">
                    <Award className="w-12 h-12" />
                  </div>
                </div>
              )}

              <div>
                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-full inline-block mb-3 shadow-inner ${selectedCert.level === 'Beginner' ? 'bg-green-900/40 text-green-400 border border-green-500/30' :
                    selectedCert.level === 'Intermediate' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-900/40 text-red-400 border border-red-500/30'
                  }`}>
                  {selectedCert.level} Level
                </span>
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight mb-2">
                  {selectedCert.name}
                </h3>
                <p className="text-cyan-400 text-sm font-semibold tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
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
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.7)] hover:-translate-y-0.5 active:translate-y-0"
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
