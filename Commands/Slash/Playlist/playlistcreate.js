const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listeoluştur",
  aliases: ["plcreate", "playlistcreate", "liste-kur"],
  description: `Kendiniz için yeni bir çalma listesi oluşturur.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    
    if (!name) {
      return client.embed(
        message, 
        `❌ **Lütfen oluşturmak istediğiniz çalma listesi için bir isim belirtin.**`
      );
    }

    await Store.create(client, message.guild.id, message.author.id, name);
    
    return client.embed(
      message, 
      `📂 **\`${name}\` adlı çalma listeniz başarıyla oluşturuldu!**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
