import React, { useState } from 'react';
import { Search, MapPin, Building2, TestTube, ChevronRight, Globe, Shield } from 'lucide-react';

const labs = [
  { name: "CYBERSENTINAL", type: "Student Community / Initiative", location: "Global / Online", desc: "Cybersecurity Hackathons, CTF, Projects, and Certifications portal." },
  { name: "MIT Lincoln Laboratory Cyber Security and Information Sciences Division", type: "Research Division", location: "Lexington, Massachusetts, USA", desc: "Advanced cybersecurity research, cyber resilience, threat detection, system security" },
  { name: "Carnegie Mellon University CyLab", type: "University Research", location: "Pittsburgh, Pennsylvania, USA", desc: "Cybersecurity, privacy, cyber-physical systems" },
  { name: "Stanford Security Lab", type: "University Research", location: "Stanford, California, USA", desc: "Secure systems, cryptography, network security" },
  { name: "Oxford Cyber Security Centre", type: "University Research", location: "Oxford, UK", desc: "Interdisciplinary research on cybersecurity challenges, policies, technologies" },
  { name: "University of Cambridge Computer Laboratory Security Group", type: "University Research", location: "Cambridge, UK", desc: "Systems security (hardware, software, network)" },
  { name: "Imperial College London Institute for Security Science and Technology (ISST)", type: "University Research", location: "London, UK", desc: "Interdisciplinary research on cybersecurity challenges" },
  { name: "Georgia Tech Information Security Center (GTISC)", type: "University Research", location: "Atlanta, Georgia, USA", desc: "Cybersecurity threats, countermeasures, policy development" },
  { name: "Purdue University CERIAS", type: "University Research", location: "West Lafayette, Indiana, USA", desc: "Network security, digital forensics" },
  { name: "ETH Zurich Information Security and Privacy Center", type: "University Research", location: "Zurich, Switzerland", desc: "Cryptographic protocols, secure systems, privacy-enhancing technologies" },
  { name: "National Security Agency (NSA) Research Directorate", type: "Gov Research", location: "Fort Meade, Maryland, USA", desc: "Cryptography, information assurance, cybersecurity research" },
  { name: "SRI International Computer Science Laboratory (CSL)", type: "Independent Research", location: "Menlo Park, California, USA", desc: "Intrusion detection, secure software development" },
  { name: "University of California, Berkeley - Berkeley Lab Cyber Security Research", type: "University Research", location: "Berkeley, California, USA", desc: "Securing cyber-physical systems, critical infrastructure" },
  { name: "Lawrence Livermore National Laboratory (LLNL) Cyber Security Division", type: "Gov/National Lab", location: "Livermore, California, USA", desc: "Cybersecurity solutions for national security and critical infrastructure protection" },
  { name: "National Institute of Standards and Technology (NIST) Cybersecurity", type: "Gov Research", location: "Gaithersburg, Maryland, USA", desc: "Cybersecurity standards, guidelines, frameworks" },
  { name: "Los Alamos National Laboratory (LANL) Cybersecurity Group", type: "Gov/National Lab", location: "Los Alamos, New Mexico, USA", desc: "National security challenges, cybersecurity, data protection" },
  { name: "Centre for Secure Information Technologies (CSIT) at Queen’s University Belfast", type: "University Research", location: "Belfast, Northern Ireland", desc: "Network security, cyber-physical systems" },
  { name: "University of Maryland, College Park - Maryland Cybersecurity Center (MC2)", type: "University Research", location: "College Park, Maryland, USA", desc: "Cryptography, secure software" },
  { name: "KTH Royal Institute of Technology Cybersecurity Lab", type: "University Research", location: "Stockholm, Sweden", desc: "Network security, secure communications, privacy" },
  { name: "Cybersecurity Research Center at Ben-Gurion University of the Negev", type: "University Research", location: "Beersheba, Israel", desc: "Cybersecurity threats, countermeasures, cyber defense strategies" },
  { name: "University of Southern California (USC) Information Sciences Institute (ISI)", type: "University Research", location: "Marina del Rey, California, USA", desc: "Cybersecurity, artificial intelligence, network security" },
  { name: "Friedrich-Alexander University Erlangen-Nürnberg (FAU) - IT Security Infrastructures Lab", type: "University Research", location: "Erlangen, Germany", desc: "Cryptographic protocols, network security, privacy protection" },
  { name: "INRIA - French Institute for Research in Computer Science and Automation", type: "Institute", location: "France", desc: "Cryptography, secure software engineering" },
  { name: "Nanyang Technological University (NTU) - Cyber Security Research Centre", type: "University Research", location: "Singapore", desc: "Cybersecurity for critical infrastructure, IoT, secure communications" },
  { name: "Cybersecurity Research Lab at University of Waterloo", type: "University Research", location: "Waterloo, Canada", desc: "Cryptography, secure systems, privacy" },
  { name: "Australian National University - Cyber Institute", type: "University Research", location: "Canberra, Australia", desc: "Cybersecurity challenges, national security, cyber policy" },
  { name: "Tokyo Institute of Technology - Cybersecurity Research Group", type: "University Research", location: "Tokyo, Japan", desc: "Secure communication, cryptographic protocols, privacy" },
  { name: "National University of Singapore - Centre for Cyber Security", type: "University Research", location: "Singapore", desc: "Interdisciplinary research in cybersecurity, privacy, cryptography" },
  { name: "University of Edinburgh - Cyber Security and Privacy Group", type: "University Research", location: "Edinburgh, Scotland", desc: "Secure systems, cryptographic methods, privacy protection" },
  { name: "University of Texas at San Antonio - Center for Infrastructure Assurance and Security (CIAS)", type: "University Research", location: "San Antonio, Texas, USA", desc: "Cybersecurity research and education, infrastructure protection" },
  { name: "University of Melbourne - Oceania Cyber Security Centre (OCSC)", type: "University Research", location: "Melbourne, Australia", desc: "Cybersecurity research, education, industry collaboration" }
];

const ResearchLabsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLabs = labs.filter(
    (lab) =>
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
            <TestTube className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Cybersecurity <span className="text-cyan-600 dark:text-cyan-500">Research Labs</span></h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Explore top-tier cybersecurity research facilities, institutes, and academic centers driving the future of information security globally.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search research labs by name, location, or topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-6 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-shadow text-gray-900 dark:text-white placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.length > 0 ? (
          filteredLabs.map((lab, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all group flex flex-col h-full shadow-sm hover:shadow-md dark:shadow-none">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug text-gray-900 dark:text-white">{lab.name}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">{lab.desc}</p>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Building2 className="w-4 h-4 text-cyan-500/70" />
                    <span>{lab.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Globe className="w-4 h-4 text-cyan-500/70" />
                    <span>{lab.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Shield className="w-12 h-12 text-gray-300 dark:text-gray-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Research Labs Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchLabsPage;
