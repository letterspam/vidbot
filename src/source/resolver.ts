import fs from "node:fs";
import path from "node:path";
import type { Config } from "../config.js";
import type { MediaSource, Provider } from "../types.js";
import { classifyInput } from "./classify.js";
import {
  resolveGoogleDrive,
  resolveMega,
  resolveYouTube,
} from "./hosted.js";

function assertInsideRoot(filePath: string, root: string): string {
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(filePath);
  const relative = path.relative(resolvedRoot, resolvedPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Local media file is outside VIDBOT_MEDIA_ROOT");
  }

  return resolvedPath;
}

function localSource(value: string, config: Config): MediaSource {
  if (!config.mediaRoot) {
    throw new Error(
      "Local files are disabled because VIDBOT_MEDIA_ROOT is not configured",
    );
  }

  const candidate =
    path.isAbsolute(value) || path.win32.isAbsolute(value)
      ? value
      : path.resolve(config.mediaRoot, value);
  const filePath = assertInsideRoot(candidate, config.mediaRoot);

  if (!fs.existsSync(filePath)) {
    throw new Error("Local media file does not exist");
  }
  if (!fs.statSync(filePath).isFile()) {
    throw new Error("Local media source is not a file");
  }

  return {
    kind: "file",
    provider: "local",
    input: filePath,
    title: path.basename(filePath),
  };
}

export async function resolveSource(
  value: string,
  config: Config,
): Promise<MediaSource> {
  const classified = classifyInput(value);

  if (classified.kind === "file") {
    return localSource(classified.value, config);
  }

  if (classified.kind === "url") {
    const provider = classified.provider as Provider;

    switch (provider) {
      case "direct":
      case "discord":
        return {
          kind: "url",
          provider,
          input: classified.value,
        };
      case "google-drive":
        return resolveGoogleDrive(classified.value);
      case "mega":
        return resolveMega(classified.value);
      case "youtube":
        return resolveYouTube(classified.value);
      default:
        throw new Error("No resolver is registered for " + provider);
    }
  }

  throw new Error("Unsupported media source. Use a local path or HTTP(S) URL");
}
