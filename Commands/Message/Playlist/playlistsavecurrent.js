const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "çalanıkaydet",
  aliases: ["plsavenp", "plsavenowplaying", "plsavenc", "şarkıyıkaydet"],
  description: `Şu an çalan şarkıyı belirttiğiniz bir çalma listesine kaydeder.`,
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
      return client.embed(message, `❌ **Lütfen şarkının kaydedileceği listenin adını belirtin.**`);
    }

    const q = client.distube.getQueue(message.guild.id);
    if (!q || !q.songs?.length) {
      return client.embed(message, `❌ **Şu an herhangi bir şarkı çalmıyor.**`);
    }

    const track = Store.serializeSong(q.songs[0], message.author);
    
    
    await Store.create(client, message.guild.id, message.author.id, name);
    await Store.addTracks(client, message.guild.id, message.author.id, name, [track]);

    return client.embed(
      message, 
      `💾 **\`${track.name}\` adlı şarkı \`${name}\` listesine başarıyla kaydedildi!**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
