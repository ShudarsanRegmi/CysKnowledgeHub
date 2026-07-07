export interface Certification {
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    shortDesc: string;
    organization: string;
    exam: string;
    prep: string;
    roles: string;
    badgeUrl?: string;
}

export interface Category {
    title: string;
    certifications: Certification[];
}

export interface RoadmapStep {
  certName: string;
  note?: string;
}

export interface CertificationRoadmap {
  name: string;
  description: string;
  gradient: string;
  steps: RoadmapStep[];
}

export interface YearPlanCert {
  name: string;
  level: string;
  note: string;
}

export interface YearPlan {
  year: string;
  subtitle: string;
  gradient: string;
  certs: YearPlanCert[];
}

const CERTLY = 'https://images.credly.com/images';

export const certificationsData: Category[] = [
  {
    title: "Cybersecurity Core",
    certifications: [
      {
        name: "CompTIA Security+",
        level: "Beginner",
        shortDesc: "Foundational certification covering core security concepts, risk management, and cryptography.",
        organization: "CompTIA",
        exam: "SY0-701 | 90 Questions | 90 Minutes",
        prep: "2–3 Months",
        roles: "SOC Analyst, Security Administrator",
        badgeUrl: `${CERTLY}/80d8a06a-c384-42bf-ad36-db81bce5adce/blob`,
      },
      {
        name: "CompTIA CySA+",
        level: "Intermediate",
        shortDesc: "Cybersecurity Analyst focusing on threat detection, defense, and incident response.",
        organization: "CompTIA",
        exam: "CS0-003 | 85 Questions | 165 Minutes",
        prep: "3–4 Months",
        roles: "Security Analyst, Threat Hunter",
        badgeUrl: `${CERTLY}/dcd99b5b-da24-40a6-9364-62126d590c37/blob`,
      },
      {
        name: "CompTIA Pentest+",
        level: "Intermediate",
        shortDesc: "Intermediate penetration testing and vulnerability assessment certification.",
        organization: "CompTIA",
        exam: "PT0-002 | 85 Questions | 165 Minutes",
        prep: "3–4 Months",
        roles: "Penetration Tester, Security Consultant",
        badgeUrl: `${CERTLY}/c7ac176b-15a3-4726-827a-e8cee8fe44dc/blob`,
      },
      {
        name: "CompTIA CASP+",
        level: "Advanced",
        shortDesc: "Advanced security architecture and engineering for enterprise environments.",
        organization: "CompTIA",
        exam: "CAS-005 | 90 Questions | 165 Minutes",
        prep: "4–6 Months",
        roles: "Security Architect, Security Engineer",
        badgeUrl: `${CERTLY}/5343b652-c9a0-418e-bfaf-7ed5a2ddd0c4/blob`,
      },
      {
        name: "CISSP",
        level: "Advanced",
        shortDesc: "Globally recognized enterprise security leadership and architecture certification.",
        organization: "(ISC)²",
        exam: "125–175 Questions | CAT Format | 4 Hours",
        prep: "4–6 Months",
        roles: "Security Architect, CISO",
        badgeUrl: `${CERTLY}/de7e10b8-25a9-420b-834c-1e9cffd3b2fa/image.png`,
      },
    ],
  },
  {
    title: "Offensive Security (Red Team)",
    certifications: [
      {
        name: "eJPT",
        level: "Beginner",
        shortDesc: "100% practical junior penetration testing certification by INE.",
        organization: "INE",
        exam: "Practical Lab | 48 Hours",
        prep: "1–2 Months",
        roles: "Junior Penetration Tester",
      },
      {
        name: "Certified Ethical Hacker (CEH)",
        level: "Intermediate",
        shortDesc: "Industry-standard ethical hacking certification covering tools and attack vectors.",
        organization: "EC-Council",
        exam: "125 Questions | 4 Hours",
        prep: "3–4 Months",
        roles: "Penetration Tester, Red Team Analyst",
        badgeUrl: 'https://assets.website-files.com/611d71e2f411757883bc9bb5/616dd9d2cbea0f25d4b95837_ceh-small.png',
      },
      {
        name: "Practical Network Penetration Tester (PNPT)",
        level: "Intermediate",
        shortDesc: "Real-world pentesting certification with a full report-based practical exam.",
        organization: "TCM Security",
        exam: "Practical Lab + Report | 5 Days",
        prep: "3–5 Months",
        roles: "Penetration Tester, Red Team Operator",
      },
      {
        name: "Certified Red Team Professional (CRTP)",
        level: "Intermediate",
        shortDesc: "Active Directory attack-focused red team certification.",
        organization: "Altered Security",
        exam: "Practical Lab | 48 Hours",
        prep: "2–3 Months",
        roles: "Red Team Operator, AD Security Specialist",
      },
      {
        name: "GIAC Penetration Tester (GPEN)",
        level: "Advanced",
        shortDesc: "Advanced penetration testing methodologies from SANS.",
        organization: "GIAC / SANS",
        exam: "115 Questions | 3 Hours",
        prep: "4–6 Months",
        roles: "Senior Penetration Tester",
        badgeUrl: `${CERTLY}/394a708e-5858-4a2c-89ff-407fc4c34509/image.png`,
      },
      {
        name: "OSCP",
        level: "Advanced",
        shortDesc: "Rigorous hands-on offensive security certification by OffSec.",
        organization: "OffSec",
        exam: "Practical Lab | 24 Hours + Report",
        prep: "4–8 Months",
        roles: "Senior Penetration Tester, Security Consultant",
        badgeUrl: `${CERTLY}/ec81134d-e80b-4eb5-ae07-0eb8e1a60fcd/image.png`,
      },
      {
        name: "OffSec Web Expert (OSWE)",
        level: "Advanced",
        shortDesc: "Advanced web application security assessment and source code review.",
        organization: "OffSec",
        exam: "Practical Lab | 48 Hours + Report",
        prep: "4–8 Months",
        roles: "Web App Security Specialist",
        badgeUrl: `${CERTLY}/ec81134d-e80b-4eb5-ae07-0eb8e1a60fcd/image.png`,
      },
      {
        name: "OffSec Experienced Penetration Tester (OSEP)",
        level: "Advanced",
        shortDesc: "Advanced evasive penetration testing and adversary simulation.",
        organization: "OffSec",
        exam: "Practical Lab | 48 Hours + Report",
        prep: "6–10 Months",
        roles: "Red Team Lead, Adversary Simulation Specialist",
        badgeUrl: `${CERTLY}/ec81134d-e80b-4eb5-ae07-0eb8e1a60fcd/image.png`,
      },
    ],
  },
  {
    title: "Defensive Security (Blue Team)",
    certifications: [
      {
        name: "Blue Team Level 1 (BTL1)",
        level: "Beginner",
        shortDesc: "Foundational SOC analyst certification with practical defense labs.",
        organization: "Security Blue Team",
        exam: "Practical Lab | 24 Hours",
        prep: "2–3 Months",
        roles: "Level 1 SOC Analyst",
      },
      {
        name: "EC-Council Certified Incident Handler (ECIH)",
        level: "Intermediate",
        shortDesc: "Incident handling and response lifecycle management.",
        organization: "EC-Council",
        exam: "100 Questions | 3 Hours",
        prep: "2–3 Months",
        roles: "Incident Responder, SOC Lead",
      },
      {
        name: "GIAC Certified Incident Handler (GCIH)",
        level: "Advanced",
        shortDesc: "Top-tier incident handling, response, and forensic analysis certification.",
        organization: "GIAC / SANS",
        exam: "106 Questions | 4 Hours",
        prep: "3–4 Months",
        roles: "Incident Responder, DFIR Analyst",
        badgeUrl: `${CERTLY}/c3e2745b-2f30-4e6b-9290-f7557a705181/image.png`,
      },
      {
        name: "GIAC Certified Forensic Analyst (GCFA)",
        level: "Advanced",
        shortDesc: "Advanced digital forensics and incident response certification.",
        organization: "GIAC / SANS",
        exam: "115 Questions | 4 Hours",
        prep: "4–6 Months",
        roles: "DFIR Lead, Forensic Analyst",
        badgeUrl: `${CERTLY}/061f34d8-aa10-44d6-90d2-99ae0b864214/image.png`,
      },
    ],
  },
  {
    title: "Cloud Security",
    certifications: [
      {
        name: "Certificate of Cloud Security Knowledge (CCSK)",
        level: "Beginner",
        shortDesc: "Foundational cloud security knowledge across all major platforms.",
        organization: "Cloud Security Alliance",
        exam: "60 Questions | 90 Minutes",
        prep: "1–2 Months",
        roles: "Cloud Security Analyst",
        badgeUrl: `${CERTLY}/4377e6e3-3297-4e3a-b8b8-e1ae89b8b0a8/image.png`,
      },
      {
        name: "Certified Cloud Security Professional (CCSP)",
        level: "Advanced",
        shortDesc: "Advanced cloud security architecture and operations certification.",
        organization: "(ISC)²",
        exam: "125 Questions | 4 Hours",
        prep: "3–5 Months",
        roles: "Cloud Security Architect, Cloud SecOps",
        badgeUrl: `${CERTLY}/38b12225-5b48-44e1-8750-20928cc595ea/image.png`,
      },
      {
        name: "Azure Security Engineer (SC-300)",
        level: "Intermediate",
        shortDesc: "Security implementation and management in Microsoft Azure.",
        organization: "Microsoft",
        exam: "SC-300 | 120 Minutes",
        prep: "2–3 Months",
        roles: "Azure Security Engineer, Cloud Security Analyst",
        badgeUrl: `${CERTLY}/1ad16b6f-2c71-4a2e-ae74-ec69c4766039/image.png`,
      },
      {
        name: "AWS Security Specialty",
        level: "Advanced",
        shortDesc: "Advanced AWS cloud security practices and incident response.",
        organization: "Amazon Web Services",
        exam: "65 Questions | 170 Minutes",
        prep: "3–4 Months",
        roles: "Cloud Security Engineer, AWS Security Architect",
        badgeUrl: `${CERTLY}/53acdae5-d69f-4dda-b650-d02ed7a50dd7/image.png`,
      },
    ],
  },
  {
    title: "Cloud Platforms (AWS, Azure, GCP)",
    certifications: [
      {
        name: "AWS Cloud Practitioner",
        level: "Beginner",
        shortDesc: "Foundational AWS cloud knowledge covering core services and pricing.",
        organization: "Amazon Web Services",
        exam: "CLF-C02 | 65 Questions | 90 Minutes",
        prep: "1–2 Months",
        roles: "Cloud Practitioner, Solutions Architect",
        badgeUrl: `${CERTLY}/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png`,
      },
      {
        name: "Azure Fundamentals (AZ-900)",
        level: "Beginner",
        shortDesc: "Foundational Azure cloud concepts, services, and governance.",
        organization: "Microsoft",
        exam: "AZ-900 | 40–60 Questions | 85 Minutes",
        prep: "1–2 Months",
        roles: "Cloud Administrator, Solutions Architect",
        badgeUrl: `${CERTLY}/6ad254a8-7b61-4e6a-9710-5632c1cc1237/image.png`,
      },
      {
        name: "Google Cloud Digital Leader",
        level: "Beginner",
        shortDesc: "Foundational Google Cloud knowledge for digital transformation.",
        organization: "Google Cloud",
        exam: "60–70 Questions | 90 Minutes",
        prep: "1–2 Months",
        roles: "Cloud Leader, Digital Transformation",
        badgeUrl: `${CERTLY}/72d3e3a0-1f39-4e17-9c7d-c64a04c383a6/image.png`,
      },
      {
        name: "AWS Solutions Architect Associate",
        level: "Intermediate",
        shortDesc: "Design and deploy scalable, highly available AWS solutions.",
        organization: "Amazon Web Services",
        exam: "SAA-C03 | 65 Questions | 130 Minutes",
        prep: "3–4 Months",
        roles: "Solutions Architect, Cloud Engineer",
        badgeUrl: `${CERTLY}/0e284c3f-5164-4b21-8660-0d84737941bc/image.png`,
      },
      {
        name: "Azure Administrator Associate (AZ-104)",
        level: "Intermediate",
        shortDesc: "Manage Azure identities, storage, networking, and compute resources.",
        organization: "Microsoft",
        exam: "AZ-104 | 40–60 Questions | 120 Minutes",
        prep: "3–4 Months",
        roles: "Azure Administrator, Cloud Engineer",
        badgeUrl: `${CERTLY}/336eebfc-0acb-41b9-ac71-e20bb1cf5039/image.png`,
      },
      {
        name: "AWS Solutions Architect Professional",
        level: "Advanced",
        shortDesc: "Advanced AWS solutions for complex, multi-account architectures.",
        organization: "Amazon Web Services",
        exam: "SAP-C02 | 75 Questions | 180 Minutes",
        prep: "4–6 Months",
        roles: "Senior Solutions Architect, Cloud Architect",
        badgeUrl: `${CERTLY}/3b4e8c6c-481b-4e8b-9e91-4c9e32d31255/image.png`,
      },
      {
        name: "Azure Solutions Architect Expert (AZ-305)",
        level: "Advanced",
        shortDesc: "Design scalable, secure Azure solutions across all domains.",
        organization: "Microsoft",
        exam: "AZ-305 | 40–60 Questions | 120 Minutes",
        prep: "4–6 Months",
        roles: "Cloud Architect, Azure Solutions Architect",
        badgeUrl: `${CERTLY}/0385e0f8-86f3-4ba3-97c1-250c97e14e84/image.png`,
      },
      {
        name: "AWS DevOps Engineer Professional",
        level: "Advanced",
        shortDesc: "Automate AWS infrastructure, CI/CD, and monitoring pipelines.",
        organization: "Amazon Web Services",
        exam: "DOP-C02 | 75 Questions | 180 Minutes",
        prep: "4–6 Months",
        roles: "DevOps Engineer, Cloud Engineer",
        badgeUrl: `${CERTLY}/bd3ef09b-80e7-4a32-b45b-f0286af11e4e/image.png`,
      },
      {
        name: "Azure DevOps Engineer Expert",
        level: "Advanced",
        shortDesc: "Design and implement DevOps practices with Azure tools and pipelines.",
        organization: "Microsoft",
        exam: "AZ-400 | 40–60 Questions | 120 Minutes",
        prep: "4–6 Months",
        roles: "DevOps Engineer, Release Manager",
        badgeUrl: `${CERTLY}/3b1a8f20-9fe4-4516-8dfd-7cedc34c1567/image.png`,
      },
    ],
  },
  {
    title: "Governance, Risk & Compliance (GRC)",
    certifications: [
      {
        name: "CISA",
        level: "Intermediate",
        shortDesc: "Globally recognized IS audit, control, and assurance certification.",
        organization: "ISACA",
        exam: "150 Questions | 4 Hours",
        prep: "3–4 Months",
        roles: "IT Auditor, Compliance Analyst",
        badgeUrl: `${CERTLY}/d8b54d17-692a-4151-8e2e-e3c8c1a89ec1/image.png`,
      },
      {
        name: "CRISC",
        level: "Intermediate",
        shortDesc: "Risk management and information systems control certification.",
        organization: "ISACA",
        exam: "150 Questions | 4 Hours",
        prep: "3–4 Months",
        roles: "Risk Analyst, GRC Specialist",
        badgeUrl: `${CERTLY}/af93ecd1-d4f0-4cca-9fed-e36ff2366b56/image.png`,
      },
      {
        name: "CISM",
        level: "Advanced",
        shortDesc: "Information security management, governance, and program development.",
        organization: "ISACA",
        exam: "150 Questions | 4 Hours",
        prep: "3–5 Months",
        roles: "Information Security Manager",
        badgeUrl: `${CERTLY}/d0891dee-6360-496c-9981-40652523b502/dbdea6794f1a6bbcc18d90eea923421aac7df6b5.png`,
      },
    ],
  },
  {
    title: "Networking & System Administration",
    certifications: [
      {
        name: "CompTIA Network+",
        level: "Beginner",
        shortDesc: "Foundational networking principles, troubleshooting, and implementations.",
        organization: "CompTIA",
        exam: "N10-008 | 90 Questions | 90 Minutes",
        prep: "2–3 Months",
        roles: "Network Administrator, Support Engineer",
        badgeUrl: `${CERTLY}/c70ba73e-3c8a-46fa-9d60-4a9af94ad662/blob`,
      },
      {
        name: "Cisco Certified Network Associate (CCNA)",
        level: "Intermediate",
        shortDesc: "Core networking skills across Cisco routing, switching, and security.",
        organization: "Cisco",
        exam: "200-301 | 120 Questions | 120 Minutes",
        prep: "3–5 Months",
        roles: "Network Engineer, Network Administrator",
        badgeUrl: `${CERTLY}/74d3eb70-e50b-46d7-b5fa-317b76d6bec2/image.png`,
      },
      {
        name: "Red Hat Certified System Administrator (RHCSA)",
        level: "Intermediate",
        shortDesc: "Core Linux system administration in Red Hat Enterprise Linux.",
        organization: "Red Hat",
        exam: "EX200 | Practical Lab | 3 Hours",
        prep: "3 Months",
        roles: "Linux Administrator, DevOps Engineer",
        badgeUrl: `${CERTLY}/572de0ba-2c59-4816-a59d-b0e1687e45ee/image.png`,
      },
      {
        name: "Cisco Certified Network Professional (CCNP)",
        level: "Advanced",
        shortDesc: "Advanced enterprise networking, security, and automation.",
        organization: "Cisco",
        exam: "350-401 ENCOR + Concentration | 120 Minutes each",
        prep: "6–9 Months",
        roles: "Senior Network Engineer, Network Architect",
        badgeUrl: `${CERTLY}/dd4c4bdc-06a1-4bc7-b3fd-47b8e4d0b5d5/image.png`,
      },
      {
        name: "Red Hat Certified Engineer (RHCE)",
        level: "Advanced",
        shortDesc: "Advanced Linux automation, Ansible, and system administration.",
        organization: "Red Hat",
        exam: "EX294 | Practical Lab | 4 Hours",
        prep: "4–6 Months",
        roles: "Senior Linux Admin, DevOps Engineer, Automation Engineer",
        badgeUrl: `${CERTLY}/7d4ee7c1-e4ef-434c-897b-7e2161243428/blob`,
      },
      {
        name: "Red Hat OpenShift Administration",
        level: "Advanced",
        shortDesc: "Deploy, manage, and troubleshoot containerized applications on OpenShift.",
        organization: "Red Hat",
        exam: "EX280 | Practical Lab | 3 Hours",
        prep: "3–4 Months",
        roles: "OpenShift Administrator, DevOps Engineer, Platform Engineer",
        badgeUrl: `${CERTLY}/e7a34dc0-feb1-44a1-b8e7-3f825faf1c8e/blob`,
      },
    ],
  },
];

