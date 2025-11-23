#!/usr/bin/env node

/**
 * CSS Design Token Linter
 * Scans CSS files for hardcoded values that should use design tokens
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ALLOWED_ZERO_VALUES = ['0', '0px', '0%', '0em', '0rem'];
const ALLOWED_PERCENTAGES = /^(100%|50%|0%|auto)$/;
const ALLOWED_VIEWPORT_UNITS = /^(100vh|100vw|90vh|1fr)$/;
const ALLOWED_KEYWORDS = ['inherit', 'auto', 'none', 'transparent', 'currentColor', 'unset', 'initial'];

// Properties that should use design tokens
const TOKEN_RULES = {
  color: {
    pattern: /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/,
    token: '--color-*',
    message: 'Use a color token like var(--color-neutrals-*) or var(--color-primary-*)',
  },
  'background-color': {
    pattern: /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/,
    token: '--color-*',
    message: 'Use a color token like var(--color-neutrals-*) or var(--color-primary-*)',
  },
  background: {
    pattern: /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/,
    token: '--color-*',
    message: 'Use a color token like var(--color-neutrals-*) or var(--color-primary-*)',
  },
  'border-color': {
    pattern: /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/,
    token: '--color-*',
    message: 'Use a color token like var(--color-border-*)',
  },
  padding: {
    pattern: /\d+px/,
    token: '--spacing-*',
    message: 'Use a spacing token like var(--spacing-1) through var(--spacing-6)',
  },
  margin: {
    pattern: /\d+px/,
    token: '--spacing-*',
    message: 'Use a spacing token like var(--spacing-1) through var(--spacing-6)',
  },
  gap: {
    pattern: /\d+px/,
    token: '--spacing-*',
    message: 'Use a spacing token like var(--spacing-1) through var(--spacing-6)',
  },
  'box-shadow': {
    pattern: /\d+px.*rgba?\(|0\s+\d+px/,
    token: '--shadow-*',
    message: 'Use a shadow token like var(--shadow-card) or var(--shadow-modal)',
  },
  'text-shadow': {
    pattern: /\d+px.*rgba?\(|0\s+\d+px/,
    token: '--shadow-*',
    message: 'Use a shadow token like var(--shadow-text-*)',
  },
  'font-family': {
    pattern: /'[^']+',|"[^"]+",/,
    token: '--font-*',
    message: 'Use a font token like var(--font-heading) or var(--font-body)',
  },
  'font-weight': {
    pattern: /^(400|500|600|700)$/,
    token: '--font-weight-*',
    message: 'Use a font weight token like var(--font-weight-regular) or var(--font-weight-bold)',
  },
  'border-radius': {
    pattern: /\d+px/,
    token: '--border-radius-*',
    message: 'Use a border radius token like var(--border-radius-sm) or var(--border-radius-md)',
  },
  transition: {
    pattern: /\d+\.?\d*s/,
    token: '--transition-*',
    message: 'Use a transition token like var(--transition-fast)',
  },
};

// Track errors
let totalErrors = 0;
let totalWarnings = 0;
const errorsByFile = new Map();

/**
 * Check if a value uses a design token
 */
function usesDesignToken(value) {
  return value && value.includes('var(--');
}

/**
 * Check if a value is an allowed exception
 */
function isAllowedException(value) {
  if (!value) return false;
  const valueStr = String(value).trim();
  
  // Allow 0 values
  if (ALLOWED_ZERO_VALUES.includes(valueStr)) return true;
  
  // Allow specific percentages
  if (ALLOWED_PERCENTAGES.test(valueStr)) return true;
  
  // Allow viewport units
  if (ALLOWED_VIEWPORT_UNITS.test(valueStr)) return true;
  
  // Allow calc() with tokens
  if (valueStr.includes('calc(') && valueStr.includes('var(--')) return true;
  
  // Allow keywords
  if (ALLOWED_KEYWORDS.includes(valueStr)) return true;
  
  // Allow gradient with tokens
  if (valueStr.includes('gradient') && valueStr.includes('var(--')) return true;
  
  return false;
}

