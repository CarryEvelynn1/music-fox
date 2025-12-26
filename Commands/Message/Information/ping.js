const { Message, PermissionFlagsBits, Colors } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ping",
  aliases: ["gecikme", "latency", "ms"],
  description: `Botun gecikme ve hız değerlerini ölçer.`,
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
    const startTime = Date.now();

    
    const tempMessage = await message.reply({
      embeds: [
        {
          description: "🔍 **Gecikme değerleri hesaplanıyor...**",
          color: Colors.Gold,
          footer: { text: "By Fox Logic: Outsmart Everyone." },
        },
      ],
    });

    
    const messageLatency = tempMessage.createdTimestamp - message.createdTimestamp;
    const botLatency = Date.now() - startTime;
    const apiLatency = Math.round(client.ws.ping);
    const totalLatency = botLatency + apiLatency;

    
    await tempMessage.edit({
      embeds: [
        {
          title: "🤭 **Ping! Veriler Hazır**",
          description: "Botun güncel bağlantı hızları aşağıdadır:",
          color: Colors.LuminousVividPink,
          fields: [
            {
              name: "🤖 **Bot Gecikmesi**",
              value: `\`${botLatency}ms\``,
              inline: true,
            },
            {
              name: "💬 **Mesaj Hızı**",
              value: `\`${messageLatency}ms\``,
              inline: true,
            },
            {
              name: "📡 **API (Discord) Ping**",
              value: `\`${apiLatency}ms\``,
              inline: true,
            },
            {
              name: "🌍 **Toplam Gecikme**",
              value: `\`${totalLatency}ms\``,
              inline: false,
            },
          ],
          footer: {
            text: "By Fox Logic: Outsmart Everyone.",
            icon_url: client.user.displayAvatarURL(),
          },
          timestamp: new Date(),
        },
      ],
    });
  },
};
