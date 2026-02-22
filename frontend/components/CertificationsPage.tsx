import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Certification {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  shortDesc: string;
  organization: string;
  exam: string;
  prep: string;
  roles: string;
}

interface CategoryProps {
  title: string;
  certifications: Certification[];
}

const Category: React.FC<CategoryProps> = ({ title, certifications }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const levelStyles = {
    Beginner:
      "bg-green-900/20 text-green-400 border border-green-500/20",
    Intermediate:
      "bg-yellow-900/20 text-yellow-400 border border-yellow-500/20",
    Advanced:
      "bg-red-900/20 text-red-400 border border-red-500/20",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-cyan-500">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/40 transition-all"
          >
            <span
              className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${levelStyles[cert.level]}`}
            >
              {cert.level}
            </span>

            <h3 className="text-xl font-bold mt-4 mb-2">{cert.name}</h3>

            <p className="text-gray-400 text-sm mb-4">
              {cert.shortDesc}
            </p>

            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-sm font-semibold transition-colors"
            >
              {openIndex === i ? "Hide Details" : "View Certification"}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === i && (
              <div className="mt-6 pt-6 border-t border-gray-800 space-y-4 text-sm text-gray-400">
                <div>
                  <span className="text-gray-500 uppercase text-xs block mb-1">
                    Issuing Organization
                  </span>
                  {cert.organization}
                </div>

                <div>
                  <span className="text-gray-500 uppercase text-xs block mb-1">
                    Exam Details
                  </span>
                  {cert.exam}
                </div>

                <div>
                  <span className="text-gray-500 uppercase text-xs block mb-1">
                    Recommended Prep Time
                  </span>
                  {cert.prep}
                </div>

                <div>
                  <span className="text-gray-500 uppercase text-xs block mb-1">
                    Career Roles
                  </span>
                  {cert.roles}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CertificationsPage: React.FC = () => {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Professional Certifications Vault
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore globally recognized certifications across cybersecurity,
          cloud security, system administration, and governance.
        </p>
      </section>

      <div className="space-y-14">

        <Category
          title="Cybersecurity Core"
          certifications={[
            {
              name: "CompTIA Security+",
              level: "Beginner",
              shortDesc: "Foundational certification covering core security concepts.",
              organization: "CompTIA",
              exam: "SY0-701 | 90 Questions | 90 Minutes",
              prep: "2–3 Months",
              roles: "SOC Analyst, Security Administrator"
            },
            {
              name: "Certified Ethical Hacker (CEH)",
              level: "Intermediate",
              shortDesc: "Penetration testing tools and techniques.",
              organization: "EC-Council",
              exam: "125 Questions | 4 Hours",
              prep: "3–4 Months",
              roles: "Penetration Tester, Red Team Analyst"
            },
            {
              name: "CISSP",
              level: "Advanced",
              shortDesc: "Enterprise security leadership certification.",
              organization: "(ISC)²",
              exam: "125–175 Questions | CAT Format",
              prep: "4–6 Months",
              roles: "Security Architect, CISO"
            }
          ]}
        />

        <Category
          title="Cloud Security"
          certifications={[
            {
              name: "AWS Security Specialty",
              level: "Advanced",
              shortDesc: "Advanced AWS cloud security practices.",
              organization: "Amazon Web Services",
              exam: "65 Questions | 170 Minutes",
              prep: "3–4 Months",
              roles: "Cloud Security Engineer"
            },
            {
              name: "Azure Security Engineer",
              level: "Intermediate",
              shortDesc: "Security implementation in Azure environments.",
              organization: "Microsoft",
              exam: "SC-300 | 120 Minutes",
              prep: "3 Months",
              roles: "Azure Security Engineer"
            }
          ]}
        />

        <Category
          title="System Administration"
          certifications={[
            {
              name: "RHCSA",
              level: "Intermediate",
              shortDesc: "Linux system administration expertise.",
              organization: "Red Hat",
              exam: "EX200 | Practical Lab Exam",
              prep: "3 Months",
              roles: "Linux Administrator"
            }
          ]}
        />

      </div>
    </div>
  );
};

export default CertificationsPage;
