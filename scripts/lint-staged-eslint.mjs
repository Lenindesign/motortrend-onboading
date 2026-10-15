#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ESLint } from 'eslint';

const projectRoot = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const stagedFiles = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
  cwd: projectRoot,
  encoding: 'utf8',
})
  .split('\n')
  .filter(file => /\.[cm]?[jt]sx?$/i.test(file));

if (stagedFiles.length === 0) {
  console.log('No staged JavaScript or TypeScript files to lint.');
  process.exit(0);
}

const eslint = new ESLint();
const introducedErrors = [];

for (const file of stagedFiles) {
  const currentSource = execFileSync('git', ['show', `:${file}`], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  let baselineSource = '';
  try {
    baselineSource = execFileSync('git', ['show', `HEAD:${file}`], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    // A newly added file has no baseline diagnostics.
  }

  const [current] = await eslint.lintText(currentSource, { filePath: path.resolve(projectRoot, file) });
  const [baseline] = await eslint.lintText(baselineSource, { filePath: path.resolve(projectRoot, file) });

  const diagnosticKey = (result, message) => {
    const sourceLine = (result.source || '').split('\n')[message.line - 1] || '';
    return `${message.ruleId}|${message.message}|${sourceLine.trim()}`;
  };

  const remainingBaselineErrors = new Map();
  for (const message of baseline.messages) {
    if (message.severity !== 2) continue;
    const key = diagnosticKey(baseline, message);
    remainingBaselineErrors.set(key, (remainingBaselineErrors.get(key) || 0) + 1);
  }

  for (const message of current.messages) {
    if (message.severity !== 2) continue;
    const key = diagnosticKey(current, message);
    const baselineCount = remainingBaselineErrors.get(key) || 0;
    if (baselineCount > 0) {
      remainingBaselineErrors.set(key, baselineCount - 1);
    } else {
      introducedErrors.push(`${file}:${message.line}:${message.column} ${message.ruleId}: ${message.message}`);
    }
  }
}

if (introducedErrors.length > 0) {
  console.error(`ESLint found ${introducedErrors.length} new error(s) in staged files:`);
  introducedErrors.forEach(error => console.error(`  ${error}`));
  process.exit(1);
}

console.log(`ESLint found no new errors in ${stagedFiles.length} staged JavaScript/TypeScript file(s).`);
