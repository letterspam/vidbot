import assert from "node:assert/strict";
import test from "node:test";
import { classifyInput } from "./classify.js";

test("classifies local paths", () => {
  assert.deepEqual(classifyInput("./media/test.mp4"), {
    kind: "file",
    provider: "local",
    value: "./media/test.mp4",
  });
});

test("classifies Discord attachments", () => {
  const result = classifyInput(
    "https://cdn.discordapp.com/attachments/123/456/video.mp4?ex=abc",
  );
  assert.equal(result.kind, "url");
  assert.equal(result.provider, "discord");
});

test("classifies Google Drive", () => {
  const result = classifyInput(
    "https://drive.google.com/file/d/abc123/view",
  );
  assert.equal(result.provider, "google-drive");
});

test("classifies Mega", () => {
  const result = classifyInput("https://mega.nz/file/abcdef#key");
  assert.equal(result.provider, "mega");
});

test("classifies YouTube", () => {
  const result = classifyInput("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(result.provider, "youtube");
});

test("classifies arbitrary HTTP URLs as direct media", () => {
  const result = classifyInput("https://example.com/video.mp4");
  assert.equal(result.provider, "direct");
});

test("rejects unsupported schemes", () => {
  assert.equal(classifyInput("ftp://example.com/video.mp4").kind, "unsupported");
});
