# Trawel Pulse plugin

Connect [Trawel Pulse](https://trawelpulse.com) to Claude or ChatGPT/Codex.
Install the plugin from this repository, then sign in through your client's
browser OAuth flow. No personal MCP URL is needed.

## Claude

### Claude app

1. Open **Customize → Plugins**.
2. Choose **Add → Add marketplace → Add from a repository**.
3. Enter `https://github.com/chistopat/trawelpulse-plugin`.
4. Install **Trawel Pulse** and complete the browser sign-in flow.

Repository marketplace availability depends on your Claude client and your
organization's settings. Installation through the Claude app interface has
not been verified for this release.

### Claude Code

Run these commands inside Claude Code:

```text
/plugin marketplace add chistopat/trawelpulse-plugin
/plugin install trawelpulse@trawelpulse
```

Or install from a terminal with Node.js 22+ and Claude Code on PATH:

```sh
npx --yes --package=github:chistopat/trawelpulse-plugin trawelpulse-plugin install claude
```

Start a new session, open `/mcp`, select the plugin's Trawel Pulse server, and
complete sign-in in your browser. Installation from GitHub through the Claude
Code CLI has been verified; full browser authorization has not.

To update or remove:

```sh
claude plugin marketplace update trawelpulse
claude plugin update trawelpulse@trawelpulse
# Remove:
claude plugin uninstall trawelpulse@trawelpulse
```

## ChatGPT / Codex

### ChatGPT desktop app

If your Plugins page offers **Add → Add a marketplace** with a repository field:

1. Enter `https://github.com/chistopat/trawelpulse-plugin`.
2. Select the **Trawel Pulse** marketplace and install its plugin.
3. Start a new chat and complete the client's browser sign-in flow.

This repository contains the Codex marketplace catalog. The desktop button
flow has not been verified for this release; installation through the Codex
CLI below has been verified.

This is a repository marketplace, not a listing in the public plugin directory.
Do not assume that importing it makes the MCP connection available in ChatGPT
on the web: imported plugins that declare MCP servers can be marked **Desktop
only**, including servers with remote HTTPS URLs. See the
[official OpenAI documentation](https://learn.chatgpt.com/docs/enterprise/plugin-management#desktop-only-plugins).

### Codex CLI

```sh
codex plugin marketplace add chistopat/trawelpulse-plugin
codex plugin add trawelpulse@trawelpulse
```

Or install with Node.js 22+ and Codex on PATH:

```sh
npx --yes --package=github:chistopat/trawelpulse-plugin trawelpulse-plugin install codex
```

Start a new session and connect Trawel Pulse through the client's browser
OAuth sign-in prompt.

To update or remove:

```sh
codex plugin marketplace upgrade trawelpulse
codex plugin add trawelpulse@trawelpulse
# Remove:
codex plugin remove trawelpulse@trawelpulse
```

### Install in both command-line clients

With Node.js 22+ and both CLIs on PATH:

```sh
npx --yes --package=github:chistopat/trawelpulse-plugin trawelpulse-plugin install both
```

The helper uses the clients' native marketplace commands. If a later step
fails, earlier successful steps remain in place; fix the reported error and
rerun. Each client keeps its own authorization. Restart after an update.
Uninstalling the plugin does not delete your Trawel Pulse account.

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
