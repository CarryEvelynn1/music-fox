const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listedenşarkısil",
  aliases: ["plremovetrack", "plrm", "playlist-rm", "şarkı-sil"],
  description: `Çalma listenizden numarasını belirterek bir şarkıyı siler.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    const name = args.shift();
    const idx = Number(args.shift());

    if (!name || !idx) {
      return client.embed(
        message, 
        `❌ **Kullanım: \`${prefix}listedenşarkısil <liste-adı> <şarkı-no>\`**`
      );
    }

    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl) {
      return client.embed(message, `❌ **Belirtilen isimde bir çalma listesi bulunamadı.**`);
    }

    const removed = await Store.removeTrack(client, message.guild.id, message.author.id, pl.name, idx);
    
    if (!removed) {
      return client.embed(message, `❌ **Geçersiz şarkı numarası. Lütfen listedeki sırasını kontrol edin.**`);
    }

    return client.embed(
      message, 
      `✅ **\`${removed.name}\` adlı şarkı \`${pl.name}\` listesinden başarıyla kaldırıldı.**\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
