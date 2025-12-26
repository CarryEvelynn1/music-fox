const {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");
const { numberEmojis } = require("../../../settings/config");

module.exports = {
  name: "ara",
  aliases: ["sr", "find", "search", "bul"],
  description: `İsim ile şarkı aramanızı ve seçmenizi sağlar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix, queue) => {
    let query = args.join(" ");
    if (!query) {
      return client.embed(message, `❌ **Aramak istediğiniz şarkı adını belirtmelisiniz.**`);
    }

    let res = await client.distube.search(query, {
      limit: 10,
      retried: true,
      safeSearch: true,
      type: "video",
    });

    let tracks = res
      .map((song, index) => {
        return `\`${index + 1}\`) [\`${client.getTitle(song)}\`](${song.url}) \`[${song.formattedDuration}]\``;
      })
      .join("\n\n");

    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`🔎 "${query}" İçin Arama Sonuçları`)
      .setDescription(tracks.substring(0, 3800))
      .setFooter({ text: "By Fox Logic: Outsmart Everyone.", iconURL: message.author.displayAvatarURL() });

    let menuraw = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("search")
        .setPlaceholder(`Oynatmak istediğiniz şarkıyı seçin`)
        .addOptions(
          res.map((song, index) => {
            return {
              label: client.getTitle(song).substring(0, 95),
              value: song.url,
              description: `Süre: ${song.formattedDuration} | Bu şarkıyı çalmak için tıkla.`,
              emoji: numberEmojis[index + 1],
            };
          })
        ),
    ]);

    message
      .reply({ embeds: [embed], components: [menuraw] })
      .then(async (msg) => {
        let filter = (i) => i.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({
          filter: filter,
          time: 60000 
        });
        
        const { channel } = message.member.voice;
        
        collector.on("collect", async (interaction) => {
          if (interaction.isStringSelectMenu()) {
            await interaction.deferUpdate().catch((e) => {});
            if (interaction.customId === "search") {
              let song = interaction.values[0];
              client.distube.play(channel, song, {
                member: message.member,
                textChannel: message.channel,
              });
              await msg.delete().catch(() => {});
            }
          }
        });
      });
  },
};
