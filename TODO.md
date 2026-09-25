# TODO.md

Status: [ ] not started, [~] in progress, [x] complete, [!] blocked.

## Phase 0 - Foundation

- [x] Add package manifest and TypeScript config.
- [x] Add runtime entry point.
- [x] Add environment-based configuration.
- [ ] Add structured logging.
- [x] Add build/check/test scripts.
- [x] Add CI.
- [x] Add safe example configuration with no real credentials.

## Phase 1 - Discord session

- [x] Integrate the selfbot client dependency.
- [x] Load the user token only from protected runtime config.
- [x] Connect and report readiness.
- [x] Join a configured voice channel during playback.
- [x] Leave voice cleanly.
- [ ] Handle reconnect/disconnect events.
- [x] Wrap the streaming client behind a local transport class.

## Phase 2 - Minimal streaming

- [x] Integrate @dank074/discord-video-stream.
- [ ] Verify FFmpeg discovery on supported developer machines.
- [ ] Stream a known-good local MP4 end-to-end.
- [ ] Stream a known-good direct MP4 URL end-to-end.
- [x] Start/stop Go Live through the streaming library.
- [ ] Verify audio in a live Discord session.
- [x] Abort and replace an active playback pipeline.
- [ ] Record tested codec/resolution/FPS combinations.

## Phase 3 - Source resolver

- [x] Define MediaSource.
- [x] Define source classification.
- [x] Implement local files.
- [x] Implement direct HTTP(S) URLs.
- [x] Implement Discord attachment URLs.
- [x] Add provider classification tests.
- [ ] Add request timeout and redirect handling for providers.
- [x] Restrict local files to VIDBOT_MEDIA_ROOT.

## Phase 4 - Hosted providers

### Google Drive

- [x] Detect common share URLs.
- [~] Resolve playable/downloadable media. Public-file URL conversion is implemented; Drive warning/confirmation cases still need testing.
- [ ] Handle private files clearly.
- [ ] Test large files without buffering everything into RAM.

### Mega

- [x] Detect Mega share URLs.
- [x] Resolve a media stream through megajs.
- [ ] Handle expired or invalid links.
- [ ] Avoid persistent downloads unless explicitly configured.

### YouTube

- [x] Detect YouTube URLs.
- [x] Add a maintained resolver backend with ytdlp-nodejs.
- [x] Resolve playable media as a stream without storing the whole video.
- [ ] Handle age, region, and login restrictions as explicit errors.
- [ ] Handle live streams separately if supported.
- [ ] Keep YouTube code isolated from Discord transport.

## Phase 5 - Playback controls

- [x] Add play.
- [x] Add stop.
- [x] Add leave.
- [ ] Add pause.
- [ ] Add resume.
- [ ] Add seek.
- [x] Add nowplaying.
- [x] Add playback status.
- [x] Add volume.
- [ ] Add skip/queue support.
- [x] Restrict controls to VIDBOT_ALLOWED_USERS when configured.
- [x] Return useful command errors.

## Phase 6 - Reliability

- [x] Make playback cancellation idempotent.
- [x] Handle FFmpeg process exit explicitly.
- [ ] Handle remote source timeouts.
- [~] Avoid unnecessary voice reconnects; event-driven recovery is still needed.
- [ ] Add retries for transient network/provider errors.
- [ ] Add a watchdog for hung media pipelines.
- [x] Clean up the active stream when stop/leave is called.
- [x] Prevent a failed video from permanently wedging the session.
- [x] Cleanly shut down playback and the Discord client on process termination.

## Phase 7 - Performance

- [ ] Establish a software H.264 baseline.
- [ ] Measure CPU usage and latency.
- [ ] Test encoder presets.
- [ ] Investigate hardware acceleration.
- [ ] Add quality presets.
- [ ] Avoid unnecessary transcoding.
- [ ] Document practical CPU/GPU requirements.

## Phase 8 - Testing

- [x] Unit-test input classification.
- [ ] Unit-test provider selection.
- [~] Unit-test playback state transitions. Playback phases are now explicit; tests still need the transport mocked.
- [ ] Add FFmpeg fixture tests.
- [ ] Mock provider network responses.
- [ ] Mock Discord transport.
- [ ] Perform manual end-to-end testing with a disposable experimental account.
- [ ] Add regressions for discovered protocol/media bugs.

## Phase 9 - Packaging/docs

- [ ] Document Windows setup.
- [ ] Document Linux setup.
- [ ] Document macOS setup.
- [ ] Document FFmpeg setup.
- [x] Document environment variables.
- [x] Document supported source types and current limitations.
- [x] Keep README aligned with the current implementation.
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
