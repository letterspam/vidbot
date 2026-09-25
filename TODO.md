# TODO.md

Status: [ ] not started, [~] in progress, [x] complete, [!] blocked.

## Phase 0 - Foundation

- [ ] Add package manifest and TypeScript config.
- [ ] Add runtime entry point.
- [ ] Add environment-based configuration.
- [ ] Add structured logging.
- [ ] Add build/lint/test scripts.
- [ ] Add CI.
- [ ] Add safe example configuration with no real credentials.

## Phase 1 - Discord session

- [ ] Integrate the selfbot client dependency.
- [ ] Load the user token only from protected runtime config.
- [ ] Connect and report readiness.
- [ ] Join a configured voice channel.
- [ ] Leave voice cleanly.
- [ ] Handle reconnect/disconnect events.
- [ ] Wrap selfbot internals behind a transport/session boundary.

## Phase 2 - Minimal streaming

- [ ] Integrate @dank074/discord-video-stream.
- [ ] Verify FFmpeg discovery.
- [ ] Stream a known-good local MP4.
- [ ] Stream a known-good direct MP4 URL.
- [ ] Start/stop Go Live reliably.
- [ ] Verify audio.
- [ ] Cleanly terminate FFmpeg and Discord stream resources.
- [ ] Record tested codec/resolution/FPS combinations.

## Phase 3 - Source resolver

- [ ] Define MediaSource.
- [ ] Define SourceResolver.
- [ ] Implement local files.
- [ ] Implement direct HTTP(S).
- [ ] Implement Discord attachment URLs.
- [ ] Add provider classification tests.
- [ ] Add timeout and redirect handling.
- [ ] Add download/temp-file limits where appropriate.

## Phase 4 - Hosted providers

### Google Drive

- [ ] Detect common share URLs.
- [ ] Resolve playable/downloadable media.
- [ ] Handle private files clearly.
- [ ] Test large files without buffering everything into RAM.

### Mega

- [ ] Detect Mega share URLs.
- [ ] Resolve a media stream through a maintained library/API.
- [ ] Handle expired or invalid links.
- [ ] Avoid persistent downloads unless explicitly configured.

### YouTube

- [ ] Detect YouTube URLs.
- [ ] Add a maintained resolver backend.
- [ ] Resolve playable media without storing the whole video.
- [ ] Handle age, region, and login restrictions as explicit errors.
- [ ] Handle live streams separately if supported.
- [ ] Keep YouTube code isolated from Discord transport.

## Phase 5 - Playback controls

- [ ] Add play.
- [ ] Add stop.
- [ ] Add pause.
- [ ] Add resume.
- [ ] Add seek.
- [ ] Add nowplaying.
- [ ] Add volume.
- [ ] Add skip/queue support.
- [ ] Restrict controls to an allowed set of users/roles.
- [ ] Return useful command errors.

## Phase 6 - Reliability

- [ ] Make cancellation idempotent.
- [ ] Handle FFmpeg process exit.
- [ ] Handle remote source timeouts.
- [ ] Handle Discord voice disconnects.
- [ ] Add retries for transient network/provider errors.
- [ ] Add a watchdog for hung media pipelines.
- [ ] Guarantee temp-file cleanup.
- [ ] Prevent failed video from permanently wedging the session.

## Phase 7 - Performance

- [ ] Establish a software H.264 baseline.
- [ ] Measure CPU usage and latency.
- [ ] Test encoder presets.
- [ ] Investigate hardware acceleration.
- [ ] Add quality presets.
- [ ] Avoid unnecessary transcoding.
- [ ] Document practical CPU/GPU requirements.

## Phase 8 - Testing

- [ ] Unit-test input classification.
- [ ] Unit-test provider selection.
- [ ] Unit-test playback state transitions.
- [ ] Add FFmpeg fixture tests.
- [ ] Mock provider network responses.
- [ ] Mock Discord transport.
- [ ] Perform manual end-to-end testing with a disposable experimental account.
- [ ] Add regressions for discovered protocol/media bugs.

## Phase 9 - Packaging/docs

- [ ] Document Windows.
- [ ] Document Linux.
- [ ] Document macOS.
- [ ] Document FFmpeg setup.
- [ ] Document environment variables.
- [ ] Document supported sources and limitations.
- [ ] Keep README commands synchronized with implementation.
- [ ] Add troubleshooting.
- [ ] Add release/build instructions.

## Deferred

- [ ] Playlists.
- [ ] Multiple simultaneous guild sessions.
- [ ] Per-guild queues.
- [ ] Subtitles.
- [ ] Thumbnail/metadata extraction.
- [ ] Desktop control panel.
- [ ] Web control panel.
- [ ] Recording.
- [ ] Advanced encoder presets.
