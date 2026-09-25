# AGENTS.md

## Purpose

vidbot is an experimental Discord media-streaming project. It controls a normal Discord user account and uses a third-party video-streaming library to send media into a voice channel.

Build this as a normal maintainable software project. Prefer small testable components over one giant Discord bot file.

## Source of truth

Before changing behavior:

1. Inspect the current repository state.
2. Read TODO.md and ARCHITECTURE.md.
3. Inspect the exact upstream Discord-video-stream version being targeted.
4. Verify APIs from source instead of trusting stale examples.
5. Do not invent Discord gateway, RTP, codec, or auth behavior when it can be verified.

## Architecture rules

Keep these boundaries:

- Control layer: commands, permissions, lifecycle, user-facing errors.
- Source resolver: converts inputs into normalized media sources.
- Media pipeline: FFmpeg probing, decoding, scaling, encoding, audio.
- Discord transport: user session, voice, Go Live, RTP/media delivery.
- State: current source, guild/channel, position, pause, volume, health.
- Observability: structured logs and useful errors.

Source resolvers must not reach into Discord transport internals. Discord transport must not contain YouTube/Drive/Mega parsing.

## Credentials

Never request, print, commit, or hard-code a Discord user token.

Use environment variables or a local secret store. Tests should use mocks or fixtures, not real credentials.

Never put credentials in source files, README examples, CI logs, issue comments, screenshots, or snapshots.

If a secret is exposed, assume it is compromised and rotate/revoke it.

## Media input security

Media URLs are untrusted input. Validate:

- URL schemes;
- redirects;
- download sizes;
- timeouts;
- file paths;
- temporary-file locations;
- FFmpeg arguments.

Never concatenate untrusted input into a shell command. Pass FFmpeg arguments as structured arguments.

Local file support should prevent traversal outside configured media directories.

## Provider rules

Planned providers:

- local files;
- direct HTTP(S);
- Discord attachments;
- Google Drive;
- Mega;
- YouTube.

Each provider should return a normalized source or typed error. Provider dependencies stay isolated so one broken provider cannot break direct files.

## Discord transport rules

Do not duplicate RTP or codec logic already provided by the upstream library without a verified reason.

When changing protocol behavior:

1. Confirm it from source, traces, or reproducible tests.
2. Document the reason.
3. Add a regression test where practical.
4. Keep compatibility code isolated.

Do not assume bot-token video support. The current referenced library documents a user-token/selfbot dependency.

## Testing

Use this order:

1. URL/provider classification.
2. Source normalization.
3. FFmpeg probe tests.
4. Local media pipeline tests without Discord.
5. Discord transport tests with a disposable experimental account.
6. End-to-end playback with a small known-good fixture.

Do not make the full test suite depend on live YouTube, Drive, or Mega services.

## Performance

Start with software H.264 and conservative defaults.

Only add hardware acceleration after the software path is stable. Avoid unnecessary transcoding when the transport library confirms the source is already compatible.

## Git workflow

Use focused commits with prefixes such as:

- docs:
- feat:
- fix:
- refactor:
- test:
- build:

Do not combine unrelated provider, transport, and documentation rewrites.

## Documentation

When implementation changes behavior, update the README and the relevant architecture/TODO/security documentation in the same change.

Do not claim a source is supported until it has been tested end-to-end.

## Done means

A feature is complete when the implementation, error handling, tests/manual verification, docs, and cleanup are all in place and no credentials or generated junk are committed.
