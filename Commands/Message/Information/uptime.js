const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "çalışmasüresi",
  aliases: ["uptime", "up", "aktiflik"],
  description: `Botun ne kadar süredir çevrimiçi olduğunu gösterir.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {FoxMusic} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    
    client.embed(
      message,
      `🕒 **Çalışma Süresi:** <t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
