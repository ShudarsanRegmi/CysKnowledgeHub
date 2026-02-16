
import { ContentType, ContentItem, InterviewExperience } from './types';

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: '1',
    type: ContentType.BLOG,
    title: 'Zero Trust Architecture in 2024',
    description: 'An in-depth look at why perimeter-based security is failing and how Zero Trust provides a solution.',
    author: 'Prof. Sarah Jenkins',
    date: 'Oct 24, 2024',
    tags: ['Network Security', 'Zero Trust', 'Enterprise'],
    imageUrl: 'https://picsum.photos/800/450?random=1'
  },
  {
    id: '2',
    type: ContentType.CTF,
    title: 'De-mystifying Buffer Overflows',
    description: 'A complete walkthrough of the "Stack Master" challenge from HTB.',
    author: 'Rahul Sharma (Batch 2022)',
    date: 'Nov 2, 2024',
    tags: ['Binary Exploitation', 'CTF', 'Pwn'],
    imageUrl: 'https://picsum.photos/800/450?random=2'
  },
  {
    id: '3',
    type: ContentType.PROJECT,
    title: 'IoT Honeypot Framework',
    description: 'Final Year Project involving the creation of a distributed honeypot for Mirai-style botnets.',
    author: 'Cyber Team Alpha',
    date: 'Sept 15, 2024',
    tags: ['IoT', 'Threat Intelligence', 'FYP'],
    imageUrl: 'https://picsum.photos/800/450?random=3'
  },
  {
    id: '4',
    type: ContentType.EXPERIMENT,
    title: 'Hardware Hacking: Extracting Firmware',
    description: 'How to use a Bus Pirate to extract firmware from an old router via SPI.',
    author: 'Electronics Club',
    date: 'Dec 1, 2024',
    tags: ['Hardware', 'Firmware', 'SPI'],
    imageUrl: 'https://picsum.photos/800/450?random=4'
  },
  {
    id: '5',
    type: ContentType.CERTIFICATION,
    title: 'OSCP vs PNPT: Which one to choose?',
    description: 'A direct comparison of the most popular offensive security certifications for students.',
    author: 'Anita Desai',
    date: 'Aug 20, 2024',
    tags: ['Certifications', 'Offensive Security', 'Career'],
    imageUrl: 'https://picsum.photos/800/450?random=5'
  }
];

export const MOCK_INTERVIEWS: InterviewExperience[] = [
  {
    id: 'i1',
    studentName: 'Vikram Singh',
    batch: '2023',
    company: 'Palo Alto Networks',
    role: 'Security Engineer intern',
    difficulty: 'Hard',
    rounds: ['Online Assessment', 'Technical Round 1 (Networking)', 'Technical Round 2 (System Design)', 'HR'],
    tips: ['Focus heavily on TCP/IP stack', 'Be prepared for live coding security scripts']
  },
  {
    id: 'i2',
    studentName: 'Priya Mehta',
    batch: '2024',
    company: 'CrowdStrike',
    role: 'Threat Hunter',
    difficulty: 'Medium',
    rounds: ['Resume Screening', 'Behavioral Round', 'Technical (SIEM & Logs)', 'Final Case Study'],
    tips: ['Learn to read raw logs', 'Understand EDR architectures']
  }
];

export const ROADMAPS = {
  SOC_ANALYST: [
    { title: 'Foundations', description: 'Network+ and Security+ level knowledge.', resources: ['Professor Messer', 'TryHackMe Pre-Security'] },
    { title: 'Tool Mastery', description: 'Splunk, ELK Stack, and Wireshark basics.', resources: ['Splunk Training', 'Wireshark Labs'] },
    { title: 'Blue Teaming', description: 'Incident response and threat hunting fundamentals.', resources: ['LetsDefend', 'Blue Team Level 1'] }
  ]
};
