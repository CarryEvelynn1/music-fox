const { ActivityType, Events } = require("discord.js");
const client = require("../index");
const { registerSlashCommands } = require("../handlers/functions");
const server = require("../server.js");
const Database = require("../handlers/Database");

client.once(Events.ClientReady, async () => {
  try {
    
    console.log(`${client.user.username} (Fox Music) şu an aktif!`);

   
    client.user.setActivity({
      name: `By Fox Logic: Outsmart Everyone.`,
      type: ActivityType.Watching,
    });

    
    await Database(client);

    
    for (const guild of client.guilds.cache.values()) {
      await client.updateembed(client, guild);
    }

    
    await registerSlashCommands(client);

    
    await server(client);
  } catch (error) {
    console.error("Başlatma sırasında bir hata oluştu:", error);
  }
});
