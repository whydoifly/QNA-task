#!/usr/bin/env node

/**
 * Mini SaaS Dashboard - Troubleshooting Script
 * Run this script to diagnose common setup and runtime issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Mini SaaS Dashboard - Troubleshooting Script');
console.log('================================================\n');

const issues = [];
const warnings = [];
const info = [];

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    info.push(`✅ Node.js version: ${nodeVersion} (Compatible)`);
  } else {
    issues.push(`❌ Node.js version: ${nodeVersion} (Requires 18.0.0 or higher)`);
  }
} catch (error) {
  issues.push('❌ Unable to check Node.js version');
}

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  info.push(`✅ npm version: ${npmVersion}`);
} catch (error) {
  warnings.push('⚠️  Unable to check npm version');
}

// Check if package.json exists
if (fs.existsSync('package.json')) {
  info.push('✅ package.json found');
  
  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    info.push('✅ node_modules directory found');
  } else {
    issues.push('❌ node_modules not found - Run: npm install');
  }
  
  // Check package.json content
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required dependencies
    const requiredDeps = ['next', 'react', 'react-dom'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      info.push('✅ Required dependencies found');
    } else {
      issues.push(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
    }
    
    // Check scripts
    if (packageJson.scripts && packageJson.scripts.dev) {
      info.push('✅ Development script found');
    } else {
      warnings.push('⚠️  No development script found');
    }
    
  } catch (error) {
    issues.push('❌ Unable to parse package.json');
  }
} else {
  issues.push('❌ package.json not found - Are you in the project directory?');
}

// Check project structure
const requiredFiles = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/data/projects.ts',
  'src/types/project.ts',
  'src/components/Modal.tsx',
  'src/components/ProjectForm.tsx'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length === 0) {
  info.push('✅ All required project files found');
} else {
  issues.push(`❌ Missing files: ${missingFiles.join(', ')}`);
}

// Check Next.js config
if (fs.existsSync('next.config.ts') || fs.existsSync('next.config.js')) {
  info.push('✅ Next.js configuration found');
} else {
  warnings.push('⚠️  Next.js configuration not found');
}

// Check TypeScript config
if (fs.existsSync('tsconfig.json')) {
  info.push('✅ TypeScript configuration found');
} else {
  warnings.push('⚠️  TypeScript configuration not found');
}

// Check Tailwind CSS
if (fs.existsSync('tailwind.config.ts') || fs.existsSync('tailwind.config.js')) {
  info.push('✅ Tailwind CSS configuration found');
} else {
  warnings.push('⚠️  Tailwind CSS configuration not found');
}

// Check if port 3000 is available
try {
  const net = require('net');
  const server = net.createServer();
  
  server.listen(3000, () => {
    info.push('✅ Port 3000 is available');
    server.close();
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      warnings.push('⚠️  Port 3000 is already in use');
    }
  });
} catch (error) {
  warnings.push('⚠️  Unable to check port availability');
}

// Check data file content
if (fs.existsSync('src/data/projects.ts')) {
  try {
    const dataContent = fs.readFileSync('src/data/projects.ts', 'utf8');
    if (dataContent.includes('dummyProjects') && dataContent.includes('export')) {
      info.push('✅ Project data file is properly formatted');
    } else {
      warnings.push('⚠️  Project data file may be malformed');
    }
  } catch (error) {
    warnings.push('⚠️  Unable to validate project data file');
  }
}

// Display results
console.log('📊 Diagnostic Results:');
console.log('=====================\n');

if (info.length > 0) {
  console.log('✅ SYSTEM INFO:');
  info.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  warnings.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (issues.length > 0) {
  console.log('❌ ISSUES FOUND:');
  issues.forEach(item => console.log(`   ${item}`));
  console.log('');
} else {
  console.log('🎉 No critical issues found!\n');
}

// Provide recommendations
console.log('💡 RECOMMENDATIONS:');
console.log('===================');

if (issues.length > 0) {
  console.log('1. Fix the issues listed above first');
  console.log('2. Run: npm install (if node_modules missing)');
  console.log('3. Ensure you\'re in the correct project directory');
  console.log('4. Try: npm run dev (after fixing issues)');
} else if (warnings.length > 0) {
  console.log('1. Address warnings if you encounter problems');
  console.log('2. Run: npm run dev (should work despite warnings)');
  console.log('3. Check browser console for any runtime errors');
} else {
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. You should see the dashboard with sample projects');
}

console.log('\n📚 For more help, see SUPPORT_PLAYBOOK.md');

// Exit with appropriate code
process.exit(issues.length > 0 ? 1 : 0);
