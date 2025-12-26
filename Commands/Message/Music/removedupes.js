const { Message, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "tekrarlarsil",
  aliases: ["rmdupes", "rmd", "removedupes", "temizle"],
  description: `Listedeki mükerrer (ayn) arklar temizler.`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  run: async (client, message, args, prefix, queue) => {
    let tracks = queue.songs;
    const newtracks = [];
    
    for (let i = 0; i < tracks.length; i++) {
      let exists = false;
      for (let j = 0; j < newtracks.length; j++) {
        if (tracks[i].url === newtracks[j].url) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        newtracks.push(tracks[i]);
      }
    }

    queue.remove();
    
    await newtracks.map((song, index) => {
      queue.addToQueue(song, index);
    });

    client.embed(
      message,
      ` **Sradaki tüm kopya arklar temizlendi!**\n **Kalan ark says:** \`${newtracks.length}\`\n\nBy Fox Logic: Outsmart Everyone.`
    );
  },
};
