import { BaseCommand } from './base';
import { CLIContext } from '../types';
import { Display } from '../utils/display';
import { TypingTest } from '../utils/typing-test';
import inquirer from 'inquirer';

export class TypingCommand extends BaseCommand {
  name = 'typing';
  description = 'Start a typing test';
  aliases = ['type', 'monkeytype'];

  async execute(args: string[], context: CLIContext): Promise<void> {
    let timeLimit = 60; // default 60 seconds
    
    if (args.length > 0) {
      const parsedTime = parseInt(args[0]);
      if (parsedTime && parsedTime >= 10 && parsedTime <= 300) {
        timeLimit = parsedTime;
      } else {
        this.logError('Invalid time limit. Please use a value between 10 and 300 seconds.');
        return;
      }
    }

    await this.startTypingTest(timeLimit);
  }

  private async startTypingTest(timeLimit: number): Promise<void> {
    const typingTest = new TypingTest();
    
    this.log(Display.box(
      [
        `⌨️ Typing Test - ${timeLimit} seconds`,
        '',
        'Instructions:',
        '• Type the text as accurately as possible',
        '• Press Ctrl+C to exit at any time',
        '• Results will be shown at the end',
        '',
        'Press Enter to start...'
      ].join('\n'),
      '🚀 Ready to Start?'
    ));

    await inquirer.prompt([
      {
        type: 'input',
        name: 'start',
        message: 'Press Enter to begin the typing test:'
      }
    ]);

    await this.runTest(typingTest, timeLimit);
  }

  private async runTest(typingTest: TypingTest, timeLimit: number): Promise<void> {
    typingTest.start();
    
    console.clear();
    this.log(Display.header('Typing Test'));
    this.log(Display.separator());
    
    let timeRemaining = timeLimit;
    let testCompleted = false;

    // Start countdown timer
    const timer = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        clearInterval(timer);
        if (!testCompleted) {
          testCompleted = true;
          this.finishTest(typingTest, 'Time up!');
        }
      }
    }, 1000);

    // Simulate typing interface
    try {
      while (!testCompleted && timeRemaining > 0) {
        console.clear();
        this.log(Display.header('Typing Test'));
        this.log(Display.keyValue('Time Remaining', `${timeRemaining}s`));
        this.log(Display.separator());
        
        this.log(typingTest.getDisplayText());
        this.log('');
        this.log(typingTest.getProgressDisplay());
        this.log('');
        this.log(Display.dim('Type the text above. Press Ctrl+C to exit.'));

        // In a real CLI, you'd capture keystrokes here
        // For demo purposes, we'll simulate completion
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate some typing progress
        if (Math.random() > 0.7) {
          const testResult = typingTest.finish();
          testCompleted = true;
          clearInterval(timer);
          this.showResults(testResult);
          break;
        }
      }
    } catch (error) {
      clearInterval(timer);
      this.log('\n' + Display.warning('Test interrupted.'));
    }
  }

  private finishTest(typingTest: TypingTest, reason: string): void {
    const results = typingTest.finish();
    this.log('\n' + Display.info(reason));
    this.showResults(results);
  }

  private showResults(results: any): void {
    console.clear();
    this.log(Display.header('Test Complete!'));
    this.log(TypingTest.formatResults(results));
    
    // Performance feedback
    let feedback = '';
    if (results.wpm >= 80) {
      feedback = Display.success('Excellent! You\'re a typing master! 🏆');
    } else if (results.wpm >= 60) {
      feedback = Display.success('Great job! Above average typing speed! 🎉');
    } else if (results.wpm >= 40) {
      feedback = Display.info('Good typing speed! Keep practicing! 👍');
    } else {
      feedback = Display.warning('Keep practicing to improve your speed! 💪');
    }
    
    this.log('\n' + feedback);
    
    if (results.accuracy < 90) {
      this.log(Display.warning('Focus on accuracy - it\'s better to type slower but more accurately!'));
    }
  }
} 