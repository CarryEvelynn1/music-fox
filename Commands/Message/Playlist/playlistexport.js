const { Message, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listedışaaktar",
  aliases: ["plexport", "playlistexport", "liste-yedekle"],
  description: `Çalma listenizi JSON dosyası olarak dışa aktarır.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,

  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) {
      return client.embed(
        message, 
        `❌ **Dışa aktarmak istediğiniz çalma listesinin adını belirtmelisiniz.**`
      );
    }

    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl) {
      return client.embed(
        message, 
        `❌ **\`${name}\` adında bir çalma listesi bulunamadı.**`
      );
    }

    const json = Buffer.from(JSON.stringify({ name: pl.name, tracks: pl.tracks }, null, 2));
    const file = new AttachmentBuilder(json, { name: `${pl.name}.foxmusic.json` });

    return message.reply({ 
      content: `📂 **\`${pl.name}\` adlı listeniz yedeklendi.**\n\nBy Fox Logic: Outsmart Everyone.`, 
      files: [file] 
    }).catch(() => {});
  },
};
