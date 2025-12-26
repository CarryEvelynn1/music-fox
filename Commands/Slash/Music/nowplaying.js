const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "çalan",
  aliases: ["np", "nowplaying", "suancalan"],
  description: `Şu an çalan şarkı hakkında detaylı bilgi verir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
  djOnly: false,

  run: async (client, message, args, prefix, queue) => {
    let song = queue.songs[0];

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setThumbnail(song.thumbnail)
          .setAuthor({
            name: `Şu An Çalıyor`,
            iconURL: "https://cdn.discordapp.com/emojis/913385417441542154.gif",
            url: song.url,
          })
          .setDescription(`🎵 **[${client.getTitle(song)}](${song.url})**`)
          .addFields([
            {
              name: `**⏳ Süre**`,
              value: `\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
              inline: true,
            },
            {
              name: `**👤 İsteyen**`,
              value: `\`${song.user.tag}\``,
              inline: true,
            },
            {
              name: `**🎤 Sanatçı**`,
              value: `\`${song.uploader.name}\``,
              inline: true,
            },
          ])
          .setFooter({ text: "By Fox Logic: Outsmart Everyone.", iconURL: message.author.displayAvatarURL() }),
      ],
    });
  },
};
