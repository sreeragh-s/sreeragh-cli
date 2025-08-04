import { BaseCommand } from './base';
import { CLIContext } from '../types';
import { Display } from '../utils/display';
import inquirer from 'inquirer';

export class WorksCommand extends BaseCommand {
  name = 'works';
  description = 'View my projects and works';
  aliases = ['projects', 'portfolio'];

  async execute(args: string[], context: CLIContext): Promise<void> {
    if (!this.requireData(context)) return;

    const works = context.portfolioData!.works;
    
    if (args.includes('--list') || args.includes('-l')) {
      this.displayList(works);
      return;
    }

    if (args.includes('--interactive') || args.includes('-i')) {
      await this.showInteractive(works);
      return;
    }

    // Default: show table view
    this.displayTable(works);
  }

  private displayList(works: any[]): void {
    const content = works.map((work, index) => {
      return [
        `${index + 1}. ${Display.bold(work.title)} (${work.year})`,
        `   ${Display.dim('Category:')} ${work.category}`,
        `   ${Display.dim('Status:')} ${this.getStatusIcon(work.status)} ${work.status}`,
        `   ${Display.dim('Description:')} ${work.description}`,
        `   ${Display.dim('Tech:')} ${work.technologies.join(', ')}`,
        `   ${Display.dim('URL:')} ${Display.highlight(work.url)}`,
        ''
      ].join('\n');
    }).join('\n');

    this.log(Display.box(content, '🚀 My Projects & Works'));
    this.log(`\n${Display.info(`Total: ${works.length} projects`)}`);
  }

  private displayTable(works: any[]): void {
    const headers = ['#', 'Project', 'Year', 'Category', 'Status', 'Technologies'];
    const rows = works.map((work, index) => [
      (index + 1).toString(),
      work.title,
      work.year.toString(),
      work.category,
      this.getStatusIcon(work.status) + ' ' + work.status,
      work.technologies.slice(0, 3).join(', ') + (work.technologies.length > 3 ? '...' : '')
    ]);

    this.log(Display.table(headers, rows));
    this.log(`\n${Display.info('Use --interactive or -i for detailed view')}`);
  }

  private async showInteractive(works: any[]): Promise<void> {
    const choices = works.map((work, index) => ({
      name: `${work.title} (${work.year}) - ${work.category}`,
      value: index
    }));

    choices.push({ name: 'Exit', value: -1 });

    const { selectedIndex } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedIndex',
        message: 'Select a project to view details:',
        choices
      }
    ]);

    if (selectedIndex === -1) return;

    const work = works[selectedIndex];
    this.displayWorkDetails(work);

    // Ask if user wants to open URL
    const { openUrl } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'openUrl',
        message: 'Would you like to open this project?',
        default: false
      }
    ]);

    if (openUrl) {
      this.openUrl(work.url);
    }
  }

  private displayWorkDetails(work: any): void {
    const content = [
      Display.keyValue('Title', work.title),
      Display.keyValue('Year', work.year.toString()),
      Display.keyValue('Category', work.category),
      Display.keyValue('Status', this.getStatusIcon(work.status) + ' ' + work.status),
      '',
      Display.section('Description', work.description),
      '',
      Display.section('Technologies', Display.list(work.technologies)),
      '',
      Display.keyValue('URL', Display.highlight(work.url))
    ].join('\n');

    this.log(Display.box(content, `🚀 ${work.title}`));
  }

  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'active': '🟢',
      'development': '🟡',
      'published': '🔵',
      'open-source': '🔓'
    };
    return icons[status] || '⚪';
  }
} 