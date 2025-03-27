import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function copyDir(src: string, dest: string): Promise<void> {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory() 
      ? await copyDir(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }));
}

export async function openFileInEditor(filePath: string): Promise<void> {
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${filePath}"`, { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      execSync(`open "${filePath}"`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open "${filePath}"`, { stdio: 'ignore' });
    }
  } catch {
    // Silent fallback
  }
}