export const certificationRoadmaps: CertificationRoadmap[] = [
  {
    name: "AWS Certification Roadmap",
    description: "Complete AWS certification path from fundamentals to professional architect level.",
    gradient: "from-orange-500 to-yellow-500",
    steps: [
      { certName: "AWS Cloud Practitioner" },
      { certName: "AWS Solutions Architect Associate" },
      { certName: "AWS Developer Associate", note: "Optional — complements SA path" },
      { certName: "AWS Solutions Architect Professional" },
      { certName: "AWS DevOps Engineer Professional", note: "Ops & automation focus" },
      { certName: "AWS Security Specialty", note: "Security specialization" },
    ],
  },
  {
    name: "Microsoft Azure Certification Roadmap",
    description: "Azure certification path from fundamentals to expert architect level.",
    gradient: "from-blue-500 to-indigo-500",
    steps: [
      { certName: "Azure Fundamentals (AZ-900)" },
      { certName: "Azure Administrator Associate (AZ-104)" },
      { certName: "Azure Security Engineer (SC-300)", note: "Security focus" },
      { certName: "Azure Solutions Architect Expert (AZ-305)" },
      { certName: "Azure DevOps Engineer Expert", note: "CI/CD & infrastructure as code" },
    ],
  },
  {
    name: "Red Hat Certification Roadmap",
    description: "Red Hat Linux certification path from system administrator to engineer.",
    gradient: "from-red-500 to-red-700",
    steps: [
      { certName: "Red Hat Certified System Administrator (RHCSA)" },
      { certName: "Red Hat Certified Engineer (RHCE)", note: "Ansible automation focus" },
      { certName: "Red Hat OpenShift Administration", note: "Container orchestration" },
    ],
  },
  {
    name: "Cybersecurity Career Roadmap",
    description: "Progressive cybersecurity certification path from beginner to expert across defense, offense, and leadership.",
    gradient: "from-cyan-500 to-purple-600",
    steps: [
      { certName: "CompTIA Security+", note: "Start here" },
      { certName: "CompTIA CySA+", note: "Defense & analysis" },
      { certName: "eJPT", note: "Junior pentesting" },
      { certName: "CEH", note: "Red team foundations" },
      { certName: "CRTP", note: "AD attacks" },
      { certName: "BTL1", note: "Blue team ops" },
      { certName: "OSCP", note: "Core offensive cert" },
      { certName: "CISSP", note: "Leadership & management" },
    ],
  },
  {
    name: "Cross-Domain Certification Path",
    description: "Mixed roadmap spanning cloud, networking, defense, and offensive security — increasing in difficulty across domains.",
    gradient: "from-purple-500 to-pink-500",
    steps: [
      { certName: "CompTIA Security+", note: "Foundation" },
      { certName: "CompTIA Network+", note: "Networking basics" },
      { certName: "AWS Cloud Practitioner", note: "Cloud entry" },
      { certName: "Azure Fundamentals (AZ-900)", note: "Azure entry" },
      { certName: "CCNA", note: "Cisco networking" },
      { certName: "AWS Solutions Architect Associate", note: "Cloud architecture" },
      { certName: "CEH", note: "Offensive foundations" },
      { certName: "Azure Administrator Associate (AZ-104)", note: "Azure ops" },
      { certName: "OSCP", note: "Advanced offensive" },
      { certName: "AWS Solutions Architect Professional", note: "Advanced cloud" },
      { certName: "CISSP", note: "Security leadership" },
    ],
  },
];

