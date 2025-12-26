const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "sıfırla",
  aliases: ["reset", "ayarları-sıfırla", "fabrika-ayarları"],
  description: `Sunucudaki tüm bot ayarlarını (prefix, DJ rolü, 7/24 vb.) varsayılana döndürür.`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 10,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    
    await client.music.delete(message.guildId);

    return client.embed(
      message, 
      `♻️ **Sunucu ayarları başarıyla sıfırlandı!**\n*Tüm özel yapılandırmalar (Prefix, DJ Rolü, 7/24) varsayılan değerlerine döndürüldü.*\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
