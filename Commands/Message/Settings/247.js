const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "247",
  aliases: ["7/24", "aktif-kal", "24vc"],
  description: `Botun ses kanalında 7/24 kalma modunu açar/kapatır.`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    let data = await client.music.get(`${message.guild.id}.vc`);
    let mode = data?.enable;
    let channel = message.member.voice.channel;

    if (mode === true) {
      let dataOptions = {
        enable: false,
        channel: null,
      };
      await client.music.set(`${message.guild.id}.vc`, dataOptions);
      
      client.embed(
        message,
        `❌ **7/24 Modu Devre Dışı Bırakıldı.**\n*Bot artık müzik bittiğinde veya kanal boşaldığında odadan çıkacaktır.*`
      );
    } else {
      let dataOptions = {
        enable: true,
        channel: channel.id,
      };
      await client.music.set(`${message.guild.id}.vc`, dataOptions);
      
      client.embed(
        message,
        `✅ **7/24 Modu Aktif Edildi!**\n*Fox Music artık <#${channel.id}> kanalında kalıcı olarak duracaktır.*\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
