const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "durdur",
  aliases: ["pause", "beklet", "pu"],
  description: `Çalan müziği geçici olarak durdurur.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    if (!queue.paused) {
      queue.pause();
      client.embed(
        message, 
        `⏸️ **Müzik durduruldu.**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    } else {
      client.embed(
        message,
        `❌ **Müzik zaten durdurulmuş durumda!**`
      );
    }
  },
};
