import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { 
  copyDir,
  openFileInEditor 
} from './utils';
import type { CreatePearlAppOptions } from './types';

const execAsync = promisify(exec);

export async function main(): Promise<void> {
  console.log(chalk.blue.bold('\n✨ Creating Pearl App...\n'));
  
  const options: CreatePearlAppOptions = {
    projectName: process.argv[2] || 'my-pearl-app',
    skipInstall: process.argv.includes('--no-install'),
    openEditor: !process.argv.includes('--no-editor')
  };

  const projectPath = path.resolve(options.projectName);
  
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Error: Directory "${options.projectName}" already exists`));
    process.exit(1);
  }

  const spinner = ora('Setting up project...').start();

  try {
    // Create project structure
    fs.mkdirSync(projectPath);
    await copyTemplateFiles(projectPath);

    // Update package.json
    await updatePackageJson(projectPath, options.projectName);

    // Install dependencies
    if (!options.skipInstall) {
      await installDependencies(projectPath, spinner);
    }

    // Set up environment
    await setupEnvironment(projectPath, options.openEditor);

    spinner.succeed(chalk.green('Project created successfully!'));
    showNextSteps(options);
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function copyTemplateFiles(destPath: string): Promise<void> {
  const templatePath = path.join(__dirname, '../../templates');
  await copyDir(templatePath, destPath);
}

async function updatePackageJson(projectPath: string, projectName: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = projectName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function installDependencies(projectPath: string, spinner: Ora): Promise<void> {
  spinner.text = 'Installing dependencies...';
  process.chdir(projectPath);
  await execAsync('npm install');
}

async function setupEnvironment(projectPath: string, openEditor: boolean): Promise<void> {
  const envExamplePath = path.join(projectPath, '.env.example');
  const envPath = path.join(projectPath, '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    if (openEditor) {
      await openFileInEditor(envPath);
    }
  }
}

function showNextSteps(options: CreatePearlAppOptions): void {
  console.log(chalk.cyan(`
Next steps:
1. ${chalk.bold(`cd ${options.projectName}`)}
2. ${chalk.bold('Edit .env file with your API keys')}
3. ${chalk.bold('npm start')} to begin chatting
${options.skipInstall ? chalk.yellow('\n⚠️  Remember to run "npm install" first') : ''}
`));
}