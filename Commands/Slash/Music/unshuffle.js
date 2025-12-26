const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "karıştırmayıgerial",
  aliases: ["unshuffle", "unsfl", "düzelt"],
  description: `Karıştırılmış olan müzik listesini eski haline getirir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
      return client.embed(
        message,
        `❌ **Daha önce karıştırılmış bir liste bulunamadı!**`
      );
    } else {
      const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
      queue.songs = [queue.songs[0], ...shuffleData];
      client.shuffleData.delete(`shuffle-${queue.id}`);
      
      client.embed(
        message,
        `🔙 **Liste eski haline döndürüldü!**\n🎶 **\`${queue.songs.length}\` adet şarkı orijinal sırasına getirildi.**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
