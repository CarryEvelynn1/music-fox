const {
  Interaction,
  Collection,
  Client,
  GuildMember,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = require("../index");
const { Song, Queue } = require("distube");
const FoxMusic = require("./Client");

/**
 *
 * @param {Interaction} interaction
 * @param {String} cmd
 */
function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; 
      
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  }
}

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 * @param {Song} song
 * @returns
 */
async function check_dj(client, member, song = null) {
  
  if (!client) return false;
 
  let roleid = await client.music.get(`${member.guild.id}.djrole`);
  
  let isdj = false;
  if (!roleid) return false;
  
  if (!member.guild.roles.cache.get(roleid)) {
    await client.music.set(`${member.guild.id}.djrole`, null);
    return;
  }
  
  if (member.roles.cache.has(roleid)) isdj = true;
 
  if (
    !isdj &&
    !member.permissions.has(PermissionFlagsBits.Administrator) &&
    song?.user.id !== member.id
  ) {
    return true;
  } else {
    return false;
  }
}

async function databasing(guildID, userID) {
  await client.music.ensure(guildID, {
    prefix: client.config.PREFIX,
  hqmode: false,
    djrole: null,
    vc: {
      enable: false,
      channel: null,
    },
    music: {
      channel: null,
      pmsg: null,
      qmsg: null,
    },
    autoresume: false,
  });
  await client.autoresume.ensure(guildID, {
    guild: guildID,
    voiceChannel: null,
    textChannel: null,
    songs: [],
    volume: client.config.options.defaultVolume,
    repeatMode: 0,
    playing: null,
    currentTime: null,
    autoplay: null,
  });
}

async function swap_pages(interaction, embeds) {
  let currentPage = 0;
  let allbuttons = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("0")
      .setLabel("⏪ İlk"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("1")
      .setLabel("◀️"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId("2")
      .setLabel("🗑️"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("3")
      .setLabel("▶️"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("4")
      .setLabel("Son ⏩"),
  ]);
  if (embeds.length === 1) {
    if (interaction.deferred) {
      return interaction.followUp({
        embeds: [embeds[0]],
        fetchReply: true,
      });
    } else {
      return interaction.reply({
        embeds: [embeds[0]],
        fetchReply: true,
      });
    }
  }
  
  embeds = embeds.map((embed, index) => {
    return embed.setColor(client.config.embed.color).setFooter({
      text: `Sayfa ${index + 1} / ${embeds.length} | Fox Music`,
      iconURL: interaction.guild.iconURL({ dynamic: true }),
    });
  });
  let swapmsg;
  if (interaction.deferred) {
    swapmsg = await interaction.followUp({
      embeds: [embeds[0]],
      components: [allbuttons],
    });
  } else {
    swapmsg = await interaction.reply({
      embeds: [embeds[0]],
      components: [allbuttons],
    });
  }
  
  const collector = swapmsg.createMessageComponentCollector({
    time: 2000 * 60,
  });
  collector.on("collect", async (b) => {
    if (b.isButton()) {
      await b.deferUpdate().catch((e) => {});
      
      if (b.customId == "0") {
        if (currentPage !== 0) {
          currentPage = 0;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      
      if (b.customId == "1") {
        if (currentPage !== 0) {
          currentPage -= 1;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } else {
          currentPage = embeds.length - 1;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      
      else if (b.customId == "2") {
        try {
          allbuttons.components.forEach((btn) => btn.setDisabled(true));
          swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } catch (e) {}
      }
      
      else if (b.customId == "3") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        } else {
          currentPage = 0;
          await swapmsg
            .edit({
              embeds: [embeds[currentPage]],
              components: [allbuttons],
            })
            .catch((e) => null);
        }
      }
      
      if (b.customId == "4") {
        currentPage = embeds.length - 1;
        await swapmsg
          .edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          })
          .catch((e) => null);
      }
    }
  });

  collector.on("end", () => {
    allbuttons.components.forEach((btn) => btn.setDisabled(true));
    swapmsg.edit({ components: [allbuttons] }).catch((e) => null);
  });
}

function shuffle(array) {
  try {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function createBar(total, current, size = 25, line = "▬", slider = "🦊") {
  try {
    if (!total) throw "SÜRE BİLGİSİ EKSİK";
    if (!current) return `**[${slider}${line.repeat(size - 1)}]**`;
    let bar =
      current > total
        ? [line.repeat((size / 2) * 2), (current / total) * 100]
        : [
            line
              .repeat(Math.round((size / 2) * (current / total)))
              .replace(/.$/, slider) +
              line.repeat(size - Math.round(size * (current / total)) + 1),
            current / total,
          ];
    if (!String(bar).includes(slider)) {
      return `**[${slider}${line.repeat(size - 1)}]**`;
    } else {
      return `**[${bar[0]}]**`;
    }
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function msToDuration(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  days %= 24;
  months %= 12;

  
  years = years ? `${years} Yıl ` : "";
  months = months ? `${months} Ay ` : "";
  days = days ? `${days} Gün ` : "";
  hours = hours ? `${hours} Saat ` : "";
  minutes = minutes ? `${minutes} Dakika ` : "";
  seconds = seconds ? `${seconds} Saniye ` : "";

  return years + months + days + hours + minutes + seconds;
}

/**
 *
 * @param {Queue} queue
 */
async function skip(queue) {
  if (queue.songs.length <= 1) {
    if (!queue.autoplay) {
      await queue.stop().catch((e) => null);
    } else {
      await queue.skip().catch((e) => null);
    }
  } else {
    await queue.skip().catch((e) => null);
  }
}

function formatBytes(x) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

function getPermissionName(permissionValue) {
  const permissionList = Object.entries(PermissionFlagsBits);
  for (const [permissionName, permissionBit] of permissionList) {
    if (permissionValue === permissionBit) {
      return permissionName;
    }
  }
  return null; 
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 *
 * @param {FoxMusic} client
 */
async function registerSlashCommands(client) {
  const { slash } = client.config;
  const commands = client.commands.map((cmd) => {
    return {
      name: cmd.name,
      description: cmd.description,
      options: cmd.options,
      type: cmd.type,
    };
  });

  try {
    if (slash.global) {
      console.log("Global Slash Komutları yükleniyor...");
      await client.application.commands.set(commands);
      console.log("Global Slash Komutları başarıyla yüklendi.");
    } else {
      console.log("Sunucuya özel Slash Komutları yükleniyor...");
      for (const guildID of slash.guildIDS) {
        const guild = await client.guilds.fetch(guildID);
        if (!guild) {
          console.error(`ID'si ${guildID} olan sunucu bulunamadı.`);
          continue;
        }
        await guild.commands.set(commands);
      }
      console.log("Sunucuya özel Slash Komutları başarıyla yüklendi.");
    }
  } catch (error) {
    console.error("Slash komutlarını kaydederken hata oluştu:", error);
  }
}

module.exports = {
  cooldown,
  check_dj,
  databasing,
  swap_pages,
  shuffle,
  createBar,
  msToDuration,
  skip,
  formatBytes,
  getPermissionName,
  arraysEqual,
  registerSlashCommands,
};
