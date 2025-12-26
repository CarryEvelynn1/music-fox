const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "davet",
  aliases: ["inv", "invite", "ekle"],
  description: `Beni sunucuna eklemek için davet linkini al!`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {FoxMusic} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    
    const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

    client.embed(
      message,
      `**Beni Sunucuna Davet Etmek İçin Aşağıdaki Bağlantıya Tıkla:**\n\n[\`Beni Davet Et (Tıkla)\`](${inviteURL})\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
// eğer sağlam çalışırsa botu paylaşm linki üste okey