const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listeadınıdeğiştir",
  aliases: ["plrename", "playlistrename", "liste-ad-değiş"],
  description: `Mevcut bir çalma listenizin adını günceller.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,

  run: async (client, message, args, prefix) => {
    const oldName = (args.shift() || "").trim();
    const newName = args.join(" ").trim();

    if (!oldName || !newName) {
      return client.embed(
        message, 
        `❌ **Yanlış Kullanım! Örnek: \`${prefix}listeadınıdeğiştir <eski-ad> <yeni-ad>\`**`
      );
    }

    const ok = await Store.rename(client, message.guild.id, message.author.id, oldName, newName);

    if (!ok) {
      return client.embed(
        message, 
        `❌ **İsim değiştirilemedi. Lütfen eski adın doğruluğunu veya yeni adın başka bir listede kullanılmadığını kontrol edin.**`
      );
    }

    return client.embed(
      message, 
      `📝 **\`${oldName}\` adlı listenin adı başarıyla \`${newName}\` olarak değiştirildi.**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
