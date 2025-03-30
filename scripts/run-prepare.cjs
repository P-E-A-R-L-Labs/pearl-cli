// scripts/prepare.cjs
const fs = require('fs');
const path = require('path');

console.log('🔧 Running preparation...');

try {
  // 1. Clean and create dist directory
  const distPath = path.join(__dirname, '../dist');
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  // 2. Copy files
  const copyRecursive = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      fs.statSync(srcPath).isDirectory()
        ? copyRecursive(srcPath, destPath)
        : fs.copyFileSync(srcPath, destPath);
    });
  };

  // Copy src and templates
  copyRecursive(path.join(__dirname, '../src'), path.join(distPath, 'src'));
  copyRecursive(path.join(__dirname, '../templates'), path.join(distPath, 'templates'));

  console.log('✅ Preparation complete');
} catch (error) {
  console.error('❌ Preparation failed:', error);
  process.exit(1);
}