const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "otoynat",
  aliases: ["autoplay", "ap", "atp"],
  description: `Otomatik oynatma modunu açıp kapatır.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {FoxMusic} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    let autoplay = queue.toggleAutoplay();

    client.embed(
      message,
      `${client.config.emoji.SUCCESS} Otomatik Oynatma: \`${autoplay ? "Açık" : "Kapalı"}\`\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
