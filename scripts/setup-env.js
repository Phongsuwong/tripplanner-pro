#!/usr/bin/env node

/**
 * This script helps set up the environment variables for the project.
 * It copies .env.example to .env if .env doesn't exist and prompts for values.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rootDir = path.resolve(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env file already exists
if (fs.existsSync(envPath)) {
  console.log('\x1b[33m%s\x1b[0m', '.env file already exists. Delete it first if you want to recreate it.');
  rl.close();
  process.exit(0);
}

// Check if .env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.log('\x1b[31m%s\x1b[0m', 'Error: .env.example file not found!');
  rl.close();
  process.exit(1);
}

// Read the example file
const envExample = fs.readFileSync(envExamplePath, 'utf8');
const envLines = envExample.split('\n').filter(line => 
  line.trim() && !line.trim().startsWith('#')
);

// Parse the variable names
const envVars = envLines.map(line => {
  const match = line.match(/^([^=]+)=/);
  return match ? match[1] : null;
}).filter(Boolean);

console.log('\x1b[36m%s\x1b[0m', 'Setting up environment variables...');
console.log('Please provide values for the following variables:');

const answers = {};

// Ask for each environment variable
function askQuestion(i) {
  if (i >= envVars.length) {
    // All questions answered, write the .env file
    let envContent = '';
    
    // Recreate the file with comments and user values
    const exampleLines = envExample.split('\n');
    for (const line of exampleLines) {
      if (line.trim() && !line.trim().startsWith('#')) {
        const varName = line.split('=')[0];
        if (answers[varName]) {
          envContent += `${varName}=${answers[varName]}\n`;
        } else {
          envContent += `${line}\n`;
        }
      } else {
        envContent += `${line}\n`;
      }
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('\x1b[32m%s\x1b[0m', '.env file created successfully!');
    rl.close();
    return;
  }

  const varName = envVars[i];
  rl.question(`${varName}: `, (answer) => {
    answers[varName] = answer;
    askQuestion(i + 1);
  });
}

// Start asking questions
askQuestion(0);