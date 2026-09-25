import path from "node:path";
import type { ClassifiedInput, Provider } from "../types.js";

const HOST_PROVIDERS: ReadonlyArray<[string, Provider]> = [
  ["cdn.discordapp.com", "discord"],
  ["media.discordapp.net", "discord"],
  ["cdn.discord.com", "discord"],
  ["drive.google.com", "google-drive"],
  ["docs.google.com", "google-drive"],
  ["drive.usercontent.google.com", "google-drive"],
  ["mega.nz", "mega"],
  ["mega.io", "mega"],
  ["youtube.com", "youtube"],
  ["youtu.be", "youtube"],
  ["youtube-nocookie.com", "youtube"],
  ["googlevideo.com", "youtube"],
];

function matchesHost(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith("." + domain);
}

export function classifyInput(value: string): ClassifiedInput {
  const input = value.trim();
  if (!input) throw new Error("Media source cannot be empty");

  let url: URL | undefined;
  try {
    url = new URL(input);
  } catch {
    url = undefined;
  }

  if (!url) {
    if (path.isAbsolute(input) || input.startsWith(".") || input.includes(path.sep)) {
      return { kind: "file", provider: "local", value: input };
    }
    return { kind: "unsupported", value: input };
  }

  if (url.protocol === "file:") {
    return {
      kind: "file",
      provider: "local",
      value: decodeURIComponent(url.pathname),
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { kind: "unsupported", value: input };
  }

  for (const [domain, provider] of HOST_PROVIDERS) {
    if (matchesHost(url.hostname.toLowerCase(), domain)) {
      return { kind: "url", provider, value: input };
    }
  }

  return { kind: "url", provider: "direct", value: input };
}
