const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "liste",
  aliases: ["q", "list", "sıra", "queue"],
  description: `Mevcut müzik sırasını sayfalar halinde gösterir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
  djOnly: false,

  run: async (client, message, args, prefix, queue) => {
    if (!queue.songs.length) {
      return client.embed(
        message,
        `❌ **Şu an çalma listesinde hiç şarkı yok!**`
      );
    } else {
      let embeds = await client.getQueueEmbeds(queue);
      
      
      embeds.forEach(embed => {
        embed.setFooter({ text: "By Fox Logic: Outsmart Everyone." });
      });

      await swap_pages(message, embeds);
    }
  },
};
