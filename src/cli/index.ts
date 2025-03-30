import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { copyDir } from './utils';

export async function main(projectName: string): Promise<void> {
  const spinner = ora(`Creating ${chalk.blue(projectName)}...`).start();
  
  try {
    // 1. Create project directory
    const projectPath = path.resolve(projectName);
    fs.mkdirSync(projectPath);

    // 2. Copy templates
    await copyDir(
      path.join(__dirname, '../../templates'),
      projectPath
    );

    // 3. Update package.json name
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.name = projectName;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    spinner.succeed(chalk.green('Project created!'));
    console.log(`
Next steps:
  ${chalk.cyan(`cd ${projectName}`)}
  ${chalk.cyan('npm install')}
  ${chalk.cyan('npm start')}
    `);
  } catch (error) {
    spinner.fail(chalk.red('Creation failed'));
    throw error;
  }
}