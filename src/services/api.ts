import axios from 'axios';
import { PortfolioData, BlogPost } from '../types';

const BASE_URL = 'https://sreeragh.me';

export class ApiService {
  private baseURL: string;

  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
  }

  async fetchPortfolioData(): Promise<PortfolioData> {
    try {
      // First try to fetch from API endpoint
      const response = await axios.get(`${this.baseURL}/api/portfolio`);
      return response.data;
    } catch (error) {
      // Fallback: try to fetch the data from the app route
      try {
        const response = await axios.get(`${this.baseURL}/data/portfolio-data.json`);
        return response.data;
      } catch (fallbackError) {
        // If both fail, return default data structure
        console.warn('Could not fetch portfolio data from API, using fallback data');
        return this.getFallbackData();
      }
    }
  }

  async fetchBlogPosts(): Promise<BlogPost[]> {
    try {
      // Try to fetch blog posts from API
      const response = await axios.get(`${this.baseURL}/api/blog`);
      return response.data;
    } catch (error) {
      // Fallback: try to parse from the main site
      try {
        const response = await axios.get(`${this.baseURL}/blog`);
        // This would need HTML parsing, for now return empty array
        console.warn('Could not fetch blog posts from API');
        return [];
      } catch (fallbackError) {
        console.warn('Could not fetch blog posts, returning empty array');
        return [];
      }
    }
  }

  async fetchBlogPost(slug: string): Promise<{ title: string; content: string } | null> {
    try {
      const response = await axios.get(`${this.baseURL}/api/blog/${slug}`);
      return response.data;
    } catch (error) {
      console.warn(`Could not fetch blog post: ${slug}`);
      return null;
    }
  }

  private getFallbackData(): PortfolioData {
    return {
      profile: {
        name: "Sreeragh",
        title: "Hey, I'm Sreeragh 👋",
        description: "My journey of building and learning with some code and a lot of coffee.",
        intro: "A passionate hobby coder and indie hacker. Currently working on bizmo.chat An AI-powered chatbot platform designed to automate customer support and lead collection for businesses.",
        email: "hey@sreeragh.me",
        social: {
          twitter: "https://x.com/sreeragh_s",
          github: "https://github.com/sreeragh-s/",
          instagram: "https://www.instagram.com/sreeragh.s/",
          linkedin: "https://www.linkedin.com/in/s-sreeragh/",
          cal: "https://cal.com/sreeragh"
        }
      },
      home: {
        intro: "A passionate hobby coder and indie hacker. Currently working on bizmo.chat An AI-powered chatbot platform designed to automate customer support and lead collection for businesses.",
        featuredProjectsCount: 3,
        sections: [
          {
            title: "Works",
            type: "projects",
            showAll: true
          }
        ]
      },
      works: [
        {
          title: "bizmo.chat",
          year: 2025,
          description: "Build and Train Custom Chatbots to automate your support and sales needs of your business.",
          url: "https://bizmo.social/",
          category: "AI/Chatbot",
          status: "active",
          technologies: ["AI", "Chatbot", "Automation"]
        }
      ],
      skills: {
        languages: ["JavaScript", "TypeScript", "Python", "SQL"],
        frontend: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
        backend: ["Node.js", "Express", "tRPC", "Supabase"],
        databases: ["PostgreSQL", "MongoDB", "ClickHouse"],
        cloud: ["AWS", "Cloudflare", "Vercel"],
        tools: ["Git", "GitHub", "VS Code", "Figma"]
      },
      contact: {
        email: "hey@sreeragh.me",
        availability: "Open to collaborations and interesting projects",
        timezone: "IST (UTC+5:30)",
        preferredContact: "Email or Twitter DM"
      },
      terminal: {
        motd: [
          "Work in progress!",
          "Type 'help' to see available commands."
        ],
        commands: {
          "about": {
            description: "Learn more about me",
            aliases: ["whoami", "info"]
          },
          "works": {
            description: "View my projects and works",
            aliases: ["projects", "portfolio"]
          },
          "skills": {
            description: "View my technical skills",
            aliases: ["tech", "stack"]
          },
          "contact": {
            description: "Get my contact information",
            aliases: ["email", "reach"]
          }
        }
      }
    };
  }
}

export const apiService = new ApiService(); 