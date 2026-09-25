import { Client } from "@lng2004/discord.js-selfbot-v13";
import {
  Streamer,
  Utils,
  playStream,
  prepareStream,
} from "@dank074/discord-video-stream";
import type { Config } from "../config.js";
import type { MediaSource } from "../types.js";

interface PlaybackController {
  readonly volume: number;
  setVolume(value: number): Promise<boolean>;
}

export class DiscordStreamer {
  readonly client: Client;
  private readonly streamer: Streamer;
  private playbackAbort: AbortController | undefined;
  private playbackController: PlaybackController | undefined;

  constructor(private readonly config: Config) {
    this.client = new Client();
    this.streamer = new Streamer(this.client);
  }

  async login(): Promise<void> {
    await this.client.login(this.config.token);
  }

  async join(guildId: string, channelId: string): Promise<void> {
    const connection = this.streamer.voiceConnection;

    if (
      connection &&
      connection.guildId === guildId &&
      connection.channelId === channelId
    ) {
      return;
    }

    if (connection) {
      this.streamer.leaveVoice();
    }

    await this.streamer.joinVoice(guildId, channelId);
  }

  async play(source: MediaSource): Promise<void> {
    if (!this.streamer.voiceConnection) {
      throw new Error("Join a voice channel before starting playback");
    }

    this.stop();

    const abort = new AbortController();
    this.playbackAbort = abort;

    try {
      const { command, output, controller } = prepareStream(
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
        abort.signal,
      );

      this.playbackController = controller;

      command.on("error", (error) => {
        console.error("[ffmpeg]", error);
      });

      await playStream(
        output,
        this.streamer,
        { type: "go-live" },
        abort.signal,
      );
    } finally {
      if (this.playbackAbort === abort) {
        this.playbackAbort = undefined;
        this.playbackController = undefined;
      }
    }
  }

  stop(): void {
    this.playbackAbort?.abort();
    this.playbackAbort = undefined;
    this.playbackController = undefined;
  }

  async setVolume(percent: number): Promise<boolean> {
    if (!Number.isFinite(percent) || percent < 0 || percent > 200) {
      throw new Error("Volume must be between 0 and 200");
    }

    if (!this.playbackController) {
      throw new Error("Nothing is currently playing");
    }

    return this.playbackController.setVolume(percent / 100);
  }

  getVolume(): number {
    return (this.playbackController?.volume ?? 1) * 100;
  }

  leave(): void {
    this.stop();
    this.streamer.leaveVoice();
  }
}
