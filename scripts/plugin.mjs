#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const usage = 'Usage: trawelpulse-plugin install codex|claude|both';
const [action, host, ...extra] = process.argv.slice(2);
if (['--help', '-h', 'help', undefined].includes(action)) {
  console.log(usage);
} else if (action !== 'install' || !['codex', 'claude', 'both'].includes(host) || extra.length) {
  console.error(usage);
  process.exitCode = 1;
} else if (Number(process.versions.node.split('.')[0]) < 22) {
  console.error('Trawel Pulse installer requires Node.js 22 or later.');
  process.exitCode = 1;
} else {
  const clients = host === 'both' ? ['codex', 'claude'] : [host];
  // Check both clients before changing either installation.
  for (const client of clients) {
    const check = spawnSync(client, ['plugin', '--help'], { encoding: 'utf8', shell: false });
    if (check.error || check.status !== 0) {
      console.error(`Install a current ${client} CLI with plugin support and make sure it is on PATH.`);
      process.exit(1);
    }
  }
  for (const client of clients) {
    for (const args of [
      ['plugin', 'marketplace', 'add', 'chistopat/trawelpulse-plugin'],
      ['plugin', client === 'codex' ? 'add' : 'install', 'trawelpulse@trawelpulse'],
    ]) {
      const result = spawnSync(client, args, { stdio: 'inherit', shell: false });
      if (result.error) console.error(`Could not start ${client}: ${result.error.message}`);
      if (result.error || result.status !== 0) process.exit(result.status || 1);
    }
    console.log(`Trawel Pulse installed in ${client}.`);
  }
  console.log('Start a new client session. Connect Trawel Pulse through the client’s browser sign-in flow.');
  if (clients.includes('claude')) console.log('In Claude Code, use /mcp to authenticate the Trawel Pulse server.');
}