export const fourYearPlan: YearPlan[] = [
  {
    year: "1st Year",
    subtitle: "Foundation Building",
    gradient: "from-green-500 to-emerald-500",
    certs: [
      { name: "CompTIA Security+", level: "Beginner", note: "Core security fundamentals — essential starting point for any cybersecurity career" },
      { name: "CompTIA Network+", level: "Beginner", note: "Networking basics — understand TCP/IP, routing, and network operations" },
      { name: "AWS Cloud Practitioner", level: "Beginner", note: "Cloud fundamentals — learn cloud concepts, pricing, and core AWS services" },
    ],
  },
  {
    year: "2nd Year",
    subtitle: "Specialization & Depth",
    gradient: "from-cyan-500 to-blue-500",
    certs: [
      { name: "CompTIA CySA+", level: "Intermediate", note: "Defense & analysis — threat detection, incident response, and SIEM tools" },
      { name: "eJPT", level: "Beginner", note: "Junior pentesting — practical hands-on introduction to penetration testing" },
      { name: "CCNA", level: "Intermediate", note: "Cisco networking — routing, switching, and network security fundamentals" },
      { name: "Azure Fundamentals (AZ-900)", level: "Beginner", note: "Azure cloud entry point — expand cloud skills beyond AWS" },
    ],
  },
  {
    year: "3rd Year",
    subtitle: "Advanced Skills",
    gradient: "from-yellow-500 to-orange-500",
    certs: [
      { name: "CEH", level: "Intermediate", note: "Red team foundations — structured ethical hacking methodology and tools" },
      { name: "BTL1", level: "Beginner", note: "Blue team operations — practical SOC skills and threat hunting" },
      { name: "AWS Solutions Architect Associate", level: "Intermediate", note: "Cloud architecture — design scalable, resilient AWS solutions" },
      { name: "Azure Administrator Associate (AZ-104)", level: "Intermediate", note: "Azure administration — manage identities, storage, and networking" },
      { name: "CRTP", level: "Intermediate", note: "Active Directory attacks — specialized red team AD exploitation" },
    ],
  },
  {
    year: "4th Year",
    subtitle: "Expertise & Leadership",
    gradient: "from-red-500 to-purple-500",
    certs: [
      { name: "OSCP", level: "Advanced", note: "Penetration testing mastery — 24-hour practical exam, gold standard for offensive security" },
      { name: "CISSP", level: "Advanced", note: "Security leadership — enterprise security management and architecture" },
      { name: "AWS Solutions Architect Professional", level: "Advanced", note: "Advanced cloud architecture — complex, multi-account AWS solutions" },
      { name: "CCNP", level: "Advanced", note: "Enterprise networking — advanced routing, switching, and network automation" },
    ],
  },
];
