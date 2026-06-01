export type ProjectCategory = 'landing' | 'kv' | 'personal' | 'animation' | 'experience' | 'branding' | 'ai';

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  coverImage: string;
  imageUrl: string;
  videoUrl?: string;
  category: ProjectCategory;
  year: number | string;
  tags: string[];
  designBy?: string;
  categoryMap?: Record<string, string>;
  strategy?: string[];
  themeColor?: string;
  secondaryImages?: string[];
  processImages?: string[];
  layout?: 'default' | 'art' | 'ui' | 'dynamic' | 'cyber';
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface PracticeWork {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  imageUrl: string;
}
