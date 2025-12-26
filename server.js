const express = require("express");
const cors = require("cors");
const { version } = require("discord.js");
const os = require("systeminformation");
const { msToDuration, formatBytes } = require("./handlers/functions");

module.exports = async (client) => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Bir şeyler ters gitti!");
  });

  app.get("/", (req, res) => {
    res.send(`Fox Music API Çalışıyor`);
  });

  app.get("/ana-sayfa", (req, res) => {
    res.send(client.user);
  });

  app.get("/komutlar", (req, res) => {
    function cmdData(cmd) {
      return {
        name: cmd.name,
        description: cmd.description,
        category: cmd.category,
      };
    }
    const commands = {
      mesaj_komutlari: client.mcommands.map((cmd) => cmdData(cmd)),
      mesaj_kategorileri: client.mcategories.map((cat) => cat),
      slash_komutlari: client.commands.map((cmd) => cmdData(cmd)),
      slash_kategorileri: client.scategories.map((cat) => cat),
    };

    res.send(commands);
  });

  app.get("/hakkinda", async (req, res) => {
    let memory = await os.mem();
    let cpu = await os.cpu();

    let options = {
      sunucu_sayisi: client.guilds.cache.size,
      kullanici_sayisi: client.users.cache.size,
      kanal_sayisi: client.channels.cache.size,
      calisma_suresi: msToDuration(client.uptime),
      DJS_Surumu: `v${version}`,
      Node_Surumu: `${process.version}`,
      gecikme: `${client.ws.ping}ms`,
      islemci: cpu.brand,
      bellek: {
        toplam: formatBytes(memory.total),
        kullanim: formatBytes(memory.used),
      },
    };

    res.send(options);
  });

  app.listen(port, () => {
    console.log(`API servisi http://localhost:${port} adresinde aktif.`);
  });
};
