import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';

export class Display {
  static success(message: string): string {
    return chalk.green(`✓ ${message}`);
  }

  static error(message: string): string {
    return chalk.red(`✗ ${message}`);
  }

  static warning(message: string): string {
    return chalk.yellow(`⚠ ${message}`);
  }

  static info(message: string): string {
    return chalk.blue(`ℹ ${message}`);
  }

  static highlight(text: string): string {
    return chalk.cyan(text);
  }

  static dim(text: string): string {
    return chalk.gray(text);
  }

  static bold(text: string): string {
    return chalk.bold(text);
  }

  static box(content: string, title?: string): string {
    return boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      title: title,
      titleAlignment: 'center'
    });
  }

  static header(text: string): string {
    const banner = figlet.textSync(text, {
      font: 'Small',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });
    return gradient.rainbow(banner);
  }

  static table(headers: string[], rows: string[][]): string {
    const maxWidths = headers.map((header, i) => 
      Math.max(header.length, ...rows.map(row => (row[i] || '').length))
    );

    const separator = '├' + maxWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
    const topBorder = '┌' + maxWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
    const bottomBorder = '└' + maxWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';

    const formatRow = (row: string[], isHeader = false) => {
      const formattedCells = row.map((cell, i) => 
        (cell || '').padEnd(maxWidths[i])
      );
      const content = '│ ' + formattedCells.join(' │ ') + ' │';
      return isHeader ? chalk.bold.cyan(content) : content;
    };

    const result = [
      topBorder,
      formatRow(headers, true),
      separator,
      ...rows.map(row => formatRow(row)),
      bottomBorder
    ];

    return result.join('\n');
  }

  static list(items: string[], numbered = false): string {
    return items.map((item, index) => {
      const bullet = numbered ? `${index + 1}.` : '•';
      return `  ${chalk.cyan(bullet)} ${item}`;
    }).join('\n');
  }

  static progressBar(current: number, total: number, width = 40): string {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * width);
    const empty = width - filled;
    
    const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    return `[${bar}] ${percentage}%`;
  }

  static section(title: string, content: string): string {
    return [
      chalk.bold.underline(title),
      '',
      content,
      ''
    ].join('\n');
  }

  static keyValue(key: string, value: string, padLength = 20): string {
    return `${chalk.cyan(key.padEnd(padLength))} : ${value}`;
  }

  static separator(char = '─', length = 50): string {
    return chalk.gray(char.repeat(length));
  }

  static emoji(text: string): string {
    const emojiMap: Record<string, string> = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️',
      'loading': '⏳',
      'rocket': '🚀',
      'gear': '⚙️',
      'globe': '🌐',
      'email': '📧',
      'phone': '📞',
      'location': '📍',
      'calendar': '📅',
      'clock': '🕐',
      'folder': '📁',
      'file': '📄',
      'code': '💻',
      'link': '🔗',
      'star': '⭐',
      'heart': '❤️',
      'fire': '🔥',
      'lightning': '⚡',
      'trophy': '🏆',
      'medal': '🏅',
      'thumbs-up': '👍',
      'wave': '👋',
      'sparkles': '✨'
    };
    
    return emojiMap[text] || text;
  }
} 