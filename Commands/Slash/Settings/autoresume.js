const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "otodevam",
  aliases: ["autoresume", "atresume", "otomatik-devam"],
  description: `Bot yeniden başlatıldığında müziğin kaldığı yerden devam etmesini sağlar.`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    let data = await client.music.get(`${message.guild.id}.autoresume`);

    if (data === true) {
      await client.music.set(`${message.guild.id}.autoresume`, false);
      client.embed(
        message,
        `❌ **Otomatik Devam Etme Sistemi Devre Dışı Bırakıldı.**`
      );
    } else {
      await client.music.set(`${message.guild.id}.autoresume`, true);
      client.embed(
        message,
        `✅ **Otomatik Devam Etme Sistemi Aktif Edildi!**\n*Bot yeniden başlatılsa bile müzik sırası korunacaktır.*\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
