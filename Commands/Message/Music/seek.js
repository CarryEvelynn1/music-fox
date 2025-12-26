const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ilerlet",
  aliases: ["sk", "seek", "süre"],
  description: `Çalan şarkıyı belirli bir saniyeye ilerletir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let seek = Number(args[0]);
    if (!seek) {
      return client.embed(
        message, 
        `❌ **Lütfen ilerletmek istediğiniz süreyi saniye cinsinden belirtin.**`
      );
    } else {
      queue.seek(seek);
      client.embed(
        message,
        `⏩ **Şarkı \`${seek}\`. saniyeye ilerletildi!**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
