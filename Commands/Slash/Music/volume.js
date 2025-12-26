const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ses",
  aliases: ["vol", "volume", "ses-seviyesi"],
  description: `Mevcut müziğin ses seviyesini değiştirir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let volume = Number(args[0]);

    if (!volume) {
      return client.embed(
        message,
        `❌ **Lütfen bir ses yüzdesi belirtin. (Örn: ${prefix}ses 75)**`
      );
    } else if (volume > 250 || volume < 1) {
      return client.embed(
        message,
        `❌ **Lütfen 1 ile 250 arasında geçerli bir değer girin!**`
      );
    } else {
      await queue.setVolume(volume);
      client.embed(
        message,
        `🔊 **Ses seviyesi %${queue.volume} olarak ayarlandı!**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
