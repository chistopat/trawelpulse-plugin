import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => JSON.parse(readFileSync(root + path, 'utf8'));
const base = 'plugins/trawelpulse/';
const pkg = read('package.json');
const portable = read(base + 'plugin.json');
const codex = read(base + '.codex-plugin/plugin.json');
const claude = read(base + '.claude-plugin/plugin.json');
for (const manifest of [portable, codex, claude]) {
  assert.equal(manifest.name, 'trawelpulse');
  assert.equal(manifest.version, pkg.version);
}
assert.deepEqual(portable.extensions['com.openai'].interface, codex.interface);
for (const path of ['mcp.json', codex.mcpServers.slice(2), '.mcp.json']) {
  const server = read(base + path).mcpServers.trawelpulse;
  assert.equal(server.url, 'https://trawelpulse.com/mcp');
  assert.equal(server.headers, undefined, 'Credentials must not be bundled');
}
assert.equal(read(base + 'mcp.json').mcpServers.trawelpulse.type, 'streamable-http');
assert.equal(read(base + '.mcp.json').mcpServers.trawelpulse.type, 'http');
assert.equal(read(base + 'mcp.json').mcpServers.trawelpulse.extensions['com.openai'].auth.type, 'oauth');
for (const path of ['.agents/plugins/marketplace.json', '.claude-plugin/marketplace.json']) {
  const market = read(path);
  assert.equal(market.name, 'trawelpulse');
  assert.equal(market.plugins.length, 1);
  const entry = market.plugins[0];
  assert.equal(entry.name, portable.name);
  const source = typeof entry.source === 'string' ? entry.source : entry.source.path;
  assert.equal(source, './plugins/trawelpulse');
  assert.ok(existsSync(root + source));
}
assert.ok(existsSync(root + base + codex.skills + 'trawelpulse/SKILL.md'));
console.log('Plugin manifests, marketplace paths, versions and OAuth configuration are valid.');
