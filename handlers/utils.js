const FoxMusic = require("./Client");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  CommandInteraction,
  ChannelType,
  Guild,
} = require("discord.js");
const { Queue, Song } = require("distube");

/**
 *
 * @param {FoxMusic} client
 */
module.exports = async (client) => {
  
  /**
   *
   * @param {Queue} queue
   */
  client.buttons = (state, queue) => {
    const track = queue?.songs?.[0];
    const isLive = !!track?.isLive;
    const duration = Number(track?.duration || 0);
    const pos = Number(queue?.currentTime || 0);
    const nearStart = pos <= 1;
    const nearEnd = duration ? pos >= Math.max(0, duration - 1) : false;
    const hasNext = (queue?.songs?.length || 0) > 1;
    const hasPrev = (queue?.previousSongs?.length || 0) > 0;
    const canSeek = !isLive && duration > 0;

    
    const loopMode = Number(queue?.repeatMode || 0); 
    const loopActive = loopMode === 1 || loopMode === 2;
    const loopEmoji = loopMode === 1 ? "🔂" : loopMode === 2 ? "🔁" : client.config.emoji.loop;
    const loopStyle = loopActive ? ButtonStyle.Success : ButtonStyle.Secondary;
    const loopLabel = loopMode === 1 ? "Tekli Döngü" : loopMode === 2 ? "Kuyruk Döngü" : "Döngü";

    
    const autoplayOn = !!queue?.autoplay;
    const autoplayStyle = autoplayOn ? ButtonStyle.Success : ButtonStyle.Secondary;

    
    const isPaused = !!queue?.paused;
    const prEmoji = isPaused ? "▶️" : "⏸️";
    const prLabel = isPaused ? "Oynat" : "Duraklat";

    const dis = (d) => (state ? true : d);

    
    const row1 = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("previous")
        .setEmoji(client.config.emoji.previous_song)
        .setLabel("Geri")
        .setDisabled(dis(!hasPrev)),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("rewind10")
        .setEmoji("⏪")
        .setLabel("-10sn")
        .setDisabled(dis(!canSeek)),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("pauseresume")
        .setEmoji(prEmoji)
        .setLabel(prLabel)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("forward10")
        .setEmoji("⏩")
        .setLabel("+10sn")
        .setDisabled(dis(!canSeek || nearEnd)),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("skip")
        .setEmoji(client.config.emoji.next_song)
        .setLabel("Atla")
        .setDisabled(dis(!hasNext)),
    ]);

    
    const row2 = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("stop")
        .setEmoji(client.config.emoji.stop)
        .setLabel("Durdur")
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("shuffle")
        .setEmoji(client.config.emoji.shuffle)
        .setLabel("Karıştır")
        .setDisabled(dis((queue?.songs?.length || 0) <= 2)),
      new ButtonBuilder()
        .setStyle(loopStyle)
        .setCustomId("loop")
        .setEmoji(loopEmoji)
        .setLabel(loopLabel)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(autoplayStyle)
        .setCustomId("autoplay")
        .setEmoji(client.config.emoji.autoplay)
        .setLabel("Oto-Akış")
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("savecurrent_btn")
        .setEmoji("⭐")
        .setLabel("Kaydet")
        .setDisabled(dis(!track)),
    ]);

    return [row1, row2];
  };

  client.editPlayerMessage = async (channel) => {
    const ID = client.temp.get(channel.guild.id);
    if (!ID) return;

    let playembed =
      channel.messages.cache.get(ID) ||
      (await channel.messages.fetch(ID).catch(console.error));
    if (!playembed) return;

    if (client.config.options.nowplayingMsg) {
      playembed.delete().catch(() => {});
    } else {
      const embeds = playembed?.embeds?.[0];
      if (embeds) {
        playembed
          .edit({
            embeds: [
              new EmbedBuilder(embeds.data).setFooter({
                text: `By Fox Logic: Outsmart Everyone.`,
                iconURL: channel.guild.iconURL({ dynamic: true }),
              }),
            ],
            components: client.buttons(true, null),
          })
          .catch(console.error);
      }
    }
  };

  client.getQueueEmbeds = async (queue) => {
    const guild = client.guilds.cache.get(queue.textChannel.guildId);
    const maxTracks = 10; 
    const tracks = queue.songs.slice(1); 

    const quelist = [];
    for (let i = 0; i < tracks.length; i += maxTracks) {
      const songs = tracks.slice(i, i + maxTracks);
      quelist.push(
        songs
          .map(
            (track, index) =>
              `\` ${i + index + 1}. \` ** ${client.getTitle(track)}** - \`${
                track.isLive
                  ? `CANLI YAYIN`
                  : track.formattedDuration.split(` | `)[0]
              }\` \`${track.user.tag}\``
          )
          .join(`\n`)
      );
    }

    const embeds = [];
    for (let i = 0; i < quelist.length; i++) {
      const desc = String(quelist[i]).substring(0, 2048);
      embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} Kuyruğu - [ ${tracks.length} Parça ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setColor(client.config.embed.color)
          .setDescription(desc)
          .setFooter({ text: "By Fox Logic: Outsmart Everyone." })
      );
    }
    return embeds;
  };

  client.status = (queue) =>
    `Ses: %${queue.volume} • Durum: ${
      queue.paused ? "Duraklatıldı" : "Oynatılıyor"
    } • Döngü: ${
      queue.repeatMode === 2 ? `Kuyruk` : queue.repeatMode === 1 ? `Şarkı` : `Kapalı`
    } • Oto-Akış: ${queue.autoplay ? `Açık` : `Kapalı`} `;

  client.queueembed = (guild) => {
    return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({ name: `Fox Music | Müzik Kuyruğu` })
      .setDescription("Şu anda kuyruk boş.")
      .setFooter({ text: "By Fox Logic: Outsmart Everyone." });
  };

  client.playembed = (guild) => {
    return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: "Müzik Çalmak İçin Bir Kanala Katılın ve Şarkı Girin",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `[Beni Davet Et](${client.config.links.inviteURL}) • [Destek Sunucusu](${client.config.links.DiscordServer})`
      )
      .setImage(
        guild.banner
          ? guild.bannerURL({ size: 4096 })
          : "http://cdn.wallpaperinhd.net/wp-content/uploads/2018/11/02/Music-Background-Wallpaper-025.jpg"
      )
      .setFooter({
        text: "By Fox Logic: Outsmart Everyone.",
        iconURL: guild.iconURL(),
      });
  };

  client.updateembed = async (client, guild) => {
    try {
      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;
      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      const [playmsg, queuemsg] = await Promise.all([
        musicchannel.messages.fetch(data.pmsg).catch(() => {}),
        musicchannel.messages.fetch(data.qmsg).catch(() => {}),
      ]);

      if (!playmsg || !queuemsg) return;

      await Promise.all([
        playmsg.edit({
          embeds: [client.playembed(guild)],
          components: client.buttons(true),
        }),
        queuemsg.edit({ embeds: [client.queueembed(guild)] }),
      ]);
    } catch (error) {
      console.error("Embed güncellenirken hata:", error);
    }
  };

  client.updatequeue = async (queue) => {
    try {
      const guild = client.guilds.cache.get(queue.textChannel.guildId);
      if (!guild) return;
      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;
      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      let queueembed = await musicchannel.messages.fetch(data.qmsg).catch(() => {});
      if (!queueembed) return;

      const currentSong = queue.songs[0];
      let queueString = "";
      for (let index = 1; index < Math.min(queue.songs.length, 10); index++) {
        const track = queue.songs[index];
        queueString += `\`${index}.\` **${client.getTitle(track)}** - ${
          track.isLive ? "CANLI YAYIN" : track.formattedDuration.split(" | ")[0]
        } - \`${track.user.tag}\`\n`;
      }

      const newQueueEmbed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({
          name: `Fox Kuyruk - [${queue.songs.length} Parça]`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .addFields([
          {
            name: `**\`0.\` __ŞU AN ÇALAN__**`,
            value: `**${client.getTitle(currentSong)}** - ${
              currentSong?.isLive
                ? "CANLI YAYIN"
                : currentSong?.formattedDuration.split(" | ")[0]
            } - \`${currentSong?.user.tag}\``,
          },
        ])
        .setFooter({ text: "By Fox Logic: Outsmart Everyone." });

      if (queueString.length > 0) {
        newQueueEmbed.setDescription(queueString.substring(0, 2048));
      }
      await queueembed.edit({ embeds: [newQueueEmbed] });
    } catch (error) {
      console.error("Kuyruk güncellenirken hata:", error);
    }
  };

  client.updateplayer = async (queue) => {
    try {
      const guild = client.guilds.cache.get(queue.textChannel.guildId);
      if (!guild) return;
      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;
      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      let playembed = await musicchannel.messages.fetch(data.pmsg).catch(() => {});
      if (!playembed) return;

      const freshQueue = client.distube.getQueue(guild.id) || queue;
      const track = freshQueue.songs[0];
      if (!track || !track.name) return;

      const newEmbed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setImage(track?.thumbnail)
        .setTitle(client.getTitle(track))
        .setURL(track?.url)
        .addFields(
          { name: "**İsteyen**", value: `\`${track.user.tag}\``, inline: true },
          { name: "**Sanatçı**", value: `\`${track.uploader.name || "😏"}\``, inline: true },
          { name: "**Süre**", value: `\`${track.formattedDuration}\``, inline: true }
        )
        .setFooter({ text: "By Fox Logic: Outsmart Everyone.", iconURL: track.user.displayAvatarURL() });

      await playembed.edit({
        embeds: [newEmbed],
        components: client.buttons(false, freshQueue),
      });
    } catch (error) {
      console.error("Oynatıcı güncellenirken hata:", error);
    }
  };

  client.joinVoiceChannel = async (guild) => {
    try {
      const db = await client.music?.get(`${guild.id}.vc`);
      if (!db || !db.enable) return;
      if (!guild.members.me.permissions.has(PermissionFlagsBits.Connect)) return;

      const voiceChannel = guild.channels.cache.get(db.channel);
      if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) return;
      await client.distube.voices.join(voiceChannel);
    } catch (error) {
      console.error("Ses kanalına katılırken hata:", error);
    }
  };

  client.handleHelpSystem = async (interaction) => {
    const send = interaction?.deferred ? interaction.followUp.bind(interaction) : interaction.reply.bind(interaction);
    const user = interaction.member.user;
    const commands = interaction?.user ? client.commands : client.mcommands;
    const categories = interaction?.user ? client.scategories : client.mcategories;

    const emoji = { Information: "🔰", Music: "🎵", Settings: "⚙️", Playlist: "📂" };
    const botuptime = `<t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`;

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId("home").setStyle(ButtonStyle.Success).setEmoji("🏘️").setLabel("Giriş"),
      ...categories.map((cat) => {
        const btn = new ButtonBuilder().setCustomId(cat).setStyle(ButtonStyle.Secondary).setLabel(cat === "Information" ? "Bilgi" : cat === "Settings" ? "Ayarlar" : cat);
        const em = emoji[cat];
        if (em) btn.setEmoji(em);
        return btn;
      }),
    ]);

    const help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`**Ses Filtreleme ve benzersiz Müzik İstek Sistemi ile gelişmiş bir müzik deneyimi!**`)
      .addFields([{ name: `İstatistikler`, value: `>>> **⚙️ \`${client.mcommands.size}\` Komut\n📂 \`${client.guilds.cache.size}\` Sunucu\n⌚️ ${botuptime} Çalışma Süresi\n🏓 \`${client.ws.ping}\` Gecikme**` }])
      .setFooter({ text: "By Fox Logic: Outsmart Everyone." });

    const main_msg = await send({ embeds: [help_embed], components: [row], ephemeral: true });

    const filter = async (i) => {
      if (i.user.id === user.id) return true;
      else {
        await i.deferReply().catch(() => {});
        i.followUp({ content: `Bu senin etkileşimin değil!`, ephemeral: true }).catch(() => {});
        return false;
      }
    };

    const colector = main_msg.createMessageComponentCollector({ filter });

    colector.on("collect", async (i) => {
      if (i.isButton()) {
        await i.deferUpdate().catch(() => {});
        if (i.customId == "home") main_msg.edit({ embeds: [help_embed] }).catch(() => {});
        else {
          main_msg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.embed.color)
                .setTitle(`${emoji[i.customId] || "📁"} ${i.customId} Komutları`)
                .setDescription(`>>> ${commands.filter((cmd) => cmd.category === i.customId).map((cmd) => `\`${cmd.name}\``).join(",  ")}`)
                .setFooter({ text: "By Fox Logic: Outsmart Everyone." }),
            ],
          }).catch(() => {});
        }
      }
    });

    colector.on("end", async () => {
      row.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [row] }).catch(() => {});
    });
  };

  client.HelpCommand = async (interaction) => {
    const send = interaction?.deferred ? interaction.followUp.bind(interaction) : interaction.reply.bind(interaction);
    const user = interaction.member.user;
    const commands = interaction?.user ? client.commands : client.mcommands;
    const categories = interaction?.user ? client.scategories : client.mcategories;

    const emoji = { Information: "🔰", Music: "🎵", Settings: "⚙️", Playlist: "📂" };

    let allCommands = categories.map((cat) => {
      let cmds = commands.filter((cmd) => cmd.category == cat).map((cmd) => `\`${cmd.name}\``).join(" ' ");
      return { name: `${emoji[cat]} ${cat}`, value: cmds };
    });

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({ name: `Komutlarım`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .addFields(allCommands)
      .setFooter({ text: "By Fox Logic: Outsmart Everyone." });

    send({ embeds: [help_embed] });
  };

  client.getTitle = (song) => {
    try {
      if (!song) return "Bilinmeyen Parça";
      const TrackTitle = song.name || song.playlist?.name || "Bilinmeyen Parça";
      const title = TrackTitle.replace(/[\[\(][^\]\)]*[\]\)]/g, "").trim();
      return title.split("|")[0].trim().substring(0, 25);
    } catch (error) {
      console.error("Başlık işlenirken hata:", error);
      return "Bilinmeyen Parça";
    }
  };
};
