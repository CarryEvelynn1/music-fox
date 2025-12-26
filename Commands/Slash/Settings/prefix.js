const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { PREFIX } = require("../../../settings/config");

module.exports = {
  name: "prefix",
  aliases: ["ön-ek", "setprefix", "önek"],
  description: `Botun bu sunucudaki komut ön ekini (prefix) değiştirmenizi sağlar.`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    let options = args[0];

    switch (options) {
      case "ayarla":
      case "set":
        {
          let nPrefix = args[1];
          if (!nPrefix) {
            return client.embed(
              message,
              `❌ **Lütfen yeni bir prefix (ön ek) belirtin.**`
            );
          } else {
            await client.music.set(`${message.guildId}.prefix`, nPrefix);
            client.embed(
              message,
              `✅ **Prefix başarıyla \`${nPrefix}\` olarak güncellendi.**\n\nBy Fox Logic: Outsmart Everyone.`
            );
          }
        }
        break;

      case "sıfırla":
      case "reset":
        {
          await client.music.set(`${message.guildId}.prefix`, PREFIX);
          client.embed(
            message,
            `✅ **Prefix başarıyla varsayılana sıfırlandı: \`${PREFIX}\`**\n\nBy Fox Logic: Outsmart Everyone.`
          );
        }
        break;

      default:
        {
          client.embed(
            message,
            `❌ **Yanlış Kullanım!**\n\n` +
            `🔹 \`${prefix}prefix ayarla <yeni-önek>\` - Yeni bir prefix belirler.\n` +
            `🔹 \`${prefix}prefix sıfırla\` - Prefixi varsayılana döndürür.`
          );
        }
        break;
    }
  },
};
