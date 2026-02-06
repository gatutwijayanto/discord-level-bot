const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announcebooster")
    .setDescription("Announce member sebagai Server Booster")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("Booster")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);
    const channel = interaction.guild.channels.cache.get(process.env.LEVEL_CHANNEL_ID);

    await channel.send(
      `✨🚀 **BOOSTER ALERT** 🚀✨\n` +
      `Terima kasih ${member} sudah nge-boost server!\n` +
      `Kamu sekarang resmi menjadi 💎 **Server Booster** 💎`
    );

    await interaction.reply({
      content: "✅ Booster berhasil diumumkan.",
      ephemeral: true
    });
  }
};
