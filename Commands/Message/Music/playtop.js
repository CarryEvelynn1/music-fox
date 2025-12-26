const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "başaekle",
  aliases: ["pt", "ptop", "playtop", "üstesırala"],
  description: `Belirttiğiniz şarkıyı sıranın en başına ekler.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let song = args.join(" ");
    if (!song) {
      return client.embed(
        message,
        `❌ **Lütfen sıranın başına eklemek için bir şarkı adı veya bağlantı belirtin.**`
      );
    } else {
      let { channel } = message.member.voice;
      client.distube.play(channel, song, {
        member: message.member,
        textChannel: message.channel,
        message: message,
        unshift: true,
      });

      client.embed(
        message,
        `🔝 **Şarkı sıranın en başına (bir sonraki çalacak şekilde) eklendi!**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
