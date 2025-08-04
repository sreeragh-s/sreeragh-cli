#!/usr/bin/env node

import { SreeraghCLI } from './cli';
import { Display } from './utils/display';

async function main() {
  try {
    const cli = new SreeraghCLI();
    await cli.run(process.argv);
  } catch (error) {
    console.error(Display.error('An unexpected error occurred:'));
    console.error(error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(Display.error('Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(Display.error('Uncaught Exception:'), error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n' + Display.info('Thanks for using Sreeragh CLI! 👋'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n' + Display.info('Shutting down gracefully...'));
  process.exit(0);
});

if (require.main === module) {
  main();
} 