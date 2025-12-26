const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");
const FoxMusic = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "",
  description: "",
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   * @param {FoxMusic} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    
  },
};

const { ContextMenuCommandInteraction } = require("discord.js");

module.exports = {
  name: "",
  category: "",
  type: ApplicationCommandType.Message,
  /**
   * @param {FoxMusic} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    
  },
};

module.exports = {
  name: "",
  category: "",
  type: ApplicationCommandType.User,
  /**
   * @param {FoxMusic} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
   
  },
};

const { Message } = require("discord.js");

module.exports = {
  name: "",
  aliases: [],
  description: "",
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   * @param {FoxMusic} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    
  },
};
