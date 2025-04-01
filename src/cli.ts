#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program
  .name('create-pearl-app')
  .description('Create a new pearl app with TypeScript support')
  .argument('<project-name>', 'Name of the project to create')
  .action((projectName: string) => {
    const targetDir = path.join(process.cwd(), projectName);
    
    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
      console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
      process.exit(1);
    }
    
    // Create project directory
    fs.mkdirSync(targetDir, { recursive: true });
    
    // Copy template files
    copyTemplateFiles(targetDir);
    
    // Update package.json name
    updatePackageJson(targetDir, projectName);
    
    console.log(chalk.green(`Successfully created ${projectName}`));
    console.log(chalk.cyan('To get started:'));
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    console.log('  npm run dev');
  });

function copyTemplateFiles(targetDir: string) {
  const templateDir = path.join(__dirname, '../template');
  
  // Copy all files from template directory
  fs.copySync(templateDir, targetDir, {
    filter: (src) => {
      // Skip node_modules if it exists in template
      return !src.includes('node_modules');
    }
  });
  
  // Create .gitignore (as it might be skipped during npm publish)
  fs.writeFileSync(
    path.join(targetDir, '.gitignore'),
    'node_modules\ndist\n.env\n'
  );
}

function updatePackageJson(targetDir: string, projectName: string) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = require(packageJsonPath);
  
  packageJson.name = projectName;
  packageJson.version = '0.1.0';
  
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
}

program.parse();