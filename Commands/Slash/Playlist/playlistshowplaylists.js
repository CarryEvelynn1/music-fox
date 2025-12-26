const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listelerim",
  aliases: ["pllist", "plshow", "playlist-listesi", "listeler"],
  description: `Oluşturduğunuz tüm çalma listelerini gösterir.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message) => {
    const all = await Store.getAll(client, message.guild.id, message.author.id);
    const names = Object.keys(all);

    if (!names.length) {
      return client.embed(
        message, 
        `❌ **Henüz hiç çalma listeniz bulunmuyor. \`listeoluştur\` komutuyla bir tane kurabilirsiniz!**`
      );
    }

    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`🎵 ${message.author.username} Adlı Kullanıcının Çalma Listeleri`)
      .setDescription(
        names.map((n) => `📂 **${n}** \`(${all[n].length} Şarkı)\``).join("\n") +
        `\n\n**By Fox Logic: Outsmart Everyone.**`
      )
      .setFooter({ 
        text: `Toplam ${names.length} liste bulundu.`, 
        iconURL: message.author.displayAvatarURL({ dynamic: true }) 
      });

    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};
