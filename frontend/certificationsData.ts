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

export const certificationsData: Category[] = [
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
        ]
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
        ]
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
            }
        ]
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
        ]
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
        ]
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
        ]
    }
];
