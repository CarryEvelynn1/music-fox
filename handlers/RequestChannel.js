const { PermissionFlagsBits, Events } = require("discord.js");
const FoxMusic = require("./Client");

/**
 * @param {FoxMusic} client
 */
module.exports = async (client) => {
  client.on(Events.MessageCreate, async (message) => {
    try {
      
      if (!message.guild || !message.id) return;

      const guildId = message.guild.id;
      const data = await client.music.get(`${guildId}.music`);

      
      if (!data) return;

      const musicChannelId = data.channel;
      const musicChannel = message.guild.channels.cache.get(musicChannelId);

      
      if (!musicChannel || message.channelId !== musicChannelId) return;

      
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.ManageMessages
        )
      ) {
        return client.embed(
          message,
          `** ${client.config.emoji.ERROR} ${musicChannel} kanalında \`Mesajları Yönet\` yetkim yok! **`
        );
      }

      
      if (data.pmsg !== message.id && data.qmsg !== message.id) {
        await message.delete().catch(() => {});
      }

      
      if (message.author.bot) return;

      const song = message.cleanContent;
      const voiceChannel = message.member.voice.channel;

      
      if (
        !message.guild.members.me.permissions.has(PermissionFlagsBits.Connect)
      ) {
        return client.embed(
          message,
          `** ${client.config.emoji.ERROR} Ses kanalına bağlanma yetkim yok! **`
        );
      }

      
      if (!voiceChannel) {
        return client.embed(
          message,
          `** ${client.config.emoji.ERROR} Şarkı çalmak için bir ses kanalına katılmalısın! **`
        );
      }

      
      if (
        message.guild.members.me.voice.channel &&
        !message.guild.members.me.voice.channel.equals(voiceChannel)
      ) {
        return client.embed(
          message,
          `** ${client.config.emoji.ERROR} Benimle aynı ses kanalında olmalısın! **`
        );
      }

      
      await client.distube.play(voiceChannel, song, {
        member: message.member,
        message: message,
        textChannel: message.channel,
      });
      
    } catch (error) {
      console.error("Mesaj kanal işleme hatası:", error);
    }
  });
};
