#!/usr/bin/env node

// Simple test script to run the CLI locally
const { spawn } = require('child_process');
const path = require('path');

const cliPath = path.join(__dirname, 'dist', 'index.js');

async function testCLI() {
  console.log('Testing Sreeragh CLI...\n');
  
  const tests = [
    ['--help'],
    ['--version'],
    ['about'],
    ['skills'],
    ['works'],
    ['contact']
  ];

  for (const args of tests) {
    console.log(`Testing: sreeragh ${args.join(' ')}`);
    console.log('─'.repeat(50));
    
    try {
      const child = spawn('node', [cliPath, ...args], {
        stdio: 'inherit'
      });
      
      await new Promise((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Command failed with code ${code}`));
          }
        });
        
        child.on('error', reject);
      });
      
      console.log('\n✅ Test passed\n');
    } catch (error) {
      console.log(`\n❌ Test failed: ${error.message}\n`);
    }
  }
  
  console.log('All tests completed!');
}

testCLI().catch(console.error); 