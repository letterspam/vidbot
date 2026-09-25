# vidbot

vidbot is an experimental project for streaming video and audio into a Discord voice channel by controlling a normal Discord user account as a programmable media client.

The target is a user-account-controlled client that can join a voice channel, start a Go Live stream, play media, and expose playback controls.

> [!CAUTION]
> This project automates a normal Discord user account. Discord explicitly prohibits automating normal user accounts ("self-bots") outside its supported bot/OAuth2 APIs, and says this can result in account termination.
>
> This repository is for educational and experimental work. Do not use an account you care about, and never put a user token in source control, issues, logs, screenshots, or CI artifacts.
>
> Discord references:
> https://support.discord.com/hc/en-us/articles/115002192352-Automated-User-Accounts-Self-Bots
> https://discord.com/guidelines

## Status

The repository currently contains the initial scaffold and project documentation. The runtime will be implemented around a clean separation between source resolution, media processing, and Discord streaming transport.

Target end state:

- Local/direct media files.
- Discord attachment URLs.
- Google Drive links.
- Mega links.
- YouTube URLs.
- Voice-channel join/leave.
- Go Live video with audio.
- Playback controls such as stop, pause/resume, seek, and volume.
- Provider-specific code isolated from Discord transport code.

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

That library documents Go Live and camera streaming, H.264/H.265 support, RTP/RTX handling, FFmpeg-backed media processing, and a selfbot client dependency. Its README also states that normal bot tokens are not supported for its video path.

## Media sources

| Source | Handling |
|---|---|
| Local file | Open directly |
| Direct HTTP(S) URL | Feed URL/stream to FFmpeg |
| Discord attachment | Treat attachment URL as media input |
| Google Drive | Resolve the share link to a playable/downloadable source |
| Mega | Resolve the share link to a playable stream |
| YouTube | Resolve the URL to a playable media stream |

Important: YouTube, Google Drive, and Mega URLs are not necessarily direct media files. Keep provider resolution in a dedicated resolver layer.

A normalized source can look like:

~~~
export interface MediaSource {
  kind: "file" | "url" | "stream";
  input: string | NodeJS.ReadableStream;
  title?: string;
  contentType?: string;
}
~~~

## Planned commands

~~~
/play <source>
/join
/leave
/stop
/pause
/resume
/seek <seconds>
/nowplaying
/volume <0-200>
~~~

The exact command system can change. Provider and playback code should not depend on one command framework.

## Media pipeline

The referenced streaming library requires FFmpeg to be installed and available on PATH. It also uses native components, so platform support must be tested instead of assumed.

The pipeline should:

1. Resolve a source.
2. Probe the media when required.
3. Decode audio/video with FFmpeg.
4. Normalize size, FPS, and formats.
5. Encode Discord-compatible video/audio.
6. Pass the resulting media to the Discord transport.
7. Report failures without unnecessarily killing the Discord session.

Software H.264 should be the baseline. Hardware acceleration can come later.

## Credentials

Treat the Discord user token like a password.

Use a local secret or environment variable such as:

~~~
DISCORD_USER_TOKEN=...
~~~

Never:

- commit tokens;
- print tokens;
- put tokens in command-line examples;
- put tokens in CI logs or screenshots;
- upload .env files;
- use a personal account as the test account.

See [SECURITY.md](SECURITY.md).

## Development

The current streaming library documents:

- Node.js >=22.4.0
- FFmpeg on PATH
- @lng2004/discord.js-selfbot-v13
- @dank074/discord-video-stream
- native video/data-channel dependencies

Pin dependency versions once implementation begins.

## Repository docs

- [AGENTS.md](AGENTS.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [TODO.md](TODO.md)
- [SECURITY.md](SECURITY.md)

## Non-goals

This project is not intended for spam, raids, mass messaging, Discord-data collection, bypassing access controls, hiding automation from Discord, or distributing account tokens.

## License

The repository currently uses GNU GPL v3.0. See [LICENSE](LICENSE).
