import { loadConfig } from "./config.js";
import { DiscordStreamer } from "./discord/streamer.js";
import { classifyInput } from "./source/classify.js";
import { resolveSource } from "./source/resolver.js";

const config = loadConfig();
const discord = new DiscordStreamer(config);

discord.client.on("ready", () => {
  console.log("vidbot ready as " + (discord.client.user?.tag ?? "unknown"));
});

discord.client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (
    config.allowedUsers.size > 0 &&
    !config.allowedUsers.has(message.author.id)
  ) {
    return;
  }
  if (!message.content.startsWith(config.prefix)) return;

  const parts = message.content
    .trim()
    .slice(config.prefix.length)
    .split(/\s+/);
  const command = (parts.shift() ?? "").toLowerCase();
  const argument = parts.join(" ").trim();

  try {
    switch (command) {
      case "play": {
        const voiceChannel = message.author.voice?.channel;
        if (!voiceChannel) {
          throw new Error("Join a voice channel before using play");
        }

        const attachment = message.attachments.first();
        const sourceInput = argument || attachment?.url;
        if (!sourceInput) {
          throw new Error("Usage: " + config.prefix + "play <file-or-url>");
        }

        const source = await resolveSource(sourceInput, config);
        await discord.join(message.guildId, voiceChannel.id);
        console.log("Playing " + source.provider + " source: " + sourceInput);
        await discord.play(source);
        break;
      }
      case "stop":
        discord.stop();
        break;
      case "leave":
        discord.leave();
        break;
      case "source": {
        if (!argument) {
          throw new Error(
            "Usage: " + config.prefix + "source <file-or-url>",
          );
        }
        await message.reply(JSON.stringify(classifyInput(argument)));
        break;
      }
      default:
        return;
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    await message.reply("vidbot: " + detail).catch(() => undefined);
    console.error(error);
  }
});

discord.login().catch((error) => {
  console.error("Discord login failed:", error);
  process.exitCode = 1;
});
