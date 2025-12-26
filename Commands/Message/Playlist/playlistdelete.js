const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listesil",
  aliases: ["pldelete", "pldel", "playlistdelete", "liste-sil"],
  description: `Mevcut bir çalma listenizi kalıcı olarak siler.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,

  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    
    if (!name) {
      return client.embed(
        message, 
        `❌ **Silmek istediğiniz çalma listesinin adını belirtmelisiniz.**`
      );
    }

    const ok = await Store.delete(client, message.guild.id, message.author.id, name);
    
    if (!ok) {
      return client.embed(
        message, 
        `❌ **\`${name}\` adında bir çalma listesi bulunamadı.**`
      );
    }

    return client.embed(
      message, 
      `🗑️ **\`${name}\` adlı çalma listeniz başarıyla silindi.**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
