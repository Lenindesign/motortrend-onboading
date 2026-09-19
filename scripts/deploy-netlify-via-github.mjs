import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const shouldPush = args.has('--push');
const projectRoot = process.cwd();

function run(command, commandArgs) {
  execFileSync(command, commandArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
  });
}

if (!existsSync('netlify.toml')) {
  throw new Error('Missing netlify.toml; refusing to run the Netlify deployment harness.');
}

const remoteUrl = execFileSync('git', ['remote', 'get-url', 'origin'], {
  cwd: projectRoot,
  encoding: 'utf8',
}).trim();

if (!/github\.com[/:]/i.test(remoteUrl)) {
  throw new Error(`origin is not a GitHub remote (${remoteUrl}); refusing to publish.`);
}

console.log('Building the production bundle for Netlify...');
run('npm', ['run', 'build']);

if (!existsSync('dist/index.html')) {
  throw new Error('Build completed without dist/index.html; refusing to publish.');
}

if (!shouldPush) {
  console.log('\nBuild verified. Nothing was pushed.');
  console.log('To trigger the GitHub-connected Netlify deploy, run:');
  console.log('  npm run deploy:netlify -- --push');
  process.exit(0);
}

console.log(`Pushing HEAD to GitHub (${remoteUrl})...`);
run('git', ['push', 'origin', 'HEAD']);
console.log('Push complete. Netlify will deploy the GitHub update.');
