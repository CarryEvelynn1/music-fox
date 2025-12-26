const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "dj",
  aliases: ["dj-ayarla", "setupdj"],
  description: `DJ sistemini ve rolünü yönetmenizi sağlar.`,
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
      case "aç":
      case "enable":
        {
          let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!role) {
            return client.embed(
              message,
              `❌ **Lütfen bir rol etiketleyin veya geçerli bir Rol ID'si girin.**`
            );
          } else {
            await client.music.set(`${message.guild.id}.djrole`, role.id);
            client.embed(
              message,
              `✅ **${role} rolü başarıyla DJ rolü olarak atandı.**\n\nBy Fox Logic: Outsmart Everyone.`
            );
          }
        }
        break;

      case "kapat":
      case "disable":
        {
          await client.music.set(`${message.guild.id}.djrole`, null);
          client.embed(
            message,
            `✅ **DJ sistemi başarıyla devre dışı bırakıldı.**\n\nBy Fox Logic: Outsmart Everyone.`
          );
        }
        break;

      case "komutlar":
      case "cmds":
        {
          const djcommands = client.mcommands
            .filter((cmd) => cmd?.djOnly)
            .map((cmd) => cmd.name)
            .join(", ");

          client.embed(
            message,
            `🎧 **DJ Yetkisi Gerektiren Komutlar:**\n\`\`\`js\n${djcommands || "Bulunamadı"}\`\`\``
          );
        }
        break;

      default:
        {
          client.embed(
            message,
            `❌ **Yanlış Kullanım!**\n\n` +
            `🔹 \`${prefix}dj aç <@rol>\` - DJ sistemini aktif eder.\n` +
            `🔹 \`${prefix}dj kapat\` - DJ sistemini kapatır.\n` +
            `🔹 \`${prefix}dj komutlar\` - DJ komutlarını listeler.`
          );
        }
        break;
    }
  },
};
