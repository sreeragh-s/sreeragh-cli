import { BaseCommand } from './base';
import { CLIContext } from '../types';
import { Display } from '../utils/display';

export class AboutCommand extends BaseCommand {
  name = 'about';
  description = 'Learn more about me';
  aliases = ['whoami', 'info'];

  async execute(args: string[], context: CLIContext): Promise<void> {
    if (!this.requireData(context)) return;

    const profile = context.portfolioData!.profile;
    
    const content = [
      Display.keyValue('Name', profile.name),
      Display.keyValue('Title', profile.title),
      '',
      Display.section('About', profile.description),
      Display.section('Current Focus', profile.intro),
      '',
      Display.section('Contact', [
        Display.keyValue('Email', profile.email),
        Display.keyValue('GitHub', profile.social.github),
        Display.keyValue('Twitter', profile.social.twitter),
        Display.keyValue('LinkedIn', profile.social.linkedin),
        Display.keyValue('Calendar', profile.social.cal)
      ].join('\n'))
    ].join('\n');

    this.log(Display.box(content, '👨‍�� About Me'));
  }
} 