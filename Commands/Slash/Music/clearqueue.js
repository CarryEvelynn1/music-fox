const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "sırayıtemizle",
  aliases: ["clq", "clearq", "sırasil"],
  description: `Mevcut şarkı sırasını tamamen temizler.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    queue.remove();
    client.embed(
      message, 
      `${client.config.emoji.SUCCESS} Şarkı sırası temizlendi!\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
