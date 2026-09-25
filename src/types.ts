import type { Readable } from "node:stream";

export type SourceKind = "file" | "url" | "stream" | "unsupported";

export type Provider =
  | "local"
  | "direct"
  | "discord"
  | "google-drive"
  | "mega"
  | "youtube";

export interface MediaSource {
  readonly kind: Exclude<SourceKind, "unsupported">;
  readonly input: string | Readable;
  readonly title?: string;
  readonly provider: Provider;
}

export interface ClassifiedInput {
  readonly kind: SourceKind;
  readonly provider?: Provider;
  readonly value: string;
}
