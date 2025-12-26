const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ta",
  aliases: ["move", "mv"],
  description: `Sradaki bir arknn yerini deitirir.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let songIndex = Number(args[0]);
    let position = Number(args[1]);

    if (!songIndex || !position) {
      return client.embed(
        message,
        ` **Yanl Kullanm!**\nDoru format: \`${prefix}ta <ark_no> <hedef_no>\``
      );
    }

    if (position >= queue.songs.length || position < 0) position = -1;

    if (songIndex > queue.songs.length - 1) {
      return client.embed(
        message,
        ` **Sradaki son arknn numaras: \`${queue.songs.length - 1}\`**`
      );
    } else if (position === 0) {
      return client.embed(message, ` **u an çalan arknn yerini deitiremezsin!**`);
    } else {
      let song = queue.songs[songIndex];
      
      queue.songs.splice(songIndex, 1);
      queue.addToQueue(song, position);

      client.embed(
        message,
        ` **${client.getTitle(song)}** adl ark, **${position}.** sraya tand!\n\nBy Fox Logic: Outsmart Everyone.`
      );
    }
  },
};
