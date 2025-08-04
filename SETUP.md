# Sreeragh CLI Setup Guide

This guide will help you set up and run the Sreeragh CLI locally and prepare it for distribution.

## Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn
- Your portfolio website running at https://sreeragh.me with API endpoints

## Quick Start

### 1. Install Dependencies

```bash
cd sreeragh
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Test Locally

```bash
# Test the CLI directly
node dist/index.js --help
node dist/index.js about
node dist/index.js works

# Or use the dev script
npm run dev about
```

### 4. Link for Global Use (Optional)

```bash
npm link
sreeragh --help
```

## API Integration

The CLI fetches data from your website's API endpoints:

### Required API Endpoints

Make sure these endpoints are available on your website:

1. **GET /api/portfolio** - Returns portfolio data
2. **GET /api/blog** - Returns list of blog posts  
3. **GET /api/blog/[slug]** - Returns individual blog post

### API Response Format

#### Portfolio Data (`/api/portfolio`)
```json
{
  "profile": {
    "name": "Sreeragh",
    "title": "Hey, I'm Sreeragh 👋",
    "description": "...",
    "intro": "...",
    "email": "hey@sreeragh.me",
    "social": {
      "twitter": "https://x.com/sreeragh_s",
      "github": "https://github.com/sreeragh-s/",
      "linkedin": "...",
      "cal": "..."
    }
  },
  "works": [...],
  "skills": {...},
  "contact": {...}
}
```

#### Blog Posts (`/api/blog`)
```json
[
  {
    "slug": "post-slug",
    "title": "Post Title",
    "summary": "Post summary",
    "publishedAt": "2024-01-01"
  }
]
```

## Development

### Project Structure
```
src/
├── commands/          # Command implementations
├── services/          # API and external services  
├── utils/             # Utility functions
├── types/             # TypeScript definitions
├── cli.ts             # Main CLI class
└── index.ts           # Entry point
```

### Adding New Commands

1. Create a new file in `src/commands/`
2. Extend `BaseCommand` class
3. Register in `src/cli.ts`

### Available Scripts

```bash
npm run dev        # Run in development mode
npm run build      # Build for production
npm start          # Run built version
npm run prepare    # Build before install (auto-run)
```

## Publishing

### 1. Update Package Info

Edit `package.json`:
- Update version
- Set correct repository URL
- Update author info

### 2. Build and Test

```bash
npm run build
npm pack --dry-run
```

### 3. Publish to npm

```bash
npm login
npm publish
```

### 4. Global Installation

Users can then install globally:

```bash
npm install -g sreeragh-cli
sreeragh --help
```

## Troubleshooting

### API Connection Issues

If the CLI can't connect to your API:

1. Check that your website is running
2. Verify API endpoints return correct data
3. Check CORS headers are set properly
4. The CLI has fallback data if API fails

### Build Issues

If TypeScript compilation fails:

1. Check all dependencies are installed
2. Ensure TypeScript types are available
3. Run `npm install` again

### Permission Issues

If you get permission errors during global install:

```bash
# Option 1: Use npx
npx sreeragh-cli about

# Option 2: Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## Features

- ✅ Portfolio data display
- ✅ Project/works listing with interactive mode  
- ✅ Skills categorization
- ✅ Typing test with real-time feedback
- ✅ Contact information display
- ✅ Blog post integration
- ✅ Beautiful terminal UI with colors
- ✅ Cross-platform compatibility
- ✅ Error handling and fallbacks
- ✅ Caching and performance optimization

## Next Steps

1. Test all commands thoroughly
2. Add more interactive features
3. Implement blog post reading in terminal
4. Add search functionality
5. Create auto-update mechanism
6. Add configuration file support

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the logs for error messages
3. Test API endpoints directly
4. Create an issue with detailed error info

---

Happy coding! 🚀 