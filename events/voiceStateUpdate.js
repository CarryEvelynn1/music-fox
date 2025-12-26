const { ChannelType, Colors, Events } = require("discord.js");
const client = require("../index");
const { msToDuration } = require("../handlers/functions");

const leaveTimeout = client.config.options.leaveTimeout;

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (!newState.guild || newState.member.user.bot) return;
  const queue = client.distube.getQueue(newState.guild);

  
  if (
    newState.channelId &&
    newState.channel.type === ChannelType.GuildStageVoice &&
    newState.guild.me.voice.suppress
  ) {
    try {
      await newState.guild.me.voice.setSuppressed(false);
    } catch (error) {
      console.error("Botun sesi açılırken hata oluştu:", error);
    }
  }

  if (!queue) return;
  const db = await client.music?.get(`${queue.textChannel.guildId}.vc`);

  
  try {
    const twentyFourSevenEnabled = db?.enable;

    if (!twentyFourSevenEnabled && oldState.channel && !newState.channel) {
      
      const channel = queue.voiceChannel;
      if (!channel) return;

      const members = channel.members.filter((m) => !m.user.bot);

      if (members.size < 1) {
        
        const textChannel = queue.textChannel;
        const msg = await textChannel.send({
          embeds: [
            {
              description: `7/24 modu etkin olmadığı için \`${msToDuration(
                leaveTimeout
              )}\` içerisinde ses kanalından ayrılacağım.`,
              color: Colors.Red,
              footer: { text: "By Fox Logic: Outsmart Everyone." }
            },
          ],
        });
        setTimeout(() => msg.delete().catch(() => {}), 3000);

        
        const leaveTimeoutHandle = setTimeout(async () => {
          await queue.stop();
          await client.editPlayerMessage(queue.textChannel);
          const leaveMsg = await textChannel.send({
            embeds: [
              {
                description: "Kanalda yalnız kaldığım için ses kanalından ayrıldım.",
                color: Colors.Red,
                footer: { text: "By Fox Logic: Outsmart Everyone." }
              },
            ],
          });
          setTimeout(() => leaveMsg.delete().catch(() => {}), 3000);
        }, leaveTimeout);

        client.leaveTimeoutHandles.set(newState.guildId, leaveTimeoutHandle);
      }
    }

    
    if (!twentyFourSevenEnabled && !oldState.channel && newState.channel) {
      const leaveTimeoutHandle = client.leaveTimeoutHandles.get(
        oldState.guildId
      );
      if (leaveTimeoutHandle) {
        clearTimeout(leaveTimeoutHandle); 
        client.leaveTimeoutHandles.delete(oldState.guildId); 
      }
    }
  } catch (error) {
    console.log(`7/24 Sistemi Hatası: `, error);
  }
});
