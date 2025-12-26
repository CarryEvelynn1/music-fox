const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "kaldır",
  aliases: ["sil", "remove", "rem", "remsong"],
  description: `Sıradaki belirli bir şarkıyı listeden siler.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    try {
      let songIndex = Number(args[0]);

      if (
        !songIndex ||
        isNaN(songIndex) ||
        songIndex < 1 ||
        songIndex > queue.songs.length
      ) {
        return client.embed(message, `❌ **Lütfen geçerli bir şarkı numarası belirtin.**`);
      }

      let removedTrack = queue.songs.splice(songIndex - 1, 1)[0];
      if (!removedTrack) {
        return client.embed(
          message,
          `❌ **Şarkı listeden kaldırılırken bir hata oluştu.**`
        );
      }

      client.embed(
        message,
        `🗑️ **\`${client.getTitle(removedTrack)}\` listeden başarıyla kaldırıldı!**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    } catch (error) {
      client.embed(
        message,
        `⚠️ **Bir hata oluştu:** \`${error.message}\``
      );
    }
  },
};
