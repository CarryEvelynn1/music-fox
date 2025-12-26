const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "çal",
  aliases: ["p", "play", "song", "şarkı"],
  description: `İsim veya bağlantı ile favori şarkılarınızı çalar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix, queue) => {
    const song = args.join(" ");

    if (!song) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Lütfen bir şarkı adı veya bağlantısı belirtin.`
      );
    } else {
      let { channel } = message.member.voice;
      const hqStored = await client.music.get(`${message.guildId}.hqmode`);
      const hqMode = (hqStored === undefined ? process.env.HQ_MODE === "true" : hqStored) || false;

      try {
        await client.distube.voices.join(channel);
      } catch {}

      const isURL = /^(https?:\/\/)/i.test(song);
      const query = isURL ? song : `ytsearch1:${song}`;

      await client.distube.play(channel, query, {
        member: message.member,
        textChannel: message.channel,
        message: message,
        ...(hqMode ? { volume: 100 } : {}),
      });

      await message.delete().catch((err) => {});
    }
  },
};
