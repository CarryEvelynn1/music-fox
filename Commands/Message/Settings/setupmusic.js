const { Message, ChannelType, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");

module.exports = {
  name: "kurulum",
  aliases: ["setupmusic", "setmusic", "setup", "kanal-kur"],
  description: `Sunucuda özel bir müzik istek kanalı oluşturur.`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Settings",
  cooldown: 10,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  run: async (client, message, args, prefix) => {
    let channelId = await client.music.get(`${message.guild.id}.music.channel`);
    let oldChannel = message.guild.channels.cache.get(channelId);

    if (oldChannel) {
      return client.embed(
        message,
        `❌ **Müzik istek kanalı zaten mevcut: ${oldChannel}**\n*Yeniden kurmak için önce mevcut kanalı silmelisiniz.*`
      );
    } else {
      message.guild.channels
        .create({
          name: `fox-music-istek`,
          type: ChannelType.GuildText,
          rateLimitPerUser: 3,
          reason: `Müzik istek kanalının yönetimi.`,
          topic: `🎵 Fox Music İstek Kanalı: Buraya şarkı ismi veya linki göndererek müzik çalabilirsiniz.`,
          permissionOverwrites: [
            {
              id: client.user.id,
              allow: [
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.ViewChannel,
              ],
            },
          ],
        })
        .then(async (ch) => {
          
          await ch
            .send({ embeds: [client.queueembed(message.guild)] })
            .then(async (queuemsg) => {
             
              await ch
                .send({
                  embeds: [client.playembed(message.guild)],
                  components: client.buttons(true),
                })
                .then(async (playmsg) => {
                  await client.music.set(`${message.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  
                  client.embed(
                    message,
                    `✅ **Müzik sistemi başarıyla ${ch} kanalına kuruldu!**\n\nBy Fox Logic: Outsmart Everyone.`
                  );
                });
            });
        })
        .catch((e) => {
          return client.embed(message, `❌ **Kanal oluşturulurken bir hata oluştu:** \`${e.message}\``);
        });
    }
  },
};
