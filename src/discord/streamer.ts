import { Client } from "@lng2004/discord.js-selfbot-v13";
import {
  Streamer,
  Utils,
  playStream,
  prepareStream,
} from "@dank074/discord-video-stream";
import type { Config } from "../config.js";
import type { MediaSource } from "../types.js";

export class DiscordStreamer {
  readonly client: Client;
  private readonly streamer: Streamer;
  private controller: AbortController | undefined;

  constructor(private readonly config: Config) {
    this.client = new Client();
    this.streamer = new Streamer(this.client);
  }

  async login(): Promise<void> {
    await this.client.login(this.config.token);
  }

  async join(guildId: string, channelId: string): Promise<void> {
    await this.streamer.joinVoice(guildId, channelId);
  }

  async play(source: MediaSource): Promise<void> {
    if (!this.streamer.voiceConnection) {
      throw new Error("Join a voice channel before starting playback");
    }

    this.controller?.abort();
    this.controller = new AbortController();

    const { command, output } = prepareStream(
      source.input,
      {
        width: this.config.width,
        height: this.config.height,
        frameRate: this.config.fps,
        bitrateVideo: this.config.videoBitrateKbps,
        bitrateVideoMax: this.config.videoMaxBitrateKbps,
        bitrateAudio: this.config.audioBitrateKbps,
        videoCodec: Utils.normalizeVideoCodec(this.config.videoCodec),
      },
      this.controller.signal,
    );

    command.on("error", (error) => {
      console.error("[ffmpeg]", error);
    });

    try {
      await playStream(
        output,
        this.streamer,
        { type: "go-live" },
        this.controller.signal,
      );
    } finally {
      this.controller = undefined;
    }
  }

  stop(): void {
    this.controller?.abort();
    this.controller = undefined;
  }

  leave(): void {
    this.stop();
    this.streamer.leaveVoice();
  }
}
