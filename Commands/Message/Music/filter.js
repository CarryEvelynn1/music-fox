const {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "filtre",
  aliases: ["fl", "filters", "filtreler"],
  description: `Şarkı sırasına ses filtresi eklemenizi sağlar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    const filters = Object.keys(client.config.filters);

    const row = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("filter-menu")
        .setPlaceholder("Bir filtre seçmek için tıkla..")
        .addOptions(
          [
            {
              label: `Kapat`,
              description: `Tüm filtreleri devre dışı bırakır.`,
              value: "off",
            },
            filters
              .filter((_, index) => index <= 22)
              .map((value) => {
                return {
                  label: value.toLocaleUpperCase(),
                  description: `${value} filtresini uygulamak için tıkla.`,
                  value: value,
                };
              }),
          ].flat(Infinity)
        ),
    ]);

    let msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle(`Ses Filtresi Seçin`)
          .setFooter({ text: "By Fox Logic: Outsmart Everyone." })
          .setDescription(
            `> Aşağıdaki menüden bir filtre seçerek müzik keyfini özelleştirebilirsin!`
          ),
      ],
      components: [row],
    });

    const collector = await msg.createMessageComponentCollector({
      time: 60000 * 10,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        await interaction.deferUpdate().catch((e) => {});
        if (interaction.customId === "filter-menu") {
          if (interaction.user.id !== message.author.id) {
            return interaction.followUp({
              content: `Bu menüyü sadece komutu kullanan kişi yönetebilir.`,
              ephemeral: true,
            });
          }
          let filter = interaction.values[0];
          if (filter === "off") {
            queue.filters.clear();
            interaction.followUp({
              content: `${client.config.emoji.SUCCESS} Tüm filtreler kapatıldı!`,
              ephemeral: true,
            });
          } else {
            if (queue.filters.has(filter)) {
              queue.filters.remove(filter);
            } else {
              queue.filters.add(filter);
            }
            interaction.followUp({
              content: `${client.config.emoji.SUCCESS} Aktif Filtreler: \`${queue.filters.names.join(", ") || "Yok"}\``,
              ephemeral: true,
            });
          }
        }
      }
    });
  },
};
