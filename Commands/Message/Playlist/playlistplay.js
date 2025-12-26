const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listeoynat",
  aliases: ["plplay", "playlistplay", "liste-çal"],
  description: `Kaydedilmiş bir çalma listenizdeki tüm şarkıları sırayla oynatır.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: true,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) return client.embed(message, `❌ **Oynatmak istediğiniz listenin adını belirtin.**`);

    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl || !pl.tracks.length) return client.embed(message, `❌ **Çalma listesi boş veya bulunamadı.**`);

    const vc = message.member.voice.channel;
    if (!vc) return client.embed(message, `❌ **Önce bir ses kanalına katılmalısınız.**`);

    if (message.guild.members.me.voice.channel && !message.guild.members.me.voice.channel.equals(vc))
      return client.embed(message, `❌ **Şu an bulunduğum ses kanalına katılmalısınız.**`);

    const first = pl.tracks[0];
    await client.distube.play(vc, first.url || first.name, {
      member: message.member,
      textChannel: message.channel,
      message,
    });

    for (const t of pl.tracks.slice(1)) {
      await client.distube.play(vc, t.url || t.name, {
        member: message.member,
        textChannel: message.channel,
        skip: true, // Listeyi sıraya eklerken hata payını düşürür
      });
    }

    return client.embed(
      message, 
      `🎶 **\`${pl.name}\` adlı listedeki ${pl.tracks.length} şarkı sıraya eklendi!**`
    );
  },
};
