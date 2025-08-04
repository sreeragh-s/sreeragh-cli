import { Command } from 'commander';
import { CLIContext, Command as CLICommand } from './types';
import { apiService } from './services/api';
import { Display } from './utils/display';
import ora from 'ora';

// Import commands
import { AboutCommand } from './commands/about';
import { WorksCommand } from './commands/works';
import { SkillsCommand } from './commands/skills';
import { TypingCommand } from './commands/typing';

export class SreeraghCLI {
  private program: Command;
  private context: CLIContext;
  private commands: Map<string, CLICommand> = new Map();
  private aliases: Map<string, string> = new Map();

  constructor() {
    this.program = new Command();
    this.context = {
      portfolioData: null,
      blogPosts: [],
      currentPath: '~',
      fileSystem: {},
      commandHistory: []
    };

    this.setupProgram();
    this.registerCommands();
  }

  private setupProgram(): void {
    this.program
      .name('sreeragh')
      .description('Interactive CLI for Sreeragh\'s portfolio')
      .version('1.0.0')
      .option('-v, --verbose', 'enable verbose output')
      .option('--no-color', 'disable colored output');
  }

  private registerCommands(): void {
    const commandInstances = [
      new AboutCommand(),
      new WorksCommand(),
      new SkillsCommand(),
      new TypingCommand()
    ];

    for (const command of commandInstances) {
      this.commands.set(command.name, command);
      
      // Register aliases
      for (const alias of command.aliases) {
        this.aliases.set(alias, command.name);
      }

      // Add to commander program
      this.program
        .command(command.name)
        .description(command.description)
        .action(async (...args) => {
          // Filter out non-string arguments (commander passes command object)
          const commandArgs = args.filter(arg => typeof arg === 'string');
          await this.executeCommand(command.name, commandArgs);
        });
    }

    // Add special commands
    this.addSpecialCommands();
  }

  private addSpecialCommands(): void {
    this.program
      .command('contact')
      .description('Get contact information')
      .action(async () => {
        await this.showContact();
      });

    this.program
      .command('blog')
      .description('View blog posts')
      .action(async () => {
        await this.showBlog();
      });

    this.program
      .command('interactive')
      .alias('i')
      .description('Start interactive mode')
      .action(async () => {
        await this.startInteractiveMode();
      });
  }

  async initialize(): Promise<void> {
    const spinner = ora('Loading portfolio data...').start();
    
    try {
      // Load portfolio data
      this.context.portfolioData = await apiService.fetchPortfolioData();
      spinner.text = 'Loading blog posts...';
      
      // Load blog posts
      this.context.blogPosts = await apiService.fetchBlogPosts();
      
      spinner.succeed('Portfolio data loaded successfully!');
      
      // Show welcome message
      this.showWelcome();
      
    } catch (error) {
      spinner.fail('Failed to load portfolio data');
      console.error(Display.error('Error initializing CLI:'), error);
      process.exit(1);
    }
  }

  private showWelcome(): void {
    if (!this.context.portfolioData) return;

    const profile = this.context.portfolioData.profile;
    
    console.log(Display.header('Sreeragh CLI'));
    console.log(Display.box(
      [
        `Welcome to ${profile.name}'s interactive portfolio!`,
        '',
        profile.description,
        '',
        'Available commands:',
        '• about    - Learn more about me',
        '• works    - View my projects and works',
        '• skills   - View my technical skills',
        '• typing   - Start a typing test',
        '• contact  - Get contact information',
        '• blog     - View blog posts',
        '',
        'Use --help with any command for more details.',
        'Type "sreeragh interactive" for interactive mode.'
      ].join('\n'),
      '👋 Welcome!'
    ));
  }

  private async executeCommand(commandName: string, args: string[]): Promise<void> {
    // Check if it's an alias
    const actualCommandName = this.aliases.get(commandName) || commandName;
    const command = this.commands.get(actualCommandName);
    
    if (!command) {
      console.error(Display.error(`Unknown command: ${commandName}`));
      console.log(Display.info('Use --help to see available commands'));
      return;
    }

    // Add to history
    this.context.commandHistory.push(`${commandName} ${args.join(' ')}`.trim());

    try {
      await command.execute(args, this.context);
    } catch (error) {
      console.error(Display.error(`Error executing command: ${error}`));
    }
  }

  private async showContact(): Promise<void> {
    if (!this.context.portfolioData) {
      console.error(Display.error('Portfolio data not available'));
      return;
    }

    const contact = this.context.portfolioData.contact;
    const profile = this.context.portfolioData.profile;
    
    const content = [
      Display.keyValue('Email', contact.email),
      Display.keyValue('Availability', contact.availability),
      Display.keyValue('Timezone', contact.timezone),
      Display.keyValue('Preferred Contact', contact.preferredContact),
      '',
      Display.section('Social Links', [
        Display.keyValue('GitHub', profile.social.github),
        Display.keyValue('Twitter', profile.social.twitter),
        Display.keyValue('LinkedIn', profile.social.linkedin),
        Display.keyValue('Calendar', profile.social.cal)
      ].join('\n'))
    ].join('\n');

    console.log(Display.box(content, '📧 Contact Information'));
  }

  private async showBlog(): Promise<void> {
    if (this.context.blogPosts.length === 0) {
      console.log(Display.warning('No blog posts available at the moment.'));
      return;
    }

    const content = this.context.blogPosts.map((post, index) => 
      `${index + 1}. ${Display.bold(post.title)}\n   ${Display.dim(post.summary)}\n   ${Display.highlight(`Published: ${post.publishedAt}`)}`
    ).join('\n\n');

    console.log(Display.box(content, '📝 Blog Posts'));
    console.log(Display.info(`Total: ${this.context.blogPosts.length} posts`));
  }

  private async startInteractiveMode(): Promise<void> {
    console.log(Display.info('Interactive mode is not yet implemented.'));
    console.log(Display.dim('Use individual commands for now: about, works, skills, typing, contact, blog'));
  }

  async run(argv: string[]): Promise<void> {
    await this.initialize();
    await this.program.parseAsync(argv);
  }
} 