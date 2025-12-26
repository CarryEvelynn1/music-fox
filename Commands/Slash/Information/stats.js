const {
  Message,
  EmbedBuilder,
  version,
  PermissionFlagsBits,
} = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");
const { msToDuration, formatBytes } = require("../../../handlers/functions");
const os = require("systeminformation");

module.exports = {
  name: "istatistik",
  aliases: ["stats", "botinfo", "i"],
  description: `Botun teknik verilerini ve durumunu gösterir.`,
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
    
    let memory = await os.mem();
    let cpu = await os.cpu();
    let cpuUsage = await (await os.currentLoad()).currentLoad;
    let osInfo = await os.osInfo();
    let TotalRam = formatBytes(memory.total);
    let UsageRam = formatBytes(memory.used);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle("__**Fox Music İstatistikleri**__")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(`> **By Fox Logic: Outsmart Everyone.**`)
          .addFields([
            {
              name: `⏳ Bellek Kullanımı`,
              value: `\`${UsageRam}\` / \`${TotalRam}\``,
              inline: true,
            },
            {
              name: `⌚ Çalışma Süresi`,
              value: `\`${msToDuration(client.uptime)}\``,
              inline: true,
            },
            {
              name: `📡 Gecikme (Ping)`,
              value: `\`${client.ws.ping}ms\``,
              inline: true,
            },
            {
              name: `👥 Kullanıcılar`,
              value: `\`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\``,
              inline: true,
            },
            {
              name: `🏠 Sunucular`,
              value: `\`${client.guilds.cache.size}\``,
              inline: true,
            },
            {
              name: `📺 Kanallar`,
              value: `\`${client.channels.cache.size}\``,
              inline: true,
            },
            {
              name: `👾 Discord.JS`,
              value: `\`v${version}\``,
              inline: true,
            },
            {
              name: `🤖 Node.js`,
              value: `\`${process.version}\``,
              inline: true,
            },
            {
              name: `📊 İşlemci Yükü`,
              value: `\`%${Math.floor(cpuUsage)}\``,
              inline: true,
            },
            {
              name: `💻 İşletim Sistemi`,
              value: `\`${osInfo.platform} (${osInfo.arch})\``,
              inline: false,
            },
            {
              name: `⚙️ İşlemci Modeli`,
              value: `\`\`\`fix\n${cpu.brand}\`\`\``,
            },
          ])
          .setFooter({ text: "By Fox Logic: Outsmart Everyone.", iconURL: message.author.displayAvatarURL() }),
      ],
    });
  },
};
