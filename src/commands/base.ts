import { Command, CLIContext } from '../types';

export abstract class BaseCommand implements Command {
  abstract name: string;
  abstract description: string;
  abstract aliases: string[];

  abstract execute(args: string[], context: CLIContext): Promise<void>;

  protected log(message: string): void {
    console.log(message);
  }

  protected logError(message: string): void {
    console.error(message);
  }

  protected requireData(context: CLIContext): boolean {
    if (!context.portfolioData) {
      this.logError('Portfolio data not available. Please check your connection.');
      return false;
    }
    return true;
  }

  protected openUrl(url: string): void {
    // Try different methods to open URL
    const { exec } = require('child_process');
    const platform = process.platform;
    
    let command: string;
    
    if (platform === 'darwin') {
      command = `open "${url}"`;
    } else if (platform === 'win32') {
      command = `start "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }
    
    exec(command, (error: any) => {
      if (error) {
        this.log(`Please open this URL in your browser: ${url}`);
      } else {
        this.log(`Opening: ${url}`);
      }
    });
  }
} 