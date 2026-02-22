
export enum ContentType {
  BLOG = 'BLOG',
  CTF = 'CTF',
  ROADMAP = 'ROADMAP',
  CERTIFICATION = 'CERTIFICATION',
  PROJECT = 'PROJECT',
  EXPERIMENT = 'EXPERIMENT',
  INTERVIEW = 'INTERVIEW',
  COMPANY = 'COMPANY'
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  content?: string;
  link?: string;
  imageUrl?: string;
}

export type TopicType = 'must-know' | 'good-to-know' | 'tools';

export interface TopicGroup {
  name: string;
  type: TopicType;
  items: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  resources: string[];
  duration?: string;
  topics?: TopicGroup[];
}

export interface RoadmapData {
  id: string;
  title: string;
  subtitle: string;
  steps: RoadmapStep[];
}

export interface InterviewExperience {
  id: string;
  studentName: string;
  batch: string;
  company: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rounds: string[];
  tips: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
  type?: 'github' | 'demo' | 'paper' | 'docs' | 'other';
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  description?: string;
  year?: string; // e.g. 2023
  batch?: string; // e.g. "VI Sem"
  categories: string[]; // e.g. ['Cyber Forensics', 'VAPT']
  tags?: string[];
  links?: ProjectLink[];
  featured?: boolean; // for showcase top projects
  imageUrl?: string;
  contributors?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  type: 'Hackathon' | 'CTF' | 'Coding' | 'Other';
  result: string;
  students: string[];
  date: string;
  description: string;
  images: string[];
}

export interface CompanyInfo {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  roles: string[];
  eligibilityCriteria: string;
  salaryPackage: string;
  selectionProcess: string[];
  interviewExperience?: string;
  notesTips: string;
}
