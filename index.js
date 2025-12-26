const { loadEnvFile } = require("process");
loadEnvFile();

const FoxMusic = require("./handlers/Client");
const { TOKEN } = require("./settings/config");

const client = new FoxMusic();

module.exports = client;

client.start(TOKEN);

process.on("unhandledRejection", (reason, p) => {
  console.log(" [Hata_Yönetimi] :: Yakalanamayan Reddetme");
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(" [Hata_Yönetimi] :: Yakalanamayan İstisna");
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [Hata_Yönetimi] :: Yakalanamayan İstisna (MONİTÖR)");
  console.log(err, origin);
});
