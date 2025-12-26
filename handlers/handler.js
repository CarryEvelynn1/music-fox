const { readdirSync } = require("fs");
const { slash } = require("../settings/config");
const FoxMusic = require("./Client");

/**
 * @param {FoxMusic} client
 */
module.exports = async (client) => {
  
  
  try {
    let allCommands = [];
    readdirSync("./Commands/Slash").forEach((dir) => {
      const commands = readdirSync(`./Commands/Slash/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Slash/${dir}/${cmd}`);
        if (command.name) {
          client.commands.set(command.name, command);
          allCommands.push(command);
        } else {
          console.log(`[HATA] ${cmd} komutu hazır değil!`);
        }
      }
    });
    console.log(`[!] Fox Music: ${client.commands.size} adet Slash komutu yüklendi.`);
  } catch (e) {
    console.log(e);
  }

  
  try {
    readdirSync("./Commands/Message").forEach((dir) => {
      const commands = readdirSync(`./Commands/Message/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Message/${dir}/${cmd}`);
        if (command.name) {
          client.mcommands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases))
            command.aliases.forEach((a) => client.aliases.set(a, command.name));
        } else {
          console.log(`[HATA] ${cmd} mesaj komutu hazır değil!`);
        }
      }
    });
    console.log(`[!] Fox Music: ${client.mcommands.size} adet Mesaj komutu yüklendi.`);
  } catch (error) {
    console.log(error);
  }

  
  try {
    let eventCount = 0;
    readdirSync("./events")
      .filter((f) => f.endsWith(".js"))
      .forEach((event) => {
        require(`../events/${event}`);
        eventCount++;
      });
    console.log(`[!] Fox Music: ${eventCount} adet olay (event) başarıyla bağlandı.`);
  } catch (e) {
    console.log(e);
  }
};
