const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");
const findLyrics = require("simple-find-lyrics");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "sözler",
  aliases: ["lyrics", "lr", "şarkısözü"],
  description: `Çalan şarkının sözlerini bulur.`,
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
    let songname = client.getTitle(song);
    
    const { lyrics } = await findLyrics(songname);

    if (!lyrics) {
      return client.embed(message, `❌ **\`${songname}\` için şarkı sözü bulunamadı.**`);
    }

    let string = [];
    if (lyrics.length > 3000) {
      string.push(lyrics.substring(0, 3000));
      string.push(lyrics.substring(3000, Infinity));
    } else {
      string.push(lyrics);
    }

    let embeds = string.map((str) => {
      return new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({ name: `${songname} - Şarkı Sözleri`, iconURL: song.thumbnail })
        .setDescription(`📜 **Şarkı Sözleri:**\n\n${str}`)
        .setFooter({ text: "By Fox Logic: Outsmart Everyone.", iconURL: song.user.displayAvatarURL() });
    });

    swap_pages(message, embeds);
  },
};
