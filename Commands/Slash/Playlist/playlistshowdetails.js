const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listeayrıntı",
  aliases: ["pldetails", "plinfo", "liste-bilgi", "liste-içerik"],
  description: `Belirttiğiniz çalma listesindeki şarkıları listeler.`,
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
      return client.embed(message, `❌ **İçeriğini görmek istediğiniz çalma listesinin adını belirtin.**`);
    }

    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl) {
      return client.embed(message, `❌ **\`${name}\` adında bir çalma listesi bulunamadı.**`);
    }

    if (!pl.tracks.length) {
      return client.embed(message, `📜 **\`${pl.name}\` listesi şu an boş.**`);
    }

    const lines = pl.tracks.slice(0, 25).map((t, i) => `\`${i + 1}.\` **${t.name}** ${t.formattedDuration ? `- \`${t.formattedDuration}\`` : ""}`);
    const more = pl.tracks.length > 25 ? `\n\n*...ve ${pl.tracks.length - 25} şarkı daha*` : "";

    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`📂 Liste: ${pl.name}`)
      .setDescription(lines.join("\n") + more + `\n\n**By Fox Logic: Outsmart Everyone.**`)
      .setFooter({ text: `Toplam Şarkı: ${pl.tracks.length}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};
