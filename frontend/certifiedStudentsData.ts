import { CertifiedStudent } from './types';

export const certifiedStudentsData: CertifiedStudent[] = [
    {
        id: 'CS001',
        name: 'Aisha Sharma',
        batch: '2023',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
        primaryCertification: {
            name: 'AWS Certified Solutions Architect – Associate',
            organization: 'Amazon Web Services',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', // generic aws logo placeholder
            month: 'August',
            year: '2023',
        },
        additionalCertifications: [
            {
                name: 'CompTIA Security+',
                organization: 'CompTIA',
                logo: 'https://www.comptia.org/images/default-source/logos/comptia-logo-white.svg',
                month: 'May',
                year: '2022',
            },
        ],
        testimonial: 'The AWS ecosystem is vast. I started by thoroughly understanding IAM and VPCs, then relied on hands-on labs and Stephane Maarek\'s courses. Consistency was key to passing.',
        difficultyPerceived: 'Medium',
    },
    {
        id: 'CS002',
        name: 'Rahul Patel',
        batch: '2022',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200',
        primaryCertification: {
            name: 'Certified Ethical Hacker (CEH)',
            organization: 'EC-Council',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/EC-Council_logo.svg/512px-EC-Council_logo.svg.png',
            month: 'November',
            year: '2022',
        },
        additionalCertifications: [],
        testimonial: 'CEH tested my foundational knowledge. Setting up my own homelab for penetration testing made all the theoretical concepts stick permanently.',
        difficultyPerceived: 'Hard',
    },
    {
        id: 'CS003',
        name: 'Priya Singh',
        batch: '2024',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        primaryCertification: {
            name: 'Red Hat Certified System Administrator (RHCSA)',
            organization: 'Red Hat',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Red_Hat_logo.svg',
            month: 'July',
            year: '2023',
        },
        additionalCertifications: [],
        testimonial: 'Since it is a 100% practical exam, muscle memory is everything. I broke my VM intentionally dozens of times just to learn how to fix it fast.',
        difficultyPerceived: 'Hard',
    },
    {
        id: 'CS004',
        name: 'Karthik Iyer',
        batch: '2023',
        photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
        primaryCertification: {
            name: 'Cisco Certified Network Associate (CCNA)',
            organization: 'Cisco',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
            month: 'March',
            year: '2023',
        },
        additionalCertifications: [
            {
                name: 'AWS Certified Cloud Practitioner',
                organization: 'Amazon Web Services',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
                month: 'December',
                year: '2022',
            }
        ],
        testimonial: 'CCNA fundamentally changed how I view the internet. Packet Tracer became my best friend. The subnetting math took some time to speed up on.',
        difficultyPerceived: 'Medium',
    },
    {
        id: 'CS005',
        name: 'Anjali Desai',
        batch: '2021',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        primaryCertification: {
            name: 'Systems Security Certified Practitioner (SSCP)',
            organization: '(ISC)²',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/ISC2_logo.svg/512px-ISC2_logo.svg.png',
            month: 'September',
            year: '2021',
        },
        additionalCertifications: [
            {
                name: 'Certified Ethical Hacker (CEH)',
                organization: 'EC-Council',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/EC-Council_logo.svg/512px-EC-Council_logo.svg.png',
                month: 'October',
                year: '2022',
            }
        ],
        testimonial: 'SSCP provides incredible perspective on operational security. It bridges the gap between deeply technical work and business goals perfectly.',
        difficultyPerceived: 'Medium',
    },
    {
        id: 'CS006',
        name: 'Vikram Mehta',
        batch: '2024',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
        primaryCertification: {
            name: 'CompTIA Security+',
            organization: 'CompTIA',
            logo: 'https://www.comptia.org/images/default-source/logos/comptia-logo-white.svg',
            month: 'January',
            year: '2024',
        },
        additionalCertifications: [],
        testimonial: 'Professor Messer\'s videos and a lot of practice exams were the key. Don\'t underestimate the acronyms — there are hundreds to memorize!',
        difficultyPerceived: 'Easy',
    }
];
