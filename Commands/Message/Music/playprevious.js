const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "önceki",
  aliases: ["pp", "playp", "playprevious", "geri"],
  description: `Sıradaki bir önceki şarkıyı tekrar çalar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    if (!queue.previousSongs.length) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Daha önce çalınmış bir şarkı bulunamadı!`
      );
    } else {
      await queue.previous().then((m) => {
        client.embed(
          message,
          `⏮️ **Önceki parça çalınıyor...**\n\nBy Fox Logic: Outsmart Everyone.`
        );
      });
    }
  },
};
