const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "çalatla",
  aliases: ["ps", "pskip", "playskip", "hemençal"],
  description: `Mevcut şarkıyı atlayarak yeni bir şarkı çalar.`,
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
        `❌ **Lütfen bir şarkı adı veya bağlantısı belirtin.**`
      );
    } else {
      let { channel } = message.member.voice;
      client.distube.play(channel, song, {
        member: message.member,
        textChannel: message.channel,
        message: message,
        skip: true,
      });
      
      client.embed(
        message,
        `⏭️ **Mevcut şarkı atlanıyor ve yeni şarkı başlatılıyor...**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
