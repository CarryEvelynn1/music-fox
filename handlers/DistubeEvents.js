const { EmbedBuilder, Events } = require("discord.js");
const FoxMusic = require("./Client");
const AutoresumeHandler = require("./AutoresumeHandler");
const InitAutoResume = require("./InitAutoResume");

/**
 * @param {FoxMusic} client
 */
module.exports = async (client) => {
  
  client.on(Events.ClientReady, async () => {
    setTimeout(async () => await AutoresumeHandler(client), 2 * client.ws.ping);
  });

  
  client.distube.on("playSong", async (queue, song) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      await client.updateplayer(queue);
      if (data.channel === queue.textChannel.id) return;
    }

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({ name: "Şu An Çalıyor", iconURL: client.user.displayAvatarURL() })            
            .setImage("Gif")
            .setDescription(`** [\`${client.getTitle(song)}\`](${song.url}) **`)
            .addFields([
              {
                name: `İsteyen`,
                value: `\`${song.user.tag}\``,
                inline: true,
              },
              {
                name: `Sanatçı`,
                value: `\`${song.uploader.name}\``,
                inline: true,
              },
              {
                name: `Süre`,
                value: `\`${song.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(song.user)),
        ],
        components: client.buttons(false, queue),
      })
      .then((msg) => {
        client.temp.set(queue.textChannel.guildId, msg.id);
      });
  });

  
  client.distube.on("addSong", async (queue, song) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      await client.updateplayer(queue);
      if (data.channel === queue.textChannel.id) return;
    }
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: `Kuyruğa Eklendi`,
              iconURL: song.user.displayAvatarURL({ dynamic: true }),
              url: song.url,
            })
            .setThumbnail(song.thumbnail) 
            .setDescription(`[\`${client.getTitle(song)}\`](${song.url})`)
            .addFields([
              {
                name: `İsteyen`,
                value: `\`${song.user.tag}\``,
                inline: true,
              },
              {
                name: `Sanatçı`,
                value: `\`${song.uploader.name}\``,
                inline: true,
              },
              {
                name: `Süre`,
                value: `\`${song.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(song.user)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });


  client.distube.on("addList", async (queue, playlist) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      await client.updateplayer(queue);
      if (data.channel === queue.textChannel.id) return;
    }

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: `Oynatma Listesi Kuyruğa Eklendi`,
              iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
              url: playlist.url,
            })
            .setThumbnail(playlist.thumbnail)
            .setDescription(`** [\`${playlist.name}\`](${playlist.url}) **`)
            .addFields([
              {
                name: `İsteyen`,
                value: `\`${playlist.user.tag}\``,
                inline: true,
              },
              {
                name: `Şarkı Sayısı`,
                value: `\`${playlist.songs.length}\``,
                inline: true,
              },
              {
                name: `Toplam Süre`,
                value: `\`${playlist.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(playlist.user)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  
  client.distube.on("disconnect", async (queue) => {
    try {
      const guildId = queue.textChannel.guildId;

      
      await client.autoresume.delete(guildId);

      
      await client.editPlayerMessage(queue.textChannel);

      
      await client.updateembed(client, queue.textChannel.guild);

      
      const db = await client.music?.get(`${guildId}.vc`);
      const data = await client.music.get(`${guildId}.music`);

      if (!db?.enable && data && data.channel !== queue.textChannel.id) {
        
        const embed = new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setDescription(
            `> **Fox Music** ses kanalından ayrıldı.`
          );

        const msg = await queue.textChannel.send({ embeds: [embed] });
        setTimeout(() => msg.delete().catch(() => {}), 3000);
      } else if (db?.enable) {
        
        await client.joinVoiceChannel(queue.textChannel.guild);
      }
    } catch (error) {
      console.error("Disconnect olayında hata:", error);
    }
  });

  
  client.distube.on("error", async (error, queue, song) => {
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(`Bir Hata İle Karşılaşıldı...`)
            .setDescription(String(error).substring(0, 3000)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  
  client.distube.on("noRelated", async (queue) => {
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(`\`${queue?.songs[0].name}\` için benzer şarkı bulunamadı`),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  
  client.distube.on("finishSong", async (queue, song) => {
    await client.editPlayerMessage(queue.textChannel);
    await client.updatequeue(queue);
    await client.updateplayer(queue);
  });

  
  client.distube.on("finish", async (queue) => {
    await client.updateembed(client, queue.textChannel.guild);
    await client.editPlayerMessage(queue.textChannel);
    
    await client.autoresume.delete(queue.textChannel.guild.id);

    
    try {
      const db = await client.music?.get(`${queue.textChannel.guild.id}.vc`);
      if (!db?.enable) {
        await client.distube.voices.leave(queue.textChannel.guild);
      }
    } catch (e) {
      
    }

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`Kuyruk sona erdi! Çalacak başka şarkı kalmadı.`),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  
  client.distube.on("initQueue", async (queue) => {
    queue.volume = client.config.options.defaultVolume;

    
    await InitAutoResume(client, queue);
  });


  client.distube.on("searchCancel", async (message, quary) => {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`Arama iptal edildi: \`${quary}\``),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  
  client.distube.on("searchNoResult", async (message, quary) => {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(
              `${client.config.emoji.ERROR} \`${quary}\` için hiçbir sonuç bulunamadı!`
            ),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });
};
