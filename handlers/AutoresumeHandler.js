const { Song, SearchResultVideo } = require("distube");
const FoxMusic = require("./Client"); 

/**
 * @param {FoxMusic} client
 */
module.exports = async (client) => {
  
  if (!client.autoresume) return;

  
  const guildIds = await client.autoresume.keys;
  if (!guildIds || !guildIds.length) return;

  console.log(` [Fox Music] :: ${guildIds.length} sunucuda şarkılar kaldığı yerden başlatılıyor...`);

  for (const gId of guildIds) {
    const guild = client.guilds.cache.get(gId);
    if (!guild) {
      await client.autoresume.delete(gId);
      continue;
    }

    const data = await client.autoresume.get(guild.id);
    if (!data) continue;

    
    const voiceChannel = guild.channels.cache.get(data.voiceChannel);
    if (!voiceChannel) {
      await client.autoresume.delete(gId);
      continue;
    }

    
    if (
      !voiceChannel.members ||
      voiceChannel.members.filter(
        (m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf
      ).size < 1
    ) {
      await client.autoresume.delete(gId);
      continue;
    }

    
    const textChannel = guild.channels.cache.get(data.textChannel);
    if (!textChannel) {
      await client.autoresume.delete(gId);
      continue;
    }

    const tracks = data.songs;
    if (!tracks || !tracks.length) continue;

    
    const makeTrack = async (track) => {
      return new Song(
        new SearchResultVideo({
          duration: track.duration,
          formattedDuration: track.formattedDuration,
          id: track.id,
          isLive: track.isLive,
          name: track.name,
          thumbnail: track.thumbnail,
          type: "video",
          uploader: track.uploader,
          url: track.url,
          views: track.views,
        }),
        guild.members.cache.get(track.memberId) || guild.members.me,
        track.source
      );
    };

    try {
      
      await client.distube.play(voiceChannel, tracks[0].url, {
        member: guild.members.cache.get(tracks[0].memberId) || guild.members.me,
        textChannel: textChannel,
      });

      const newQueue = client.distube.getQueue(guild.id);
      if (newQueue) {
        
        for (const track of tracks.slice(1)) {
          newQueue.songs.push(await makeTrack(track));
        }

        
        await newQueue.setVolume(data.volume);
        
        if (data.repeatMode && data.repeatMode !== 0) {
          newQueue.setRepeatMode(data.repeatMode);
        }

        if (!data.playing) {
          newQueue.pause();
        }

        
        await newQueue.seek(data.currentTime);
      }

      
      await client.autoresume.delete(gId);
    } catch (error) {
      console.error(` [Fox Music] :: ${guild.name} sunucusunda resume hatası:`, error);
      await client.autoresume.delete(gId);
    }
  }
};
