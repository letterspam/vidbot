import { File as MegaFile } from "megajs";
import { YtDlp } from "ytdlp-nodejs";
import type { MediaSource } from "../types.js";

export function extractGoogleDriveFileId(value: string): string | undefined {
  const url = new URL(value);

  const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (pathMatch?.[1]) return pathMatch[1];

  const queryId = url.searchParams.get("id");
  return queryId || undefined;
}

export function resolveGoogleDrive(value: string): MediaSource {
  const id = extractGoogleDriveFileId(value);
  if (!id) {
    throw new Error(
      "Could not extract a Google Drive file ID. Use a file sharing URL.",
    );
  }

  return {
    kind: "url",
    provider: "google-drive",
    input:
      "https://drive.usercontent.google.com/download?export=download&id=" +
      encodeURIComponent(id) +
      "&confirm=t",
  };
}

export async function resolveMega(value: string): Promise<MediaSource> {
  const root = MegaFile.fromURL(value);
  const selected = await root.loadAttributes();

  if (selected.directory || selected.children) {
    throw new Error("MEGA folders are not supported yet; provide a file link");
  }

  const input = selected.download({});
  return {
    kind: "stream",
    provider: "mega",
    input,
    ...(selected.name ? { title: selected.name } : {}),
  };
}

export async function resolveYouTube(value: string): Promise<MediaSource> {
  const ytdlp = new YtDlp();
  const input = ytdlp
    .stream(value)
    .filter("audioandvideo")
    .quality("highest")
    .type("mp4")
    .getStream();

  return {
    kind: "stream",
    provider: "youtube",
    input,
  };
}
