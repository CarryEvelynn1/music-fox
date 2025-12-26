const { MONGO_URL } = require("../settings/config");
const Josh = require("@joshdb/core");


let provider;
try {
  if (MONGO_URL && typeof MONGO_URL === "string" && MONGO_URL.trim().length) {
    provider = require("@joshdb/mongo");
    console.log("[Veritabanı] MongoDB sağlayıcısı kullanılıyor (@joshdb/mongo)");
  } else {
    provider = require("@joshdb/json");
    console.log("[Veritabanı] JSON sağlayıcısı kullanılıyor (@joshdb/json)");
  }
} catch (err) {
 
  provider = require("@joshdb/json");
  console.warn(
    "[Veritabanı] JSON sağlayıcısına geri dönüldü (@joshdb/json):",
    err?.message || err
  );
}

const FoxMusic = require("./Client"); 
const { Events } = require("discord.js");

/**
 * Müzik ve autoresume için Josh veritabanını başlat
 * @param {FoxMusic} client - Discord client instance
 */
module.exports = async (client) => {
 
  const dbName = client.user.username.replace(/\s+/g, "");

  const dbOptions = {
    url: MONGO_URL,
    dbName: dbName,
  };

  
  client.music = new Josh({
    name: "music",
    provider,
    providerOptions: {
      ...dbOptions,
      collection: "music",
    },
  });

  
  client.autoresume = new Josh({
    name: "autoresume",
    provider,
    providerOptions: {
      ...dbOptions,
      collection: "autoresume",
    },
  });

  
  client.on(Events.GuildDelete, async (guild) => {
    try {
      if (!guild) return;

      
      const musicData = await client.music.get(guild.id);
      if (!musicData) return;

      
      const requestChannel = guild.channels.cache.get(musicData.music.channel);
      if (requestChannel) {
        await requestChannel.delete(
          `${client.user.username} İstek Kanalı Siliniyor`
        ).catch(() => {});
      }

      
      await client.music.delete(guild.id);
      await client.autoresume.delete(guild.id);
    } catch (error) {
      console.error("GuildDelete olayı işlenirken hata oluştu:", error);
    }
  });
};
