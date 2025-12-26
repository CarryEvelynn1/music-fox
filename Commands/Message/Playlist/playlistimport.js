const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "listeiceaktar",
  aliases: ["plimport", "playlistimport", "liste-yükle"],
  description: `JSON formatındaki bir dosyadan veya koddan çalma listesi yükler.`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,

  run: async (client, message, args) => {
    const targetName = args.join(" ").trim();
    if (!targetName) {
      return client.embed(message, `❌ **Lütfen içe aktarılacak listenin adını belirtin.**`);
    }

    const attachment = message.attachments.first();
    let content = null;

    try {
      if (attachment && attachment.url && attachment.size < 1024 * 1024) {
        const res = await fetch(attachment.url);
        content = await res.text();
      } else if (message.content && message.content.includes("```")) {
        const code = message.content.split("```")[1] || "";
        content = code.replace(/^[a-z]+\n/i, "").trim();
      }

      if (!content) {
        return client.embed(message, `❌ **Lütfen bir JSON dosyası ekleyin veya kod bloğu içinde JSON verisi paylaşın.**`);
      }

      const data = JSON.parse(content);
      if (!data || !Array.isArray(data.tracks)) throw new Error("Geçersiz liste yapısı.");

      const tracks = data.tracks
        .filter(t => t && (t.url || t.name))
        .map(t => ({
          name: (t.name || "Bilinmeyen Şarkı").toString().slice(0, 256),
          url: t.url ? t.url.toString() : undefined,
          duration: typeof t.duration === "number" ? t.duration : undefined,
          uploader: t.uploader ? t.uploader.toString() : "Fox Music",
          thumbnail: t.thumbnail ? t.thumbnail.toString() : undefined,
          source: t.source ? t.source.toString() : "youtube",
        }));

      if (!tracks.length) {
        return client.embed(message, `❌ **Dosya içerisinde geçerli bir şarkı bulunamadı.**`);
      }

      const exists = await Store.get(client, message.guild.id, message.author.id, targetName);
      if (!exists) {
        await Store.create(client, message.guild.id, message.author.id, targetName, tracks);
      } else {
        await Store.addTracks(client, message.guild.id, message.author.id, targetName, tracks);
      }

      return client.embed(
        message, 
        `✅ **${tracks.length} adet şarkı '${targetName}' listesine başarıyla aktarıldı!**\n\nBy Fox Logic: Outsmart Everyone.`
      );
    } catch (e) {
      return client.embed(message, `❌ **İçe aktarma hatası:** \`${e.message}\``);
    }
  },
};
