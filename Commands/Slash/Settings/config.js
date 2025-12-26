const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "ayarlar",
  aliases: ["config", "cnf", "sunucu-ayarları"],
  description: `Sunucudaki Fox Music yapılandırmasını görüntüler.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    let data = await client.music.get(message.guild.id);

    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: `${message.guild.name} - Sunucu Ayarları`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setImage("https://cdn.discordapp.com/attachments/1452247810727477342/1453830202454053089/85a074861f51fc3a560a6077e1162bbb.gif?ex=694ee063&is=694d8ee3&hm=710063e608b60715199c23a4cfb6e4a71158c9281e356f5ec291678f6b4456b6&") 
      .addFields([
        {
          name: `📌 Prefix (Ön Ek)`,
          value: `\`${prefix}\``,
          inline: true
        },
        {
          name: `🎧 DJ Rolü`,
          value: `${
            data.djrole
              ? `✅ \`Aktif\``
              : `❌ \`Devre Dışı\``
          }`,
          inline: true
        },
        {
          name: `🔄 Otomatik Devam`,
          value: `${
            data.autoresume
              ? `✅ \`Aktif\``
              : `❌ \`Devre Dışı\``
          }`,
          inline: true
        },
        {
          name: `🕒 7/24 Modu`,
          value: `${
            data.vc.enable
              ? `✅ \`Aktif\``
              : `❌ \`Devre Dışı\``
          }`,
          inline: true
        },
        {
          name: `🎵 İstek Kanalı`,
          value: `${
            data.music.channel
              ? `<#${data.music.channel}>`
              : `❌ \`Ayarlanmadı\``
          }`,
          inline: true
        }
      ])
      .setDescription(`\n**By Fox Logic: Outsmart Everyone.**`)
      .setFooter({ 
        text: `${message.author.tag} tarafından istendi.`, 
        iconURL: message.author.displayAvatarURL({ dynamic: true }) 
      });

    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};
