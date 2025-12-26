const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "döngü",
  aliases: ["loop", "lp", "tekrar"],
  description: `Şarkı veya sıra için tekrarlama modunu ayarlar.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let loopmode = args[0];
    let mods = ["şarkı", "s", "sıra", "q", "kapat"];
    
    if (!loopmode || !mods.includes(loopmode)) {
      return client.embed(
        message,
        `❌ **Yanlış Kullanım!**\n\nGeçerli modlar: \`\`\`${mods.join(" | ")}\`\`\``
      );
    }

    if (loopmode === "kapat") {
      await queue.setRepeatMode(0);
      return client.embed(
        message,
        `⭕ **Döngü Kapatıldı!**\n\nArtık şarkılar bittiğinde liste duracak.\n\nBy Fox Logic: Outsmart Everyone.`
      );
    } else if (loopmode === "şarkı" || loopmode === "s") {
      await queue.setRepeatMode(1);
      return client.embed(
        message,
        `🔂 **Şarkı Döngüsü Aktif!**\n\nŞu an çalan şarkı durmadan tekrarlanacak.\n\nBy Fox Logic: Outsmart Everyone.`
      );
    } else if (loopmode === "sıra" || loopmode === "q") {
      await queue.setRepeatMode(2);
      return client.embed(
        message,
        `🔁 **Sıra Döngüsü Aktif!**\n\nTüm liste bittikten sonra tekrar başlayacak.\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
