import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const installer = fileURLToPath(new URL('../scripts/plugin.mjs', import.meta.url));
function invoke(args, fail = '') {
  const dir = mkdtempSync(join(tmpdir(), 'trawelpulse-installer-'));
  const log = join(dir, 'calls.jsonl');
  try {
    for (const client of ['codex', 'claude']) {
      writeFileSync(join(dir, client), `#!${process.execPath}
import { appendFileSync } from 'node:fs';
const args = process.argv.slice(2);
appendFileSync(process.env.TEST_LOG, JSON.stringify(['${client}', ...args]) + '\\n');
if (process.env.TEST_FAIL === '${client}:' + args.join(' ')) process.exit(7);
`, { mode: 0o755 });
    }
    const result = spawnSync(process.execPath, [installer, ...args], {
      encoding: 'utf8', env: { ...process.env, PATH: dir, TEST_LOG: log, TEST_FAIL: fail },
    });
    let calls = [];
    try { calls = readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    return { ...result, calls };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

for (const client of ['codex', 'claude']) {
  test(`installs ${client} through native marketplace commands`, () => {
    const result = invoke(['install', client]);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.calls, [
      [client, 'plugin', '--help'],
      [client, 'plugin', 'marketplace', 'add', 'chistopat/trawelpulse-plugin'],
      [client, 'plugin', client === 'codex' ? 'add' : 'install', 'trawelpulse@trawelpulse'],
    ]);
  });
}
test('preflights both clients before installing', () => {
  const result = invoke(['install', 'both']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls.slice(0, 2), [['codex', 'plugin', '--help'], ['claude', 'plugin', '--help']]);
  assert.equal(result.calls.length, 6);
});
test('does not change either client if the second client lacks plugin support', () => {
  const result = invoke(['install', 'both'], 'claude:plugin --help');
  assert.equal(result.status, 1);
  assert.equal(result.calls.length, 2);
});
test('stops and preserves the exit code when marketplace setup fails', () => {
  const result = invoke(['install', 'both'], 'codex:plugin marketplace add chistopat/trawelpulse-plugin');
  assert.equal(result.status, 7);
  assert.equal(result.calls.length, 3);
});
test('rejects invalid input without starting clients', () => {
  for (const args of [['install', 'other'], ['install', 'codex', '--unexpected'], ['serve']]) {
    const result = invoke(args);
    assert.equal(result.status, 1);
    assert.deepEqual(result.calls, []);
  }
});
test('help does not start clients', () => {
  const result = invoke(['--help']);
  assert.equal(result.status, 0);
  assert.deepEqual(result.calls, []);
});
