#!/usr/bin/env node
// Builds the application package for one company: resume.pdf and cover-letter.pdf.
//
//   npm run apply:package -- <id>        e.g. npm run apply:package -- gtreasury
//   npm run apply:package -- base        untailored resume with the base cover letter
//
// <id> names the tailoring overlay (src/data/tailoring/<id>.ts) and the cover letter folder
// (coverLetters/<id>/). With no <id>, it is taken from the branch name resume/<id>-<role>.
// Output goes to applications/<id>/package/, which is gitignored.
//
// The resume PDF is printed from the built site, so it is real text an ATS can parse. The in-app
// "Download PDF" button makes an image PDF instead.
import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, rmSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(appDir, '..');

function fail(message) {
  console.error(`\napply:package failed: ${message}`);
  process.exit(1);
}

function resolveId() {
  const arg = process.argv[2];
  if (arg) return arg.trim().toLowerCase();
  let branch = '';
  try {
    branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: repoRoot }).toString().trim();
  } catch {
    // not a git checkout
  }
  const match = branch.match(/^resume\/([a-z0-9]+)/);
  if (!match) fail(`no company id given and branch "${branch}" is not resume/<id>-<role>. Run: npm run apply:package -- <id>`);
  return match[1];
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) fail('no Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.');
  return found;
}

function run(cmd, args, options) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...options });
    child.on('exit', (code) => (code === 0 ? resolvePromise() : reject(new Error(`${cmd} exited with ${code}`))));
    child.on('error', reject);
  });
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain' };

// Serves the build under /resume/, which is the app's homepage path.
function serve(buildDir) {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent((req.url || '/').split('?')[0]);
      const rel = url.replace(/^\/resume\/?/, '');
      let file = join(buildDir, rel || 'index.html');
      if (!file.startsWith(buildDir) || !existsSync(file) || statSync(file).isDirectory()) file = join(buildDir, 'index.html');
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => resolvePromise(server));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Edge and Chrome can exit their launcher process before the renderer has written the PDF,
// so wait for the file to appear and stop growing before treating the print as done.
async function waitForFile(file, timeoutMs = 60000) {
  const start = Date.now();
  let lastSize = -1;
  while (Date.now() - start < timeoutMs) {
    if (existsSync(file)) {
      const size = statSync(file).size;
      if (size > 0 && size === lastSize) return true;
      lastSize = size;
    }
    await sleep(500);
  }
  return false;
}

async function printToPdf(browser, url, outFile, profileDir) {
  rmSync(outFile, { force: true });
  await run(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${profileDir}`,
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${outFile}`,
    url,
  ], { shell: false, stdio: 'ignore' });
  if (!(await waitForFile(outFile))) fail(`the browser did not write ${outFile} within 60 seconds`);
}

function describePdf(file) {
  const raw = readFileSync(file).toString('latin1');
  const pages = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const hasText = /\/Font/.test(raw);
  return { pages, hasText, kb: Math.round(statSync(file).size / 1024) };
}

async function main() {
  const id = resolveId();
  const tailored = id !== 'base';
  if (tailored && !existsSync(join(appDir, 'src', 'data', 'tailoring', `${id}.ts`))) {
    fail(`no overlay at resumeContent/src/data/tailoring/${id}.ts`);
  }
  let coverDir = join(repoRoot, 'coverLetters', tailored ? id : '_base');
  if (!existsSync(join(coverDir, 'career-profile.html'))) {
    console.warn(`No coverLetters/${id}/career-profile.html. Using the base cover letter instead.`);
    coverDir = join(repoRoot, 'coverLetters', '_base');
  }

  const outDir = join(repoRoot, 'applications', id, 'package');
  const buildDir = join(outDir, '.site');
  const profileDir = join(outDir, '.browser');
  mkdirSync(outDir, { recursive: true });
  rmSync(buildDir, { recursive: true, force: true });

  console.log(`\n==> Building the resume${tailored ? ` with the "${id}" overlay` : ' untailored'}`);
  await run('npx', ['react-scripts', 'build'], {
    cwd: appDir,
    env: { ...process.env, REACT_APP_TAILORING: tailored ? id : '', BUILD_PATH: buildDir, GENERATE_SOURCEMAP: 'false', CI: 'false' },
  });

  const browser = findBrowser();
  const server = await serve(buildDir);
  const { port } = server.address();
  try {
    console.log('==> Printing resume.pdf');
    await printToPdf(browser, `http://127.0.0.1:${port}/resume/#/resume?print=1`, join(outDir, 'resume.pdf'), profileDir);
  } finally {
    server.close();
  }

  console.log('==> Printing cover-letter.pdf');
  await printToPdf(browser, pathToFileURL(join(coverDir, 'career-profile.html')).href, join(outDir, 'cover-letter.pdf'), profileDir);

  const resume = describePdf(join(outDir, 'resume.pdf'));
  const cover = describePdf(join(outDir, 'cover-letter.pdf'));
  if (!resume.hasText) fail('resume.pdf has no text layer, so an ATS could not read it.');
  console.log(`\nPackage ready in ${outDir}`);
  console.log(`  resume.pdf        ${resume.pages} page(s), ${resume.kb} KB, text layer present`);
  console.log(`  cover-letter.pdf  ${cover.pages} page(s), ${cover.kb} KB`);
}

main().catch((error) => fail(error.message));
