import fs from 'fs';
import path from 'path';

// 1. Create dist directory
fs.mkdirSync('dist', { recursive: true });

// 2. Copy source files as-is
const copyRecursiveSync = (src: string, dest: string) => {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    fs.statSync(srcPath).isDirectory()
      ? copyRecursiveSync(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  });
};

// Copy CLI files
copyRecursiveSync('dist/src', 'src');

// Make bin file executable
fs.chmodSync('dist/src/bin/create-pearl-app.ts', 0o755);