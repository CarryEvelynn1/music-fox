const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "tekraroynat",
  aliases: ["rp", "rplay", "replay", "baştan"],
  description: `Şu an çalan şarkıyı en başa sarar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    queue.seek(0);
    client.embed(
      message, 
      `🔄 **Şarkı başarıyla en başa sarıldı!**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
