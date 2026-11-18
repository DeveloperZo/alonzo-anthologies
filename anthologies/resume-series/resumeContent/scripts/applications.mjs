#!/usr/bin/env node
// Application log, read from the manifests in applications/<id>.json (gitignored).
//
//   npm run apply:list                                  table of every application
//   npm run apply:status -- <id> <status> ["note"]      set a status and log it in the history
//
// Statuses: draft, ready, applied, interviewing, offer, rejected, withdrawn.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = join(repoRoot, 'applications');
const STATUSES = ['draft', 'ready', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
const today = () => new Date().toISOString().slice(0, 10);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function manifests() {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'answers.json')
    .map((f) => ({ file: join(dir, f), data: JSON.parse(readFileSync(join(dir, f), 'utf8')) }));
}

function list() {
  const rows = manifests().map(({ data }) => [
    data.id,
    data.company,
    data.role,
    data.status,
    data.dates?.applied || '',
    data.history?.at(-1)?.date || data.dates?.created || '',
  ]);
  if (!rows.length) {
    console.log('No applications yet. Copy applications/_templates/manifest.example.json to applications/<id>.json.');
    return;
  }
  const head = ['id', 'company', 'role', 'status', 'applied', 'last update'];
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (r) => r.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  console.log(line(head));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  rows.sort((a, b) => String(b[5]).localeCompare(String(a[5]))).forEach((r) => console.log(line(r)));
}

function setStatus(id, status, note) {
  if (!id || !status) fail('Usage: npm run apply:status -- <id> <status> ["note"]');
  if (!STATUSES.includes(status)) fail(`Unknown status "${status}". Use one of: ${STATUSES.join(', ')}`);
  const entry = manifests().find(({ data }) => data.id === id);
  if (!entry) fail(`No manifest with id "${id}" in applications/.`);
  const { file, data } = entry;
  data.status = status;
  data.dates = data.dates || {};
  if (status === 'applied' && !data.dates.applied) data.dates.applied = today();
  data.history = [...(data.history || []), { date: today(), status, ...(note ? { note } : {}) }];
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${id}: ${status}${note ? ` (${note})` : ''}`);
}

const [command, ...args] = process.argv.slice(2);
if (command === 'status') setStatus(...args);
else list();
