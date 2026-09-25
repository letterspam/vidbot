export interface Config {
  readonly token: string;
  readonly allowedUsers: ReadonlySet<string>;
  readonly prefix: string;
  readonly width: number;
  readonly height: number;
  readonly fps: number;
  readonly videoBitrateKbps: number;
  readonly videoMaxBitrateKbps: number;
  readonly audioBitrateKbps: number;
  readonly videoCodec: "H264" | "H265";
  readonly mediaRoot?: string;
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required environment variable: " + name);
  return value;
}

function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(name + " must be a positive integer");
  }
  return value;
}

export function loadConfig(): Config {
  const allowedUsers = new Set(
    (process.env.VIDBOT_ALLOWED_USERS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );

  const codec = (process.env.VIDBOT_VIDEO_CODEC ?? "H264").toUpperCase();
  if (codec !== "H264" && codec !== "H265") {
    throw new Error("VIDBOT_VIDEO_CODEC must be H264 or H265");
  }

  const mediaRoot = process.env.VIDBOT_MEDIA_ROOT?.trim();

  return {
    token: required("DISCORD_USER_TOKEN"),
    allowedUsers,
    prefix: process.env.VIDBOT_PREFIX?.trim() || "$",
    width: positiveInt("VIDBOT_WIDTH", 1280),
    height: positiveInt("VIDBOT_HEIGHT", 720),
    fps: positiveInt("VIDBOT_FPS", 30),
    videoBitrateKbps: positiveInt("VIDBOT_VIDEO_BITRATE_KBPS", 2500),
    videoMaxBitrateKbps: positiveInt("VIDBOT_VIDEO_MAX_BITRATE_KBPS", 4000),
    audioBitrateKbps: positiveInt("VIDBOT_AUDIO_BITRATE_KBPS", 128),
    videoCodec: codec,
    ...(mediaRoot ? { mediaRoot } : {}),
  };
}
