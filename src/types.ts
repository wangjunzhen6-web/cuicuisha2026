export type ProjectCategory = 'landing' | 'kv' | 'personal' | 'animation' | 'experience' | 'branding' | 'ai';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  category: ProjectCategory;
  tags: string[];
  designBy?: string;
  categoryMap?: Record<string, string>;
  strategy?: string[];
  themeColor?: string;
  secondaryImages?: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
}
