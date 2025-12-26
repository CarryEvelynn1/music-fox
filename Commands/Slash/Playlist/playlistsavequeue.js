const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "sırayıkaydet",
  aliases: ["plsavequeue", "sırayı-sakla", "listsave"],
  description: `Şu anki çalma sırasının tamamını belirttiğiniz bir listeye kaydeder.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) {
      return client.embed(message, `❌ **Lütfen sıranın kaydedileceği listenin adını belirtin.**`);
    }

    const q = client.distube.getQueue(message.guild.id);
    if (!q || !q.songs?.length) {
      return client.embed(message, `❌ **Şu an çalma sırası boş, kaydedilecek bir şey bulunamadı.**`);
    }

    const tracks = q.songs.map((s) => Store.serializeSong(s, message.author)).filter(Boolean);
    
   
    await Store.create(client, message.guild.id, message.author.id, name);
    await Store.addTracks(client, message.guild.id, message.author.id, name, tracks);

    return client.embed(
      message, 
      `📚 **Başarılı! \`${tracks.length}\` adet şarkı \`${name}\` listesine topluca kaydedildi.**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
