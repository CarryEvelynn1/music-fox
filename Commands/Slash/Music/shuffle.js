const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "karıştır",
  aliases: ["sfl", "shuffle", "mix"],
  description: `Mevcut müzik sırasını rastgele karıştırır.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    client.shuffleData.set(`shuffle-${queue.id}`, queue.songs.slice(1));
    queue.shuffle();
    
    client.embed(
      message,
      `🔀 **Liste başarıyla karıştırıldı!**\n🎶 **\`${queue.songs.length}\` adet şarkı yeni sırasına dizildi.**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
