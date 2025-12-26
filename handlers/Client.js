const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  User,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const Distube = require("distube").default;
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { filters, options } = require("../settings/config");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { YouTubePlugin } = require("@distube/youtube");

class FoxMusic extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    this.events = new Collection();
    this.cooldowns = new Collection();
    this.mcommands = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.shuffleData = new Collection();
    this.leaveTimeoutHandles = new Collection();
    this.mcategories = fs.readdirSync("./Commands/Message");
    this.scategories = fs.readdirSync("./Commands/Slash");
    this.temp = new Collection();
    this.config = require("../settings/config");
    this.distube = new Distube(this, {
      emitNewSongOnly: true, 
      nsfw: false, 
      savePreviousSongs: true, 
      joinNewVoiceChannel: false, 
      
      customFilters: filters, 
      
      plugins: [
        new YouTubePlugin(),
        
        new SpotifyPlugin(),
        new SoundCloudPlugin(), 
        
        new YtDlpPlugin({
          update: false, 
          requestOptions: {
            
            maxRedirects: 5, 
            timeout: 10000, 
            headers: process.env.YOUTUBE_COOKIE
              ? { Cookie: process.env.YOUTUBE_COOKIE }
              : undefined,
          },
        }),
      ],
      ffmpeg: {
        path: (() => {
          if (process.env.FFMPEG_PATH && process.env.FFMPEG_PATH.trim()) {
            return process.env.FFMPEG_PATH;
          }
          try {
            return require("ffmpeg-static");
          } catch (_) {
            try {
              const inst = require("@ffmpeg-installer/ffmpeg");
              return inst && inst.path ? inst.path : undefined;
            } catch (_) {
              return undefined;
            }
          }
        })(),
      },
    });
  }

  start(token) {
    [
      "handler",
      "DistubeEvents",
      "RequestChannel",
      "DistubeHandler",
      "utils",
    ].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }
  /**
   *
   * @param {User} user
   * @returns
   */
  getFooter(user) {
    const obj = {
      text: `Requested By ${user.username}`,
      iconURL: user.displayAvatarURL(),
    };

    return options.embedFooter ? obj : null;
  }

  embed(interaction, data) {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    }
  }
}

module.exports = FoxMusic;
