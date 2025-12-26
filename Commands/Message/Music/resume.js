const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "devamet",
  aliases: ["resume", "rsume", "d", "başlat"],
  description: `Durdurulmuş olan müziği kaldığı yerden devam ettirir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    if (queue.paused) {
      queue.resume();
      client.embed(
        message, 
        `▶️ **Müzik devam ettiriliyor...**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    } else {
      client.embed(
        message,
        `❌ **Müzik zaten çalıyor!**`
      );
    }
  },
};
