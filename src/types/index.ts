export interface Work {
  title: string;
  year: number;
  description: string;
  url: string;
  category: string;
  status: 'active' | 'development' | 'published' | 'open-source';
  technologies: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    description: string;
    intro: string;
    email: string;
    social: {
      twitter: string;
      github: string;
      instagram: string;
      linkedin: string;
      cal: string;
    };
  };
  home: {
    intro: string;
    featuredProjectsCount: number;
    sections: Array<{
      title: string;
      type: string;
      showAll: boolean;
    }>;
  };
  works: Work[];
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
  };
  contact: {
    email: string;
    availability: string;
    timezone: string;
    preferredContact: string;
  };
  terminal: {
    motd: string[];
    commands: {
      [key: string]: {
        description: string;
        aliases: string[];
      };
    };
  };
}

export interface TypingTestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  charactersTyped: number;
}

export interface FileSystemItem {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: FileSystemItem[];
}

export interface Command {
  name: string;
  description: string;
  aliases: string[];
  execute: (args: string[], context: CLIContext) => Promise<void>;
}

export interface CLIContext {
  portfolioData: PortfolioData | null;
  blogPosts: BlogPost[];
  currentPath: string;
  fileSystem: Record<string, FileSystemItem>;
  commandHistory: string[];
} 