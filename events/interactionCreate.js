const client = require("../index");
const {
  cooldown,
  check_dj,
  databasing,
  getPermissionName,
} = require("../handlers/functions");
const { emoji } = require("../settings/config");
const { ApplicationCommandOptionType, Events } = require("discord.js");

client.on(Events.InteractionCreate, async (interaction) => {

  if (interaction.isAutocomplete()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd && typeof cmd.autocomplete === "function") {
      try {
        await cmd.autocomplete(client, interaction);
      } catch (e) {
        
      }
    }
    return;
  }

  
  if (interaction.isCommand()) {
    await interaction.deferReply().catch((e) => {});
    await databasing(interaction.guildId, interaction.user.id);

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
      return client.embed(
        interaction,
        `${emoji.ERROR} \`${interaction.commandName}\` komutu bulunamadı.`
      );
    }
    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    if (cmd) {
      
      let queue = client.distube.getQueue(interaction.guild.id);
      let voiceChannel = interaction.member.voice.channel;
      let botChannel = interaction.guild.members.me.voice.channel;
      let checkDJ = await check_dj(client, interaction.member, queue?.songs[0]);

      if (!interaction.member.permissions.has(cmd.userPermissions)) {
        const needPerms = getPermissionName(cmd.userPermissions);
        return client.embed(
          interaction,
          `Bu komutu kullanmak için \`${needPerms}\` yetkisine sahip olmalısınız!`
        );
      } else if (
        !interaction.guild.members.me.permissions.has(cmd.botPermissions)
      ) {
        const needPerms = getPermissionName(cmd.botPermissions);
        return client.embed(
          interaction,
          `Bu komutu çalıştırmak için \`${needPerms}\` yetkisine ihtiyacım var!`
        );
      } else if (cooldown(interaction, cmd)) {
        return client.embed(
          interaction,
          `Komutu tekrar kullanabilmek için \`${cooldown(
            interaction,
            cmd
          ).toFixed()}\` saniye beklemelisiniz.`
        );
      } else if (cmd.inVoiceChannel && !voiceChannel) {
        return client.embed(
          interaction,
          `${emoji.ERROR} Bir ses kanalına katılmanız gerekiyor.`
        );
      } else if (
        cmd.inSameVoiceChannel &&
        botChannel &&
        !botChannel?.equals(voiceChannel)
      ) {
        return client.embed(
          interaction,
          `${emoji.ERROR} Benimle aynı ses kanalına (${botChannel}) katılmanız gerekiyor.`
        );
      } else if (cmd.Player && !queue) {
        return client.embed(
          interaction, 
          `${emoji.ERROR} Şu anda hiçbir müzik çalmıyor.`
        );
      } else if (cmd.djOnly && checkDJ) {
        return client.embed(
          interaction,
          `${emoji.ERROR} Bu komutu sadece DJ rolüne sahip olanlar veya şarkıyı isteyen kişi kullanabilir.`
        );
      } else {

        await cmd.run(client, interaction,
