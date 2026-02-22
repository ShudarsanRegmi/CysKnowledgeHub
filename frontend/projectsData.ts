import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'proj-forensics-2023-x',
    title: 'Cyber Forensics Semester Project - X Sem (2023 batch)',
    abstract: 'A forensic investigation framework to recover artifacts from disk images and analyze timeline of attacker activities.',
    description: 'Full forensic pipeline including disk imaging, file carving, timeline analysis, and visual reports. Built with Python, sleuthkit, and custom parsers. Includes automated reporting for classroom grading.',
    year: '2023',
    batch: 'X Sem (2023)',
    categories: ['Cyber Forensics', 'Semester Project'],
    tags: ['forensics', 'timeline', 'disk'],
    links: [
      { label: 'GitHub', url: 'https://github.com/example/forensics-project', type: 'github' },
      { label: 'Report PDF', url: 'https://example.com/forensics-report.pdf', type: 'paper' }
    ],
    featured: true,
  imageUrl: '/demo/forensics.svg',
    contributors: ['A. Singh', 'R. Kumar']
  },
  {
    id: 'proj-vapt-vi-2024',
    title: 'VAPT Project - VI Sem (2024 batch)',
    abstract: 'Vulnerability assessment and penetration testing on a mock web application with remediation checklist.',
    description: 'End-to-end VAPT engagement on a deliberately vulnerable web application. Includes discovery, exploitation, reporting and mitigation suggestions. Tools used: nmap, nikto, burpsuite, sqlmap.',
    year: '2024',
    batch: 'VI Sem (2024)',
    categories: ['VAPT', 'Course Project'],
    tags: ['vapt', 'web', 'reporting'],
    links: [
      { label: 'GitHub', url: 'https://github.com/example/vapt-project', type: 'github' },
      { label: 'Deployed Demo', url: 'https://demo.example.com', type: 'demo' }
    ],
    featured: true,
  imageUrl: '/demo/vapt.svg',
    contributors: ['S. Regmi']
  },
  {
    id: 'proj-network-analysis-2022',
    title: 'Network Traffic Analysis (2022)',
    abstract: 'Visual analytics toolkit for PCAP files to detect anomalies and common attack patterns.',
    description: 'A small web app that accepts PCAPs and provides statistical charts and signatures for quick triage. Uses pyshark on the backend and a React frontend for visualization.',
    year: '2022',
    batch: 'VIII Sem (2022)',
    categories: ['Network Security', 'Tools'],
    tags: ['pcap', 'visualization'],
    links: [
      { label: 'GitHub', url: 'https://github.com/example/pcap-visualizer', type: 'github' }
    ],
    featured: false,
  imageUrl: '/demo/pcap.svg',
    contributors: ['M. Sharma']
  },
  {
    id: 'proj-malware-analysis-2023',
    title: 'Malware Analysis Toolkit (2023)',
    abstract: 'Lightweight sandbox to run suspected binaries in an instrumented environment and extract behavioral indicators.',
    year: '2023',
    categories: ['Malware Analysis', 'Research'],
    tags: ['sandbox', 'yara'],
    links: [
      { label: 'Paper', url: 'https://example.com/malware-paper.pdf', type: 'paper' }
    ],
    featured: true,
  imageUrl: '/demo/malware.svg',
    contributors: ['L. Rao']
  },
  {
    id: 'proj-iot-security-2021',
    title: 'IoT Security Audit (2021)',
    abstract: 'An audit of common IoT devices used on campus and mitigation playbook for secure deployment.',
    year: '2021',
    categories: ['IoT', 'Audit'],
    tags: ['iot', 'audit'],
    links: [],
    featured: false,
  imageUrl: '/demo/iot.svg',
    contributors: ['Team IoT']
  },
  {
    id: 'proj-general-sample',
    title: 'Sample General Project',
    abstract: 'A general project placed under General category to demonstrate filtering and search.',
    year: '2025',
    categories: ['General'],
    tags: ['sample'],
    links: [],
    featured: false,
  imageUrl: '/demo/sample.svg',
    contributors: []
  }
  ,
  {
    id: 'proj-memory-forensics-2024',
    title: 'Memory Forensics Toolkit (2024)',
    abstract: 'Automated memory capture and analysis toolkit for volatile artifact extraction.',
    description: 'Tools and scripts to collect, parse and analyze volatile memory to extract process artifacts, injected code, and network artifacts. Integrates volatility plugins and automated reporting.',
    year: '2024',
    categories: ['Cyber Forensics', 'Tools'],
    tags: ['memory', 'forensics'],
    links: [
      { label: 'GitHub', url: 'https://github.com/example/memory-forensics', type: 'github' }
    ],
    featured: false,
    imageUrl: '/demo/forensics.svg',
    contributors: ['N. Koirala']
  },
  {
    id: 'proj-vapt-mobile-2023',
    title: 'Mobile VAPT - Android (2023)',
    abstract: 'Vulnerability assessment focused on Android app misconfigurations and insecure storage.',
    year: '2023',
    categories: ['VAPT', 'Mobile'],
    tags: ['mobile', 'android', 'vapt'],
    links: [],
    featured: false,
    imageUrl: '/demo/vapt.svg',
    contributors: ['R. Adhikari']
  },
  {
    id: 'proj-threat-hunting-2022',
    title: 'Threat Hunting Playbook (2022)',
    abstract: 'A documented playbook with Sigma rules and queries for common attacker behaviors.',
    year: '2022',
    categories: ['Threat Hunting', 'Research'],
    tags: ['sigma', 'hunt'],
    links: [
      { label: 'Playbook', url: 'https://example.com/threat-playbook.pdf', type: 'docs' }
    ],
    featured: false,
    imageUrl: '/demo/pcap.svg',
    contributors: ['S. Joshi']
  },
  {
    id: 'proj-cloud-security-2024',
    title: 'Cloud Security Baseline (2024)',
    abstract: 'CIS-based automation to validate cloud accounts and generate remediation tasks.',
    year: '2024',
    categories: ['Cloud Security', 'Tools'],
    tags: ['aws', 'gcp', 'baseline'],
    links: [],
    featured: true,
    imageUrl: '/demo/sample.svg',
    contributors: ['A. Gupta']
  },
  {
    id: 'proj-redteam-ops-2023',
    title: 'Red Team Operational Toolkit (2023)',
    abstract: 'Collection of red-team tooling and automated operation playbooks used during assessments.',
    year: '2023',
    categories: ['Red Team', 'Ops'],
    tags: ['redteam', 'ops'],
    links: [],
    featured: false,
    imageUrl: '/demo/malware.svg',
    contributors: ['C. Thapa']
  },
  {
    id: 'proj-blue-dashboard-2023',
    title: 'Blue Team Dashboard (2023)',
    abstract: 'A dashboard aggregating logs and signals for SOC analysts with quick triage workflows.',
    year: '2023',
    categories: ['SIEM', 'Tools'],
    tags: ['dashboard', 'soc'],
    links: [],
    featured: false,
    imageUrl: '/demo/pcap.svg',
    contributors: ['D. Rana']
  }
];
