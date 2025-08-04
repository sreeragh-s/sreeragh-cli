# Sreeragh CLI

An interactive command-line interface for exploring Sreeragh's portfolio, built with TypeScript and Node.js.

## Features

- 🚀 **Interactive Portfolio**: Explore projects, skills, and experience
- ⌨️ **Typing Test**: Built-in typing test with real-time feedback
- 📝 **Blog Integration**: Read blog posts directly from the CLI
- 🎨 **Beautiful UI**: Colorful and well-formatted terminal output
- 📊 **Real-time Data**: Fetches live data from https://sreeragh.me
- 🔧 **Cross-platform**: Works on Windows, macOS, and Linux

## Installation

### Global Installation (Recommended)

```bash
npm install -g sreeragh-cli
```

### From Source

```bash
git clone <repository-url>
cd sreeragh
npm install
npm run build
npm link
```

## Usage

### Basic Commands

```bash
# Show general information
sreeragh about

# View projects and works
sreeragh works
sreeragh works --interactive  # Interactive mode
sreeragh works --list        # List format

# View technical skills
sreeragh skills
sreeragh skills frontend     # Specific category

# Start typing test
sreeragh typing
sreeragh typing 60          # 60-second test

# Contact information
sreeragh contact

# Blog posts
sreeragh blog

# Interactive mode
sreeragh interactive
```

### Command Aliases

Most commands have convenient aliases:

- `about` → `whoami`, `info`
- `works` → `projects`, `portfolio`
- `skills` → `tech`, `stack`
- `typing` → `type`, `monkeytype`

### Options

```bash
# Show help
sreeragh --help
sreeragh <command> --help

# Version information
sreeragh --version

# Verbose output
sreeragh --verbose <command>

# Disable colors
sreeragh --no-color <command>
```

## Examples

### Explore Projects Interactively

```bash
sreeragh works --interactive
```

This will show an interactive list where you can:
- Navigate with arrow keys
- View detailed project information
- Open project URLs in your browser

### Quick Skills Lookup

```bash
# View all skills
sreeragh skills

# View frontend skills only
sreeragh skills frontend

# View backend skills only
sreeragh skills backend
```

### Typing Test

```bash
# Default 60-second test
sreeragh typing

# Custom duration (10-300 seconds)
sreeragh typing 30
sreeragh typing 120
```

The typing test includes:
- Real-time WPM calculation
- Accuracy tracking
- Error counting
- Performance feedback
- Colorized text (green for correct, red for errors)

## Development

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd sreeragh

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

### Project Structure

```
src/
├── commands/          # Command implementations
│   ├── about.ts
│   ├── works.ts
│   ├── skills.ts
│   └── typing.ts
├── services/          # API and external services
│   └── api.ts
├── utils/             # Utility functions
│   ├── display.ts
│   └── typing-test.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── cli.ts             # Main CLI application class
└── index.ts           # Entry point
```

### Adding New Commands

1. Create a new command class in `src/commands/`
2. Extend `BaseCommand`
3. Implement required methods and properties
4. Register the command in `src/cli.ts`

Example:

```typescript
import { BaseCommand } from './base';
import { CLIContext } from '../types';

export class NewCommand extends BaseCommand {
  name = 'new';
  description = 'A new command';
  aliases = ['n'];

  async execute(args: string[], context: CLIContext): Promise<void> {
    this.log('Hello from new command!');
  }
}
```

## API Integration

The CLI fetches data from https://sreeragh.me with the following endpoints:

- `GET /api/portfolio` - Portfolio data
- `GET /api/blog` - Blog posts
- `GET /api/blog/:slug` - Individual blog post

The CLI includes fallback mechanisms and graceful error handling when the API is unavailable.

## Dependencies

### Runtime Dependencies

- `axios` - HTTP client for API requests
- `chalk` - Terminal styling
- `commander` - Command-line argument parsing
- `inquirer` - Interactive prompts
- `ora` - Loading spinners
- `boxen` - Terminal boxes
- `figlet` - ASCII art text
- `gradient-string` - Gradient text effects

### Development Dependencies

- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `@types/*` - Type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Contact

- **Email**: hey@sreeragh.me
- **GitHub**: https://github.com/sreeragh-s/
- **Twitter**: https://x.com/sreeragh_s
- **Website**: https://sreeragh.me

---

Built with ❤️ by Sreeragh S 