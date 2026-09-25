# ARCHITECTURE.md

## Overview

vidbot is a layered media player with a Discord streaming transport.

The key design rule is:

**Where media comes from is separate from how media is sent to Discord.**

~~~
Control / Commands
       |
       v
Playback Manager
   |         |
   v         v
Source      Discord
Resolver    Session
   |
   v
Media Pipeline
   |
   v
Stream Transport
   |
   v
Discord VC
~~~

## Control layer

Owns:

- commands;
- argument validation;
- playback permissions;
- voice-channel selection;
- user-facing errors.

It should not construct FFmpeg commands or RTP packets.

## Playback manager

Owns one logical playback session:

- requested source;
- resolved source;
- title/metadata;
- playback position;
- pause/resume;
- volume;
- queue;
- cancellation.

Keep playback state in one place rather than scattering flags such as isPlaying/isPaused/isJoining.

## Source resolver

Normalize different inputs into a common media source.

Suggested interface:

~~~
export interface SourceResolver {
  canResolve(input: string): boolean;
  resolve(input: string, options?: ResolveOptions): Promise<MediaSource>;
}
~~~

Potential adapters:

~~~
LocalFileResolver
DirectUrlResolver
DiscordAttachmentResolver
GoogleDriveResolver
MegaResolver
YouTubeResolver
~~~

A resolver returns a source. It does not start Discord playback.

## Media pipeline

The pipeline turns a resolved source into media accepted by the Discord transport.

Responsibilities:

- probe;
- decode;
- resample;
- scale;
- pixel-format conversion;
- FPS control;
- audio encode;
- video encode;
- FFmpeg diagnostics;
- cancellation and cleanup.

FFmpeg should be a process/library boundary, not a string-building exercise.

## Discord session

Owns the lifecycle of the controlled Discord user account:

- authentication;
- session maintenance;
- voice join/leave;
- reconnection;
- voice state needed by the streaming transport.

Credentials enter this layer only from protected configuration.

## Stream transport

The project should wrap:
https://github.com/Discord-RE/Discord-video-stream

The upstream README currently documents:

- Go Live and camera streaming;
- RTP and RTX;
- H.264 and H.265;
- FFmpeg-backed preparation;
- selfbot client dependency;
- native dependencies.

Keep that dependency behind a narrow interface so its API does not spread through the whole application.

Suggested boundary:

~~~
export interface DiscordVideoTransport {
  joinVoice(guildId: string, channelId: string): Promise<void>;
  startStream(options: StreamOptions): Promise<void>;
  stopStream(): Promise<void>;
  leaveVoice(): Promise<void>;
}
~~~

The exact implementation depends on the upstream version.

## Source resolution flow

~~~
raw input
   |
   v
classify
   |
   +-> local path -------> LocalFileResolver
   |
   +-> HTTP(S) ----------> DirectUrlResolver
   |
   +-> Discord attachment -> DirectUrl/AttachmentResolver
   |
   +-> Google Drive -----> GoogleDriveResolver
   |
   +-> Mega --------------> MegaResolver
   |
   +-> YouTube -----------> YouTubeResolver
   |
   v
MediaSource
~~~

This separation keeps provider-specific behavior out of RTP and Discord code.

## Playback lifecycle

~~~
IDLE
 |
 | play
 v
RESOLVING
 |
 | resolved
 v
PREPARING
 |
 | FFmpeg ready
 v
JOINING
 |
 | connected
 v
STREAMING <-> PAUSED
 |
 | stop/end/error
 v
STOPPING
 |
 v
IDLE
~~~

Provider resolution errors should normally return to IDLE without destroying the whole Discord session.

## Resource lifecycle

A playback session may own:

- provider network requests;
- temporary files;
- an FFmpeg process;
- a Discord stream;
- timers.

Stopping playback must cancel and clean up everything it owns. Cancellation should be idempotent.

## Security boundaries

1. Discord credential: token -> protected config -> Discord session.
2. Remote media: URL -> provider/network -> media stream/file.
3. FFmpeg: application -> process arguments -> media pipeline.

Assume remote sources can redirect, hang, return huge files, disconnect, or contain malformed media.

## Failure isolation

- Provider failure should not kill the Discord session.
- FFmpeg failure should normally stop playback only.
- Discord voice failure may require rebuilding the stream/session.

## Future extensions

The architecture can later support playlists, queues, multiple guild sessions, quality presets, hardware encoding, subtitles, metadata, and desktop/web control.

Those are secondary to one reliable end-to-end stream.
