import { TypingTestResult } from '../types';
import chalk from 'chalk';
import { Display } from './display';

export class TypingTest {
  private text: string;
  private userInput: string = '';
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  private errors: number = 0;
  private isActive: boolean = false;

  private static readonly TEXTS = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
    "Programming is not about what you know; it is about what you can figure out. Every expert was once a beginner.",
    "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code.",
    "TypeScript is a programming language developed by Microsoft. It is a strict syntactical superset of JavaScript.",
    "The best way to learn programming is by writing programs. Practice makes perfect in the world of software development.",
    "In terminal-based environments, command-line interfaces provide powerful tools for system administration and development workflows.",
    "Modern web development involves understanding frameworks, libraries, databases, and deployment strategies for scalable applications.",
    "Version control systems like Git enable collaborative development and help track changes in source code over time.",
  ];

  constructor(customText?: string) {
    this.text = customText || TypingTest.TEXTS[Math.floor(Math.random() * TypingTest.TEXTS.length)];
  }

  start(): void {
    this.isActive = true;
    this.startTime = new Date();
    this.userInput = '';
    this.errors = 0;
    this.endTime = null;
  }

  addCharacter(char: string): boolean {
    if (!this.isActive) return false;

    this.userInput += char;
    const currentIndex = this.userInput.length - 1;
    
    if (this.text[currentIndex] !== char) {
      this.errors++;
    }

    if (this.userInput.length === this.text.length) {
      this.finish();
      return true;
    }

    return false;
  }

  removeCharacter(): void {
    if (!this.isActive || this.userInput.length === 0) return;
    this.userInput = this.userInput.slice(0, -1);
  }

  finish(): TypingTestResult {
    this.isActive = false;
    this.endTime = new Date();
    return this.getResults();
  }

  getResults(): TypingTestResult {
    if (!this.startTime) {
      return {
        wpm: 0,
        accuracy: 0,
        errors: 0,
        timeElapsed: 0,
        charactersTyped: 0
      };
    }

    const endTime = this.endTime || new Date();
    const timeElapsed = (endTime.getTime() - this.startTime.getTime()) / 1000 / 60; // in minutes
    const wordsTyped = this.userInput.length / 5; // Standard: 5 characters = 1 word
    const wpm = Math.round(wordsTyped / timeElapsed);
    
    const correctChars = this.userInput.split('').filter((char, index) => 
      char === this.text[index]
    ).length;
    const accuracy = this.userInput.length > 0 
      ? Math.round((correctChars / this.userInput.length) * 100)
      : 100;

    return {
      wpm: isNaN(wpm) ? 0 : wpm,
      accuracy,
      errors: this.errors,
      timeElapsed: Math.round(timeElapsed * 60), // convert back to seconds
      charactersTyped: this.userInput.length
    };
  }

  getDisplayText(): string {
    const lines: string[] = [];
    
    // Split text into chunks for better display
    const words = this.text.split(' ');
    let currentLine = '';
    const maxLineLength = 60;

    for (const word of words) {
      if (currentLine.length + word.length + 1 > maxLineLength) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    // Colorize based on user input
    let charIndex = 0;
    const colorizedLines = lines.map(line => {
      let colorizedLine = '';
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (charIndex < this.userInput.length) {
          // Already typed
          if (this.userInput[charIndex] === char) {
            colorizedLine += chalk.green(char);
          } else {
            colorizedLine += chalk.red(char);
          }
        } else if (charIndex === this.userInput.length) {
          // Current character
          colorizedLine += chalk.bgWhite.black(char);
        } else {
          // Not yet typed
          colorizedLine += chalk.gray(char);
        }
        charIndex++;
      }
      charIndex++; // Account for space/newline between lines
      return colorizedLine;
    });

    return colorizedLines.join('\n');
  }

  getProgressDisplay(): string {
    const progress = (this.userInput.length / this.text.length) * 100;
    const results = this.getResults();
    
    const progressBar = Display.progressBar(this.userInput.length, this.text.length);
    
    return [
      Display.keyValue('Progress', `${Math.round(progress)}%`),
      progressBar,
      '',
      Display.keyValue('WPM', results.wpm.toString()),
      Display.keyValue('Accuracy', `${results.accuracy}%`),
      Display.keyValue('Errors', results.errors.toString()),
      Display.keyValue('Characters', `${this.userInput.length}/${this.text.length}`)
    ].join('\n');
  }

  static formatResults(results: TypingTestResult): string {
    const content = [
      Display.keyValue('Words per Minute', results.wpm.toString()),
      Display.keyValue('Accuracy', `${results.accuracy}%`),
      Display.keyValue('Errors', results.errors.toString()),
      Display.keyValue('Time Elapsed', `${results.timeElapsed}s`),
      Display.keyValue('Characters Typed', results.charactersTyped.toString())
    ].join('\n');

    return Display.box(content, '🏆 Typing Test Results');
  }
} 