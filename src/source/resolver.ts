import fs from "node:fs";
import path from "node:path";
import type { Config } from "../config.js";
import type { MediaSource, Provider } from "../types.js";
import { classifyInput } from "./classify.js";

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

  const filePath = assertInsideRoot(value, config.mediaRoot);
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
    if (provider === "direct" || provider === "discord") {
      return {
        kind: "url",
        provider,
        input: classified.value,
      };
    }

    throw new Error(
      provider +
        " links are classified correctly but their resolver is not implemented yet",
    );
  }

  throw new Error("Unsupported media source. Use a local path or HTTP(S) URL");
}
