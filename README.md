# vidbot

vidbot is an experimental project for streaming video and audio into a Discord voice channel by controlling a normal Discord user account as a programmable media client.

The current implementation can log in, listen for authorized commands, resolve local/direct media sources, join the command author's voice channel, and hand the media to the Go Live transport.

> [!CAUTION]
> This project automates a normal Discord user account. Discord explicitly prohibits automating normal user accounts ("self-bots") outside its supported bot/OAuth2 APIs, and says this can result in account termination.
>
> This repository is for educational and experimental work. Do not use an account you care about, and never put a user token in source control, issues, logs, screenshots, or CI artifacts.
>
> Discord references:
> https://support.discord.com/hc/en-us/articles/115002192352-Automated-User-Accounts-Self-Bots
> https://discord.com/guidelines

## Current status

Implemented now:

- TypeScript/Node project scaffold.
- Environment-based configuration.
- Authorized-user command handling.
- Local file resolution under VIDBOT_MEDIA_ROOT.
- Direct HTTP(S) URL resolution.
- Discord attachment URL handling.
- Google Drive, Mega, and YouTube URL resolution, using direct Drive downloads plus MEGAJS and yt-dlp-backed streaming.
- Discord selfbot session integration.
- Join the author's current voice channel.
- Go Live playback through @dank074/discord-video-stream.
- Stop, leave, and live volume controls.
- Source-classification unit tests and CI.

Not implemented yet:

- Full Google Drive confirmation/large-file handling and live verification of all hosted providers.
- Pause/resume/seek/queue controls.
- Full reconnection/error recovery.
- End-to-end live Discord verification.

## Quick start

Requirements:

- Node.js 22.4 or newer.
- FFmpeg installed and available on PATH.
- A disposable experimental Discord user account.
- A server where that account can join the target voice channel.

Install dependencies:

~~~bash
npm install
~~~

Set environment variables:

~~~text
DISCORD_USER_TOKEN=...
VIDBOT_ALLOWED_USERS=123456789012345678
VIDBOT_MEDIA_ROOT=C:\path\to\vidbot\media
~~~

The media root is optional. Without it, local files are disabled.

Run tests and build:

~~~bash
npm run test
npm run check
npm run build
~~~

Start:

~~~bash
npm start
~~~

## Commands

The current command prefix defaults to $.

~~~text
$play <URL or local file>
$stop
$leave
$status
$nowplaying
$volume <0-200>
$source <URL or local file>
~~~

For $play, the account joins the voice channel that the message author is currently in. A Discord message attachment can also be used directly by sending the $play command with a video attached.

Only users listed in VIDBOT_ALLOWED_USERS can control the client. An empty allow-list disables commands rather than opening control to everyone.

## Architecture

~~~
Command / Control
       |
       v
+-------------------+
| Source Resolver   |
| file / URL /      |
| Discord / Drive / |
| Mega / YouTube    |
+---------+---------+
          |
          v
+-------------------+
| Media Pipeline    |
| FFmpeg probe /    |
| decode / encode   |
+---------+---------+
          |
          v
+-------------------+
| Discord Transport |
| user session /    |
| voice / Go Live   |
+---------+---------+
          |
          v
      Discord VC
~~~

The planned low-level video transport is based on:
https://github.com/Discord-RE/Discord-video-stream

That library documents Go Live and camera streaming, H.264/H.265 support, RTP/RTX handling, FFmpeg-backed media processing, and a selfbot client dependency.

## Media sources

| Source | Current state |
|---|---|
| Local file | Working |
| Direct HTTP(S) media URL | Working, provided FFmpeg can read it |
| Discord attachment URL | Working as a direct URL |
| Google Drive | Public share links resolved to direct-download URLs; edge cases need testing |
| Mega | Stream resolver implemented; live testing still needed |
| YouTube | Stream resolver implemented; live testing still needed |

Hosted-provider URLs are deliberately resolved outside the Discord transport layer. A YouTube share URL, for example, is not necessarily a direct media stream.

## Credentials

Treat the Discord user token like a password.

Use the environment variable:

~~~text
DISCORD_USER_TOKEN=...
~~~

Never commit, print, screenshot, or log the token. See SECURITY.md.

## Development docs

- AGENTS.md
- ARCHITECTURE.md
- TODO.md
- SECURITY.md

## License

The repository uses GNU GPL v3.0. See LICENSE.
