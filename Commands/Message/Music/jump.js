const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "atla",
  aliases: ["jump", "jmp", "jp", "git"],
  description: `Sıradaki belirli bir şarkıya atlamanızı sağlar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let index = Number(args[0]);
    if (!index) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Lütfen bir şarkı numarası belirtin.`
      );
    }
    let song = queue.songs[index];
    if (index > queue.songs.length - 1 || index < 0) {
      return client.embed(
        message,
        `${
          client.config.emoji.ERROR
        } **Geçersiz numara! Lütfen \`0\` ile \`${
          queue.songs.length - 1
        }\` arasında bir değer girin.**`
      );
    } else {
      queue.jump(index).then((q) => {
        client.embed(
          message,
          `** ${
            client.config.emoji.SUCCESS
          } Belirtilen şarkıya atlandı: [\`${client.getTitle(song)}\`](${song.url}) **\n\nBy Fox Logic: Outsmart Everyone.`
        );
      });
    }
  },
};
