# Trawel Pulse plugin

Connect [Trawel Pulse](https://trawelpulse.com) to Codex and Claude Code as a
native plugin. Install from this GitHub repository, then sign in through your
client's browser OAuth flow. No custom MCP configuration or personal URL is
needed.

## Install with one command

Requires Node.js 22+ and a current Codex or Claude Code CLI on PATH.

Codex:

```sh
npx --yes --package=github:chistopat/trawelpulse-plugin trawelpulse-plugin install codex
```

Claude Code:

```sh
npx --yes --package=github:chistopat/trawelpulse-plugin trawelpulse-plugin install claude
```

Use `both` to install in both clients. The helper runs each client's native
marketplace and plugin commands. It does not edit MCP configuration files.
For `both`, both clients must be installed; if a later install fails, earlier
successful steps remain in place. Fix the reported error and rerun the command.

## Install directly from GitHub

No Node.js is needed for the plugin itself or for these native commands.

Codex:

```sh
codex plugin marketplace add chistopat/trawelpulse-plugin
codex plugin add trawelpulse@trawelpulse
```

Claude Code:

```sh
claude plugin marketplace add chistopat/trawelpulse-plugin
claude plugin install trawelpulse@trawelpulse
```

Inside Claude Code, the equivalent commands are:

```text
/plugin marketplace add chistopat/trawelpulse-plugin
/plugin install trawelpulse@trawelpulse
```

For clients with an **Add marketplace** repository field, use
`https://github.com/chistopat/trawelpulse-plugin`, then install **Trawel Pulse**.
This repository is a marketplace source; it is not a listing in either
provider's public plugin directory. Repository marketplace support varies by
client. The terminal commands above target Codex and Claude Code.

## Sign in and use

Start a new client session after installation. Connect the plugin's Trawel Pulse
server through the client's OAuth sign-in prompt. In Claude Code, open `/mcp`,
select the plugin's Trawel Pulse server, and authenticate. Complete sign-in on
`trawelpulse.com` in your browser. Each client keeps its own authorization.

Try:

- “Show my country day counts for this year.”
- “List my trips to Cyprus.”
- “Add my flight from Larnaca to Athens on 20 November 2026.”
- “Show my citizenship goals and progress.”

The plugin bundles a travel workflow skill and connects directly to the hosted
server at `https://trawelpulse.com/mcp`. It supports travel records, day counts,
visas, citizenship goals, and the travel information tools exposed by the
service. Account tools can read and change your travel records. Tax residence
and citizenship counts are tracking aids, not legal determinations.

## Data and troubleshooting

The package contains no account data, credentials, or personal MCP links.
Account records remain with Trawel Pulse; tool requests and results pass through
your chosen AI client. The plugin adds no local server or telemetry.

If tools are missing, check that the plugin is enabled, start a new session,
and complete OAuth authentication. If you already configured a custom Trawel
Pulse MCP connection, you may see duplicate tools; disable the old connection
in the client after verifying the plugin works.

Installation and public OAuth discovery can be tested without an account.
Successful account access also requires completing browser authorization; a
successful install alone does not verify that flow.

## Update or remove

Codex:

```sh
codex plugin marketplace upgrade trawelpulse
codex plugin add trawelpulse@trawelpulse
# Remove:
codex plugin remove trawelpulse@trawelpulse
```

Claude Code:

```sh
claude plugin marketplace update trawelpulse
claude plugin update trawelpulse@trawelpulse
# Remove:
claude plugin uninstall trawelpulse@trawelpulse
```

Restart the client after an update. Uninstalling does not delete your account.

## Development

```sh
npm run check
npm test
claude plugin validate .
claude plugin validate ./plugins/trawelpulse
npm pack --dry-run
```

There are no npm dependencies or build steps. The portable `plugin.json` and
`mcp.json` are accompanied by Codex and Claude compatibility manifests.
Keep versions in `package.json` and all three plugin manifests in sync.

Packaging references: [OpenAI plugin documentation](https://developers.openai.com/plugins/build/plugins)
and [Claude plugin manifest reference](https://code.claude.com/docs/en/plugins-reference).
