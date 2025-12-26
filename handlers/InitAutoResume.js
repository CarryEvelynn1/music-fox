const { Queue } = require("distube");
const FoxMusic = require("./Client");
const { arraysEqual } = require("./functions");

/**
 * Orijinal parça objesinden basitleştirilmiş bir parça objesi oluşturur.
 * @param {Object} track - Orijinal şarkı objesi.
 * @returns {Object} Sadeleştirilmiş şarkı objesi.
 */
const buildTrack = (track) => ({
  memberId: track.member?.id || null,
  source: track.source,
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
});

/**
 * Otomatik devam etme (autoresume) için kuyruk durumunu periyodik olarak kaydeder.
 * @param {FoxMusic} client - Client örneği.
 * @param {Queue} queue - Kuyruk örneği.
 */
module.exports = async (client, queue) => {
  /**
   * Verileri her 10 saniyede bir kontrol eden ve güncelleyen döngü.
   */
  setInterval(async () => {
    try {
      
      const newQueue = client.distube.getQueue(queue.textChannel.guild);
      
      const autoresumeEnabled = await client.music.get(
        `${queue.textChannel.guildId}.autoresume`
      );

      
      if (!newQueue || !autoresumeEnabled) return;

      
      const autoresumeData = {
        guild: newQueue.textChannel.guildId || null,
        voiceChannel: newQueue.voiceChannel?.id || null,
        textChannel: newQueue.textChannel?.id || null,
        songs: newQueue.songs.length > 0 ? newQueue.songs.map(buildTrack) : [],
        volume: newQueue.volume || 100,
        repeatMode: newQueue.repeatMode || 0,
        playing: newQueue.playing || false,
        currentTime: newQueue.currentTime || 0,
        autoplay: newQueue.autoplay || false,
      };

      
      await client.autoresume.ensure(queue.textChannel.guildId, autoresumeData);

      
      const storedData = await client.autoresume.get(
        newQueue.textChannel.guildId
      );

      if (!storedData) return;

      
      const propertiesToUpdate = [
        "guild",
        "voiceChannel",
        "textChannel",
        "volume",
        "repeatMode",
        "playing",
        "currentTime",
        "autoplay",
      ];

      
      propertiesToUpdate.forEach((property) => {
        if (storedData[property] !== autoresumeData[property]) {
          client.autoresume.set(
            `${newQueue.textChannel.guildId}.${property}`,
            autoresumeData[property]
          );
        }
      });

      
      if (!arraysEqual(storedData.songs, autoresumeData.songs)) {
        await client.autoresume.set(
          `${newQueue.textChannel.guildId}.songs`,
          autoresumeData.songs
        );
      }
    } catch (e) {
      
      
    }
  }, 10000); 
};