/**
 * Parse CSS and check for violations
 */
function lintCssFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const errors = [];
  
  // Simple CSS parser - matches property: value;
  const cssPropertyPattern = /^\s*([\w-]+)\s*:\s*([^;]+);/;
  
  lines.forEach((line, index) => {
    const match = line.match(cssPropertyPattern);
    if (!match) return;
    
    const [, property, value] = match;
    const lineNumber = index + 1;
    
    // Skip if already using a token
    if (usesDesignToken(value)) return;
    
    // Skip if it's an allowed exception
    if (isAllowedException(value)) return;
    
    // Skip CSS variable definitions
    if (property.startsWith('--')) return;
    
    // Check against token rules
    const rule = TOKEN_RULES[property];
    if (rule && rule.pattern.test(value)) {
      errors.push({
        line: lineNumber,
        property,
        value: value.trim(),
        message: rule.message,
        token: rule.token,
      });
    }
    
    // Check for any hardcoded colors in any property
    if (!rule && /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/.test(value)) {
      errors.push({
        line: lineNumber,
        property,
        value: value.trim(),
        message: 'Use a color token like var(--color-*)',
        token: '--color-*',
      });
    }
    
    // Check for hardcoded pixels in spacing-related properties
    if (!rule && /^(top|left|right|bottom|width|height)$/.test(property) && /\d+px/.test(value) && !isAllowedException(value)) {
      errors.push({
        line: lineNumber,
        property,
        value: value.trim(),
        message: 'Consider using a spacing token like var(--spacing-*)',
        token: '--spacing-*',
      });
    }
  });
  
  return errors;
}

/**
 * Recursively find all CSS files
 */
function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and dist
      if (file !== 'node_modules' && file !== 'dist') {
        findCssFiles(filePath, fileList);
      }
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Format and print results
 */
function printResults() {
  console.log('\n🎨 Design Token Linter Results\n');
  console.log('═'.repeat(80));
  
  if (errorsByFile.size === 0) {
    console.log('\n✅ No hardcoded values found! All CSS files are using design tokens correctly.\n');
    return true;
  }
  
  let hasErrors = false;
  
  errorsByFile.forEach((errors, file) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`\n📄 ${relativePath}`);
    console.log('─'.repeat(80));
    
    errors.forEach(error => {
      hasErrors = true;
      totalErrors++;
      
      console.log(`  Line ${error.line}: ${error.property}: ${error.value}`);
      console.log(`  ❌ ${error.message}`);
      console.log(`  💡 Suggested token: ${error.token}\n`);
    });
  });
  
  console.log('═'.repeat(80));
  console.log(`\n📊 Summary: ${totalErrors} violations found in ${errorsByFile.size} files\n`);
  
  return !hasErrors;
}

/**
 * Main execution
 */
function main() {
  const srcDir = path.join(path.dirname(__dirname), 'src');
  
  console.log('🔍 Scanning CSS files for hardcoded values...\n');
  
  const cssFiles = findCssFiles(srcDir);
  console.log(`Found ${cssFiles.length} CSS files to check\n`);
  
  cssFiles.forEach(file => {
    const errors = lintCssFile(file);
    if (errors.length > 0) {
      errorsByFile.set(file, errors);
    }
  });
  
  const success = printResults();
  
  if (!success) {
    console.log('💡 To fix these issues:');
    console.log('   1. Replace hardcoded colors with var(--color-*) tokens');
    console.log('   2. Replace hardcoded spacing with var(--spacing-*) tokens');
    console.log('   3. Replace hardcoded shadows with var(--shadow-*) tokens');
    console.log('   4. Replace hardcoded fonts with var(--font-*) tokens');
    console.log('   5. See design-system/global.css for all available tokens\n');
    
    process.exit(1);
  }
  
  process.exit(0);
}

main();


