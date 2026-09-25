import assert from "node:assert/strict";
import test from "node:test";
import { resolveGoogleDrive } from "./hosted.js";

test("resolves a Google Drive file share", () => {
  const source = resolveGoogleDrive(
    "https://drive.google.com/file/d/abc123/view?usp=sharing",
  );

  assert.equal(source.provider, "google-drive");
  assert.equal(
    source.input,
    "https://drive.usercontent.google.com/download?export=download&id=abc123&confirm=t",
  );
});

test("resolves Google Drive open links", () => {
  const source = resolveGoogleDrive(
    "https://drive.google.com/open?id=abc123",
  );

  assert.equal(source.provider, "google-drive");
  assert.match(String(source.input), /id=abc123/);
});

test("rejects Google Drive links without a file id", () => {
  assert.throws(
    () => resolveGoogleDrive("https://drive.google.com/drive/my-drive"),
    /Could not extract/,
  );
});
