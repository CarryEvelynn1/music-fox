const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "yüksekkalite",
  aliases: ["hqmode", "highquality", "hq", "ses-kalitesi"],
  description: "Yüksek kalite modunu (yeniden kodlamayı önleme) açar/kapatır.",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message) => {
    const key = `${message.guildId}.hqmode`;
    const current = (await client.music.get(key)) ?? false;
    const next = !current;
    
    await client.music.set(key, next);
    
    return client.embed(
      message,
      `✨ **Yüksek Kalite (HQ) modu şu an: \`${next ? "Aktif" : "Devre Dışı"}\`**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
