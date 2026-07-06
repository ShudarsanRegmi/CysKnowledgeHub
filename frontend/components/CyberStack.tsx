import React, { useState, useMemo } from 'react';
import {
  Globe, Terminal, Monitor, BookOpen, Beaker, ExternalLink,
  Star, Search, Shield, Swords, Target, Zap, Server,
  Wifi, Lock, Code, Signal, Database, Cpu, Layers, Cloud,
  BookText, Youtube, FileJson, Smartphone, Crosshair, Bug, FlaskConical,
  Eye, Hash, Paintbrush,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Resource {
  name: string;
  domain: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

const ALL_RESOURCES: Resource[] = [
  // ── Practice Platforms ──
  { name: 'TryHackMe', domain: 'tryhackme.com', description: 'Gamified cybersecurity training with guided rooms for all skill levels.', difficulty: 'Beginner', category: 'Practice Platforms' },
  { name: 'Hack The Box', domain: 'hackthebox.com', description: 'Realistic penetration testing labs and CTF challenges.', difficulty: 'Intermediate', category: 'Practice Platforms' },
  { name: 'PortSwigger', domain: 'portswigger.net', description: 'Free web security academy with 200+ labs covering all OWASP Top 10.', difficulty: 'Beginner', category: 'Practice Platforms' },
  { name: 'PicoCTF', domain: 'picoctf.org', description: 'Free CTF competition platform designed for beginners by Carnegie Mellon.', difficulty: 'Beginner', category: 'Practice Platforms' },
  { name: 'PentesterLab', domain: 'pentesterlab.com', description: 'Hands-on web security exercises ranging from basic to advanced.', difficulty: 'Intermediate', category: 'Practice Platforms' },
  { name: 'HackerOne CTF', domain: 'hacker101.com', description: 'Free CTF platform by HackerOne with video lessons and challenges.', difficulty: 'Intermediate', category: 'Practice Platforms' },
  { name: 'Root-Me', domain: 'root-me.org', description: '400+ challenges across web, crypto, forensics, reverse engineering.', difficulty: 'Intermediate', category: 'Practice Platforms' },
  { name: 'Defend the Web', domain: 'defendtheweb.net', description: 'Interactive security challenges with attack and defense scenarios.', difficulty: 'Beginner', category: 'Practice Platforms' },
  { name: 'CTFtime', domain: 'ctftime.org', description: 'CTF event calendar, team rankings, and writeup archive for competitions worldwide.', difficulty: 'Beginner', category: 'Practice Platforms' },
  { name: 'OverTheWire', domain: 'overthewire.org', description: 'Wargame-style challenges to learn Linux and security concepts through play.', difficulty: 'Beginner', category: 'Practice Platforms' },

  // ── Essential Tools ──
  { name: 'Burp Suite', domain: 'portswigger.net', description: 'Industry-standard web vulnerability scanner and proxy for penetration testing.', difficulty: 'Intermediate', category: 'Essential Tools' },
  { name: 'Wireshark', domain: 'wireshark.org', description: 'Network protocol analyzer used worldwide for traffic inspection and forensics.', difficulty: 'Beginner', category: 'Essential Tools' },
  { name: 'Nmap', domain: 'nmap.org', description: 'Network discovery and security auditing tool for port scanning and enumeration.', difficulty: 'Beginner', category: 'Essential Tools' },
  { name: 'Metasploit', domain: 'metasploit.com', description: 'Penetration testing framework with 2000+ exploits for vulnerability validation.', difficulty: 'Intermediate', category: 'Essential Tools' },
  { name: 'SQLMap', domain: 'sqlmap.org', description: 'Automated SQL injection detection and exploitation tool.', difficulty: 'Intermediate', category: 'Essential Tools' },
  { name: 'John the Ripper', domain: 'openwall.com/john', description: 'Fast password cracking tool supporting hundreds of hash types.', difficulty: 'Intermediate', category: 'Essential Tools' },
  { name: 'Hashcat', domain: 'hashcat.net', description: 'GPU-accelerated password recovery tool — the fastest hash cracker available.', difficulty: 'Advanced', category: 'Essential Tools' },
  { name: 'Ghidra', domain: 'ghidra-sre.org', description: 'NSA-developed reverse engineering framework with decompiler and analysis tools.', difficulty: 'Advanced', category: 'Essential Tools' },
  { name: 'Impacket', domain: 'github.com/SecureAuthCorp/impacket', description: 'Python collection for working with network protocols, SMB, Kerberos, and AD attacks.', difficulty: 'Advanced', category: 'Essential Tools' },
  { name: 'BloodHound', domain: 'bloodhound.readthedocs.io', description: 'Active Directory attack path visualisation and analysis tool.', difficulty: 'Intermediate', category: 'Essential Tools' },

  // ── Operating Systems ──
  { name: 'Kali Linux', domain: 'kali.org', description: 'The standard Debian-based distro for penetration testing with 600+ pre-installed tools.', difficulty: 'Intermediate', category: 'Operating Systems' },
  { name: 'Parrot OS', domain: 'parrotsec.org', description: 'Security-focused distribution with tools for forensics, development, and anonymity.', difficulty: 'Intermediate', category: 'Operating Systems' },
  { name: 'Ubuntu', domain: 'ubuntu.com', description: 'Most popular Linux distribution — essential foundation for all cybersecurity work.', difficulty: 'Beginner', category: 'Operating Systems' },
  { name: 'Windows Server', domain: 'microsoft.com', description: 'Critical for understanding Active Directory, Group Policy, and enterprise environments.', difficulty: 'Intermediate', category: 'Operating Systems' },
  { name: 'REMnux', domain: 'remnux.org', description: 'Linux toolkit for reverse-engineering and analysing malicious software.', difficulty: 'Advanced', category: 'Operating Systems' },

  // ── Learning Materials ──
  { name: 'OWASP Top 10', domain: 'owasp.org', description: 'Essential reading on the most critical web application security risks.', difficulty: 'Beginner', category: 'Learning Materials' },
  { name: 'MITRE ATT&CK', domain: 'attack.mitre.org', description: 'Knowledge base of adversary tactics and techniques from real-world observations.', difficulty: 'Intermediate', category: 'Learning Materials' },
  { name: 'IppSec', domain: 'youtube.com/@ippsec', description: 'Detailed HTB walkthroughs explaining every command and concept in depth.', difficulty: 'Intermediate', category: 'Learning Materials' },
  { name: 'The Cyber Mentor', domain: 'youtube.com/@thecybermentor', description: 'Practical pentesting courses from beginner to advanced with real-world demos.', difficulty: 'Beginner', category: 'Learning Materials' },
  { name: 'Professor Messer', domain: 'professormesser.com', description: 'Free CompTIA Security+ and Network+ training videos covering foundational concepts.', difficulty: 'Beginner', category: 'Learning Materials' },
  { name: 'HackTricks', domain: 'book.hacktricks.xyz', description: 'Comprehensive wiki of pentesting techniques, cheatsheets, and bypass methods.', difficulty: 'Intermediate', category: 'Learning Materials' },
  { name: 'GTFOBins', domain: 'gtfobins.github.io', description: 'Curated list of Unix binaries that can be exploited for privilege escalation.', difficulty: 'Intermediate', category: 'Learning Materials' },
  { name: 'LOLBAS', domain: 'lolbas-project.github.io', description: 'Windows binaries useful for Living Off The Land and post-exploitation.', difficulty: 'Advanced', category: 'Learning Materials' },
  { name: 'PayloadsAllTheThings', domain: 'github.com/swisskyrepo/PayloadsAllTheThings', description: 'Extensive collection of payloads and bypass techniques for web security testing.', difficulty: 'Intermediate', category: 'Learning Materials' },
  { name: 'Cybrary', domain: 'cybrary.it', description: 'Free and paid cybersecurity courses covering certs, tools, and career paths.', difficulty: 'Beginner', category: 'Learning Materials' },

  // ── Practice Labs ──
  { name: 'VulnHub', domain: 'vulnhub.com', description: 'Free vulnerable virtual machines for hands-on penetration testing practice.', difficulty: 'Intermediate', category: 'Practice Labs' },
  { name: 'DVWA', domain: 'dvwa.co.uk', description: 'Damn Vulnerable Web Application — deliberately vulnerable PHP/MySQL app.', difficulty: 'Beginner', category: 'Practice Labs' },
  { name: 'Juice Shop', domain: 'owasp.org/www-project-juice-shop', description: 'Modern vulnerable web application covering all OWASP Top 10 vulnerabilities.', difficulty: 'Beginner', category: 'Practice Labs' },
  { name: 'Blue Team Labs', domain: 'blueteamlabs.online', description: 'SOC simulation and incident response challenges for blue team practice.', difficulty: 'Intermediate', category: 'Practice Labs' },
  { name: 'LetsDefend', domain: 'letsdefend.io', description: 'Blue team training with real SOC alerts and investigation scenarios.', difficulty: 'Intermediate', category: 'Practice Labs' },
  { name: 'TryHackMe SOC Path', domain: 'tryhackme.com/path/outline/soc', description: 'Structured SOC analyst learning path with 70+ rooms and simulated alerts.', difficulty: 'Beginner', category: 'Practice Labs' },
  { name: 'Pentester Academy', domain: 'pentesteracademy.com', description: 'Hands-on labs for web, network, cloud, and wireless security testing.', difficulty: 'Intermediate', category: 'Practice Labs' },

  // ── Cloud & DevOps Security ──
  { name: 'FlAWS.cloud', domain: 'flaws.cloud', description: 'CTF-style AWS security challenges by Sumo Logic — learn cloud pentesting.', difficulty: 'Intermediate', category: 'Cloud & DevOps Security' },
  { name: 'CloudGoat', domain: 'github.com/RhinoSecurityLabs/cloudgoat', description: 'Deliberately vulnerable AWS infrastructure for practising cloud security.', difficulty: 'Intermediate', category: 'Cloud & DevOps Security' },
  { name: 'Docker', domain: 'docker.com', description: 'Container platform essential for creating reproducible lab environments at scale.', difficulty: 'Beginner', category: 'Cloud & DevOps Security' },
  { name: 'Kubernetes', domain: 'kubernetes.io', description: 'Container orchestration — critical for securing modern cloud-native deployments.', difficulty: 'Advanced', category: 'Cloud & DevOps Security' },
  { name: 'Terraform', domain: 'terraform.io', description: 'Infrastructure-as-code tool for provisioning and managing cloud environments securely.', difficulty: 'Intermediate', category: 'Cloud & DevOps Security' },
];

const CATEGORIES = ['Practice Platforms', 'Essential Tools', 'Operating Systems', 'Learning Materials', 'Practice Labs', 'Cloud & DevOps Security'];

const CAT_ICONS: Record<string, React.ElementType> = {
  'Practice Platforms': Swords,
  'Essential Tools': Terminal,
  'Operating Systems': Monitor,
  'Learning Materials': BookOpen,
  'Practice Labs': Beaker,
  'Cloud & DevOps Security': Cloud,
};

const CAT_COLORS: Record<string, string> = {
  'Practice Platforms': '#38bdf8',
  'Essential Tools': '#a78bfa',
  'Operating Systems': '#34d399',
  'Learning Materials': '#fbbf24',
  'Practice Labs': '#f472b6',
  'Cloud & DevOps Security': '#60a5fa',
};

const DIFF_COLORS: Record<string, (light: boolean) => string> = {
  Beginner: (l) => l ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-900/30 text-emerald-400 border-emerald-700/40',
  Intermediate: (l) => l ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-amber-900/30 text-amber-400 border-amber-700/40',
  Advanced: (l) => l ? 'bg-red-50 text-red-700 border-red-300' : 'bg-red-900/30 text-red-400 border-red-700/40',
};

const rootDomain = (domain: string) => domain.split('/')[0];

const logoUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${rootDomain(domain)}&sz=64`;

const CyberStack: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_RESOURCES.filter(r => {
      if (activeCat !== 'All' && r.category !== activeCat) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
    });
  }, [query, activeCat]);

  const markError = (name: string) => setImgErrors(p => new Set(p).add(name));

  const grouped = useMemo(() => {
    if (activeCat !== 'All') return null;
    const q = query.trim().toLowerCase();
    if (q) return null;
    return CATEGORIES.map(cat => ({
      category: cat,
      resources: ALL_RESOURCES.filter(r => r.category === cat),
    }));
  }, [activeCat, query]);

  const Card: React.FC<{ r: Resource }> = ({ r }) => {
    const color = CAT_COLORS[r.category];
    const err = imgErrors.has(r.name);
    return (
      <a
        href={`https://${r.domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-200
          ${isLight
            ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            : 'bg-[#0A1122]/60 border-white/5 hover:border-white/15 hover:shadow-xl hover:shadow-cyan-500/5'
          }`}
      >
        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded border ${DIFF_COLORS[r.difficulty](isLight)}`}>
          {r.difficulty === 'Beginner' ? 'B' : r.difficulty === 'Intermediate' ? 'I' : 'A'}
        </span>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 overflow-hidden transition-transform duration-200 group-hover:scale-110
          ${isLight ? 'bg-gray-50' : 'bg-gray-900/60'}`}
          style={{ borderColor: `${color}20`, borderWidth: 1 }}>
          {err ? (
            <Shield className="w-6 h-6" style={{ color: `${color}60` }} />
          ) : (
            <img src={logoUrl(r.domain)} alt={r.name} className="w-8 h-8 object-contain" loading="lazy" onError={() => markError(r.name)} />
          )}
        </div>
        <h3 className={`text-xs font-bold leading-tight mb-1 transition-colors ${isLight ? 'text-gray-900 group-hover:text-cyan-700' : 'text-gray-100 group-hover:text-cyan-400'}`}>
          {r.name}
        </h3>
        <p className={`text-[10px] leading-relaxed line-clamp-2 ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
          {r.description}
        </p>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className={`text-[8px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
            {r.category === 'Practice Platforms' ? 'Platform' :
             r.category === 'Essential Tools' ? 'Tool' :
             r.category === 'Operating Systems' ? 'OS' :
             r.category === 'Learning Materials' ? 'Learn' :
             r.category === 'Practice Labs' ? 'Lab' : 'DevOps'}
          </span>
        </div>
        <ExternalLink className={`absolute top-2.5 left-2.5 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
      </a>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLight ? 'bg-gradient-to-b from-slate-50 to-white' : 'bg-gradient-to-b from-[#050A15] via-[#070D1A] to-[#050A15]'}`}>

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <div className={`relative border-b overflow-hidden ${isLight ? 'border-gray-200' : 'border-white/5'}`}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative">
          <div className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full border ${isLight ? 'text-cyan-700 bg-cyan-50 border-cyan-300' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'}`}>
            <Star className="w-3 h-3" />
            Curated for B.Tech Cybersecurity
          </div>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tight leading-none ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Cyber<span className="text-cyan-500">Stack</span>
          </h1>
          <p className={`mt-3 text-sm md:text-base max-w-xl ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            Your curated toolbox — platforms, tools, OSes, labs, and learning materials for the entire cybersecurity journey.
            <span className="block mt-1 text-xs opacity-60">{ALL_RESOURCES.length} resources across {CATEGORIES.length} categories</span>
          </p>

          <div className="relative mt-5 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, category, or description..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border focus:outline-none focus:ring-1 focus:ring-cyan-500 transition
                ${isLight ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-gray-900 border-gray-800 text-white placeholder-gray-600'}`}
            />
          </div>
        </div>
      </div>

      {/* ─── Category Tabs + Grid ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 pb-8">
          {['All', ...CATEGORIES].map(cat => {
            const color = cat === 'All' ? '#38bdf8' : CAT_COLORS[cat];
            const Icon = cat === 'All' ? Hash : CAT_ICONS[cat];
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap
                  ${active
                    ? isLight
                      ? 'bg-white text-gray-900 border-gray-300 shadow-sm'
                      : 'bg-[#0A1122]/80 text-white border-white/20 shadow-lg'
                    : isLight
                      ? 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                      : 'bg-gray-900/40 text-gray-400 border-white/5 hover:bg-gray-800/60 hover:text-gray-200'
                  }`}
                style={active ? { borderColor: color, boxShadow: active ? `0 0 20px ${color}15` : undefined } : {}}
              >
                <Icon className="w-3.5 h-3.5" style={active ? { color } : undefined} />
                {cat === 'All' ? 'All' : cat}
              </button>
            );
          })}
        </div>

        {/* Resource count */}
        <p className={`text-sm mb-5 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
          Showing <span className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{filtered.length}</span> resource{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid — grouped by category when All, flat otherwise */}
        {filtered.length > 0 ? (
          grouped ? (
            <div className="space-y-10">
              {grouped.map((g, gi) => {
                const color = CAT_COLORS[g.category];
                const Icon = CAT_ICONS[g.category];
                return (
                  <div key={g.category}>
                    {gi > 0 && (
                      <div className={`mb-8 h-px ${isLight ? 'bg-gradient-to-r from-transparent via-gray-300 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'}`} />
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <h2 className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{g.category}</h2>
                      <div className="flex-1 h-px mx-3" style={{ backgroundColor: `${color}20` }} />
                      <span className={`text-xs font-semibold ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>{g.resources.length}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {g.resources.map(r => <Card key={r.name} r={r} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(r => <Card key={r.name} r={r} />)}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <Search className={`w-10 h-10 mx-auto mb-4 ${isLight ? 'text-gray-300' : 'text-gray-700'}`} />
            <p className={`font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>No resources match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CyberStack;
