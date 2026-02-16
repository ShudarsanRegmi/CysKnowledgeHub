
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

export interface RoadmapStep {
  title: string;
  description: string;
  resources: string[];
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
