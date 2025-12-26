const { EmbedBuilder, Events, ChannelType } = require("discord.js");
const FoxMusic = require("./Client");
const Store = require("./PlaylistStore");
const { check_dj, skip } = require("./functions");

/**
 *
 * @param {FoxMusic} client
 */
module.exports = async (client) => {
  
  try {
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = client.distube.getQueue(interaction.guildId);
        let checkDJ = await check_dj(
          client,
          interaction.member,
          queue?.songs[0]
        );

        const refresh = (q, ms = 0) => {
          try {
            setTimeout(() => {
              client.updateplayer(q).catch(() => {});
            }, ms);
          } catch {}
        };

        switch (customId) {
          case "previous":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`);
              try {
                await queue.previous();
                refresh(queue, 300);
                return send(interaction, `${client.config.emoji.SUCCESS} Önceki şarkıya dönüldü.`);
              } catch (e) {
                return send(interaction, `${client.config.emoji.ERROR} Önceki bir şarkı yok!`);
              }
            }
            break;
          case "rewind10":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`);
              const pos = Math.max(0, (queue.currentTime || 0) - 10);
              try {
                await queue.seek(pos);
                refresh(queue, 200);
                return send(interaction, `${client.config.emoji.SUCCESS} 10 saniye geri sarıldı.`);
              } catch {}
            }
            break;
          case "forward10":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`);
              const duration = queue.songs[0]?.duration || 0;
              const pos = Math.min(duration - 1, (queue.currentTime || 0) + 10);
              try {
                await queue.seek(pos);
                refresh(queue, 200);
                return send(interaction, `${client.config.emoji.SUCCESS} 10 saniye ileri sarıldı.`);
              } catch {}
            }
            break;
          case "shuffle":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`);
              try {
                await queue.shuffle();
                refresh(queue, 0);
                return send(interaction, `${client.config.emoji.SUCCESS} Kuyruk karıştırıldı!`);
              } catch {}
            }
            break;
          case "autoplay":
            {
              if (!channel) {
                return send(
                  interaction,
                  `** ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!**`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`
                );
              } else if (!queue.autoplay) {
                queue.toggleAutoplay();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Otomatik Oynatma Açıldı! `
                );
              } else {
                queue.toggleAutoplay();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Otomatik Oynatma Kapatıldı. `
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`
                );
              } else {
                await skip(queue);
                refresh(queue, 300);
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Şarkı Atlandı!`
                );
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`
                );
              } else {
                await queue.stop().catch((e) => {});
                try {
                  const db = await client.music?.get(`${interaction.guildId}.vc`);
                  if (!db?.enable) await client.distube.voices.leave(interaction.guild);
                  
                  try {
                    await client.updateembed(client, interaction.guild);
                    await client.editPlayerMessage(queue.textChannel);
                  } catch {}
                } catch {}
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Şarkı durduruldu ve kanaldan ayrıldım!`
                );
              }
            }
            break;
          case "pauseresume":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin! `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Şu an bir şey çalmıyorum. `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`
                );
              } else if (queue.paused) {
                await queue.resume();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Şarkı Devam Ediyor! `
                );
              } else if (!queue.paused) {
                await queue.pause();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Şarkı Duraklatıldı! `
                );
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin!`
                );
              } else if (!queue) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Şu an bir şey çalmıyorum`
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} DJ değilsin ve şarkıyı sen istemedin..`
                );
              } else {
                switch (queue.repeatMode) {
                  case 0: 
                    await queue.setRepeatMode(1);
                    refresh(queue, 0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Şarkı Döngüsü Açıldı !!`
                    );
                  case 1: 
                    await queue.setRepeatMode(2);
                    refresh(queue, 0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Kuyruk Döngüsü Açıldı !!`
                    );
                  case 2: 
                    await queue.setRepeatMode(0);
                    refresh(queue, 0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Döngü Kapatıldı !!`
                    );
                  default:
                    return send(
                      interaction,
                      `${client.config.emoji.ERROR} Bilinmeyen döngü modu`
                    );
                }
              }
            }
            break;

          case "savecurrent_btn":
            {
              
              if (!channel) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Bir ses kanalına katılmalısın!`
                );
              }
              if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Benim olduğum ses kanalına gelmelisin!`
                );
              }
              if (!queue || !queue.songs?.length) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Şu an bir şey çalmıyorum!`
                );
              }

              
              const baseMsgId = client.temp.get(interaction.guildId);
              const baseMsg = baseMsgId
                ? await interaction.channel.messages.fetch(baseMsgId).catch(() => null)
                : null;
              const threadName = `kaydet ▶ ${interaction.user.username}`.substring(0, 90);
              const starter = baseMsg || (await interaction.message?.fetch().catch(() => null)) || null;
              let thread;
              try {
                thread = await interaction.channel.threads.create({
                  name: threadName,
                  autoArchiveDuration: 60,
                  type: ChannelType.PrivateThread,
                  reason: `${interaction.user.tag} için şarkı kaydetme isteği`,
                });
              } catch (e) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Bu kanalda alt başlık (thread) açma yetkim yok.`
                );
              }
              
              try { await thread.members.add(interaction.user.id).catch(() => {}); } catch {}
              await thread.send({
                content: `${interaction.user}, "${client.getTitle(queue.songs[0])}" şarkısını kaydetmek için lütfen bir çalma listesi adı yaz (60sn süren var).`,
              });

              const collector = thread.createMessageCollector({
                time: 60_000,
                max: 1,
                filter: (m) => m.author.id === interaction.user.id,
              });

              collector.on("collect", async (m) => {
                const name = m.content.trim().slice(0, 64);
                const track = Store.serializeSong(queue.songs[0], interaction.user);
                await Store.create(client, interaction.guildId, interaction.user.id, name);
                await Store.addTracks(client, interaction.guildId, interaction.user.id, name, [track]);
                await thread.send(`${client.config.emoji.SUCCESS} Başarıyla \`${name}\` listesine kaydedildi. Bu mesaj birazdan silinecek.`);
              });

              collector.on("end", async () => {
                setTimeout(() => thread.setArchived(true, "Kaydetme işlemi bitti").catch(() => {}), 5000);
              });
            }
            break;

          default:
            break;
        }
      }
    });

    async function send(interaction, string) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(`> ${string.substring(0, 3000)}`)
              .setFooter(client.getFooter(interaction.user)),
          ],
          ephemeral: true,
        })
        .catch((e) => null);
    }
  } catch (e) {
    console.log(e);
  }
};
