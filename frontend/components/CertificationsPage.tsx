import React, { useState } from "react";
import { X, Award } from "lucide-react";

interface Certification {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  shortDesc: string;
  organization: string;
  exam: string;
  prep: string;
  roles: string;
  badgeUrl?: string; // Badges for certifications
}

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

  // Large database of certifications
  const categories = [
    {
      title: "Cybersecurity Core",
      certifications: [
        {
          name: "CompTIA Security+",
          level: "Beginner",
          shortDesc: "Foundational certification covering core security concepts.",
          organization: "CompTIA",
          exam: "SY0-701 | 90 Questions | 90 Minutes",
          prep: "2–3 Months",
          roles: "SOC Analyst, Security Administrator",
          badgeUrl: "https://www.comptia.org/_next/image/?url=https%3A%2F%2Fimages.cmp.optimizely.com%2F8623b0fab71111efac96d615e91762a5&w=256&q=90"
        },
        {
          name: "CompTIA CySA+",
          level: "Intermediate",
          shortDesc: "Cybersecurity Analyst focusing on defense and incident response.",
          organization: "CompTIA",
          exam: "CS0-003 | 85 Questions | 165 Minutes",
          prep: "3–4 Months",
          roles: "Security Analyst, Threat Hunter",
          badgeUrl: "https://easy-prep.org/wp-content/uploads/2025/06/comptia-cysa-certification.jpg"
        },
        {
          name: "CISSP",
          level: "Advanced",
          shortDesc: "Enterprise security leadership certification.",
          organization: "(ISC)²",
          exam: "125–175 Questions | CAT Format | 4 Hours",
          prep: "4–6 Months",
          roles: "Security Architect, CISO",
          badgeUrl: "https://termly.io/wp-content/uploads/CISSP-logo.webp"
        }
      ] as Certification[]
    },
    {
      title: "Offensive Security (Red Team)",
      certifications: [
        {
          name: "eJPT",
          level: "Beginner",
          shortDesc: "100% practical junior penetration testing certification.",
          organization: "INE",
          exam: "Practical Lab | 48 Hours",
          prep: "1–2 Months",
          roles: "Junior Penetration Tester",
          badgeUrl: "https://ih1.redbubble.net/image.5304187844.3896/st,small,507x507-pad,600x600,f8f8f8.jpg"
        },
        {
          name: "Certified Ethical Hacker (CEH)",
          level: "Intermediate",
          shortDesc: "Penetration testing tools and techniques.",
          organization: "EC-Council",
          exam: "125 Questions | 4 Hours",
          prep: "3–4 Months",
          roles: "Penetration Tester, Red Team Analyst",
          badgeUrl: "https://assets.website-files.com/611d71e2f411757883bc9bb5/616dd9d2cbea0f25d4b95837_ceh-small.png"
        },
        {
          name: "OSCP",
          level: "Advanced",
          shortDesc: "Rigorous hands-on offensive security certification.",
          organization: "OffSec",
          exam: "Practical Lab | 24 Hours + Report",
          prep: "4–8 Months",
          roles: "Senior Penetration Tester",
          badgeUrl: "https://asktraining.com.sg/wp-content/uploads/2025/02/OSCP.png"
        }
      ] as Certification[]
    },
    {
      title: "Defensive Security (Blue Team)",
      certifications: [
        {
          name: "BTL1",
          level: "Beginner",
          shortDesc: "Practical blue team certification covering SOC essentials.",
          organization: "Security Blue Team",
          exam: "Practical Lab | 24 Hours",
          prep: "2–3 Months",
          roles: "Level 1 SOC Analyst",
          badgeUrl: "https://d2y9h8w1ydnujs.cloudfront.net/uploads/certs/ce4c8e7e05d1338accdf7ecd761488acd28a6f39.png"
        },
        {
          name: "GIAC Certified Incident Handler (GCIH)",
          level: "Advanced",
          shortDesc: "Top-tier incident handling and response certification.",
          organization: "GIAC / SANS",
          exam: "106 Questions | 4 Hours",
          prep: "3–4 Months",
          roles: "Incident Responder",
          badgeUrl: "https://tailwindit.co/hubfs/Certs/gcih-1.png"
        },
      ] as Certification[]
    },
    {
      title: "Cloud Security",
      certifications: [
        {
          name: "CCSK",
          level: "Beginner",
          shortDesc: "Certificate of Cloud Security Knowledge.",
          organization: "Cloud Security Alliance",
          exam: "60 Questions | 90 Minutes",
          prep: "1–2 Months",
          roles: "Cloud Security Analyst",
          badgeUrl: "https://images.credly.com/images/4377e6e3-3297-4e3a-b8b8-e1ae89b8b0a8/image.png"
        },
        {
          name: "Azure Security Engineer",
          level: "Intermediate",
          shortDesc: "Security implementation in Azure environments.",
          organization: "Microsoft",
          exam: "SC-300 | 120 Minutes",
          prep: "2-3 Months",
          roles: "Azure Security Engineer",
          badgeUrl: "https://images.credly.com/images/1ad16b6f-2c71-4a2e-ae74-ec69c4766039/azure-security-engineer-associate600x600.png"
        },
        {
          name: "AWS Security Specialty",
          level: "Advanced",
          shortDesc: "Advanced AWS cloud security practices.",
          organization: "Amazon Web Services",
          exam: "65 Questions | 170 Minutes",
          prep: "3–4 Months",
          roles: "Cloud Security Engineer",
          badgeUrl: "https://images.credly.com/images/53acdae5-d69f-4dda-b650-d02ed7a50dd7/image.png"
        }
      ] as Certification[]
    },
    {
      title: "Governance, Risk & Compliance (GRC)",
      certifications: [
        {
          name: "CISA",
          level: "Intermediate",
          shortDesc: "Globally recognized IS audit control certification.",
          organization: "ISACA",
          exam: "150 Questions | 4 Hours",
          prep: "3–4 Months",
          roles: "IT Auditor, Compliance Analyst",
          badgeUrl: "https://images.credly.com/images/d8b54d17-692a-4151-8e2e-e3c8c1a89ec1/twitter_thumb_201604_b415cf50edc1955df11b9046c68b7e2debbd41f1.png"
        },
        {
          name: "CISM",
          level: "Advanced",
          shortDesc: "Information security management and governance.",
          organization: "ISACA",
          exam: "150 Questions | 4 Hours",
          prep: "3–5 Months",
          roles: "Information Security Manager",
          badgeUrl: "https://www.pass4sure.com/design/images/logos/topcerts/cism.png"
        }
      ] as Certification[]
    },
    {
      title: "Networking & System Administration",
      certifications: [
        {
          name: "CompTIA Network+",
          level: "Beginner",
          shortDesc: "Foundational networking principles and implementations.",
          organization: "CompTIA",
          exam: "N10-008 | 90 Questions | 90 Minutes",
          prep: "2-3 Months",
          roles: "Network Administrator",
          badgeUrl: "https://www.comptia.org/_next/image/?url=https%3A%2F%2Fimages.cmp.optimizely.com%2F893bb620b71111ef888eca5646afc7d8&w=256&q=90"
        },
        {
          name: "RHCSA",
          level: "Intermediate",
          shortDesc: "Core system administration skills in Red Hat environments.",
          organization: "Red Hat",
          exam: "EX200 | Practical Lab Exam | 3 Hours",
          prep: "3 Months",
          roles: "Linux System Administrator",
          badgeUrl: "https://osec.pl/wp-content/uploads/2025/05/logo-redhat-kapelusz-400x300-1.jpeg"
        }
      ] as Certification[]
    }
  ];

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
        {categories.map((category, idx) => (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          {/* Modal Overlay / Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedCert(null)}></div>

          <div className="bg-gray-900 border border-cyan-500/50 rounded-2xl p-6 md:p-8 w-full max-w-xl relative shadow-2xl shadow-cyan-900/20 z-10 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pr-8">
              {selectedCert.badgeUrl ? (
                <img
                  src={selectedCert.badgeUrl}
                  alt={`${selectedCert.name} badge`}
                  className="w-20 h-20 object-contain bg-white/5 rounded-xl p-2 border border-gray-800"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center text-cyan-500 border border-gray-700">
                  <Award className="w-10 h-10" />
                </div>
              )}

              <div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded inline-block mb-2 bg-gray-800 text-gray-300 border border-gray-700`}>
                  {selectedCert.level} Level
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight mb-1">{selectedCert.name}</h3>
                <p className="text-cyan-400 text-sm font-medium">{selectedCert.organization}</p>
              </div>
            </div>

            <div className="space-y-5 text-sm text-gray-300">
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider block mb-2">
                  At a Glance
                </span>
                <p className="leading-relaxed">{selectedCert.shortDesc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <span className="text-gray-500 uppercase text-xs font-bold tracking-wider block mb-2">
                    Exam Details
                  </span>
                  <span className="text-white">{selectedCert.exam}</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <span className="text-gray-500 uppercase text-xs font-bold tracking-wider block mb-2">
                    Recommended Prep
                  </span>
                  <span className="text-white">{selectedCert.prep}</span>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider block mb-2">
                  Target Career Roles
                </span>
                <span className="text-white">{selectedCert.roles}</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setSelectedCert(null)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;
