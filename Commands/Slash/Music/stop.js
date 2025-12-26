const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "kapat",
  aliases: ["st", "stop", "durdur", "bitir", "destroy"],
  description: `Müzik sırasını tamamen sonlandırır ve botu kanaldan çıkarır.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    queue.stop();
    
    try {
      const db = await client.music?.get(`${message.guildId}.vc`);
      if (!db?.enable) await client.distube.voices.leave(message.guild);
    } catch {}

    client.embed(
      message, 
      `⏹️ **Müzik sırası sonlandırıldı ve liste temizlendi!**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
