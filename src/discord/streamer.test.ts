import assert from "node:assert/strict";
import test from "node:test";
import { DiscordStreamer } from "./streamer.js";

const config = {
  token: "test-token",
  allowedUsers: new Set<string>(),
  prefix: "$",
  width: 1280,
  height: 720,
  fps: 30,
  videoBitrateKbps: 2500,
  videoMaxBitrateKbps: 4000,
  audioBitrateKbps: 128,
  videoCodec: "H264" as const,
};

test("starts disconnected with no active playback", () => {
  const streamer = new DiscordStreamer(config);
  assert.deepEqual(streamer.getStatus(), {
    connected: false,
    streaming: false,
    volume: 100,
  });
  assert.equal(streamer.getNowPlaying(), undefined);
});

test("rejects volume outside the supported range", async () => {
  const streamer = new DiscordStreamer(config);

  await assert.rejects(
    () => streamer.setVolume(-1),
    /Volume must be between 0 and 200/,
  );
  await assert.rejects(
    () => streamer.setVolume(201),
    /Volume must be between 0 and 200/,
  );
});

test("does not expose live volume control while idle", async () => {
  const streamer = new DiscordStreamer(config);

  await assert.rejects(
    () => streamer.setVolume(50),
    /Nothing is currently playing/,
  );
  assert.equal(streamer.getVolume(), 100);
});
