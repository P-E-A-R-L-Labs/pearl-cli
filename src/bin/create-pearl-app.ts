#!/usr/bin/env node
import { main } from '../cli';

// Validate project name
const projectName = process.argv[2];
if (!projectName) {
  console.error('Error: Project name is required');
  console.log('Usage: npx create-pearl-app <project_name>');
  process.exit(1);
}

main(projectName).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});