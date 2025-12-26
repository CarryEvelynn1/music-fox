const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");
const { skip } = require("../../../handlers/functions");

module.exports = {
  name: "atla",
  aliases: ["s", "skp", "skip", "geç"],
  description: `Sıradaki bir sonraki şarkıya geçiş yapar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    await skip(queue);
    
    client.embed(
      message, 
      `⏭️ **Şarkı başarıyla atlandı!**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
