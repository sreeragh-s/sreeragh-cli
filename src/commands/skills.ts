import { BaseCommand } from './base';
import { CLIContext } from '../types';
import { Display } from '../utils/display';

export class SkillsCommand extends BaseCommand {
  name = 'skills';
  description = 'View my technical skills';
  aliases = ['tech', 'stack'];

  async execute(args: string[], context: CLIContext): Promise<void> {
    if (!this.requireData(context)) return;

    const skills = context.portfolioData!.skills;
    
    if (args.length > 0 && args[0]) {
      this.displaySpecificSkill(skills, args[0]);
      return;
    }

    this.displayAllSkills(skills);
  }

  private displayAllSkills(skills: any): void {
    const sections = [
      this.createSkillSection('💻 Programming Languages', skills.languages),
      this.createSkillSection('🎨 Frontend Technologies', skills.frontend),
      this.createSkillSection('⚙️ Backend Technologies', skills.backend),
      this.createSkillSection('🗄️ Databases', skills.databases),
      this.createSkillSection('☁️ Cloud & Infrastructure', skills.cloud),
      this.createSkillSection('🛠️ Tools & Others', skills.tools)
    ];

    const content = sections.join('\n\n');
    this.log(Display.box(content, '🔧 Technical Skills'));
    
    this.log(`\n${Display.info('Use: skills <category> to view specific skills')}`);
    this.log(Display.dim('Categories: languages, frontend, backend, databases, cloud, tools'));
  }

  private displaySpecificSkill(skills: any, category: string): void {
    const categoryMap: Record<string, { title: string, items: string[] }> = {
      'languages': { title: '💻 Programming Languages', items: skills.languages },
      'frontend': { title: '🎨 Frontend Technologies', items: skills.frontend },
      'backend': { title: '⚙️ Backend Technologies', items: skills.backend },
      'databases': { title: '🗄️ Databases', items: skills.databases },
      'cloud': { title: '☁️ Cloud & Infrastructure', items: skills.cloud },
      'tools': { title: '🛠️ Tools & Others', items: skills.tools }
    };

    const selectedCategory = categoryMap[category.toLowerCase()];
    
    if (!selectedCategory) {
      this.logError(`Unknown category: ${category}`);
      this.log(Display.dim('Available categories: ' + Object.keys(categoryMap).join(', ')));
      return;
    }

    const content = this.createSkillSection(selectedCategory.title, selectedCategory.items);
    this.log(Display.box(content, selectedCategory.title));
  }

  private createSkillSection(title: string, items: string[]): string {
    return [
      Display.bold(title),
      Display.list(items),
      Display.dim(`Total: ${items.length} skills`)
    ].join('\n');
  }
} 