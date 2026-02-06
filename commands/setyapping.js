const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const checkYappingLevel = require("../utils/checkYappingLevel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setyapping")
    .setDescription("Set jumlah chat (yapping) member")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("Member")
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName("messages")
        .setDescription("Jumlah chat")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      const user = interaction.options.getUser("user");
      const messages = interaction.options.getInteger("messages");

      // 🔑 FETCH MEMBER (ANTI NULL)
      const member = await interaction.guild.members.fetch(user.id);

      const path = "./data/yapping.json";
      const data = fs.existsSync(path)
        ? JSON.parse(fs.readFileSync(path))
        : {};

      data[member.id] = { messages };
      fs.writeFileSync(path, JSON.stringify(data, null, 2));

      await checkYappingLevel(member, messages);

      await interaction.reply({
        content: `✅ Yapping ${member} diset ke **${messages}**`,
        ephemeral: true
      });

    } catch (err) {
      console.error("ERROR SETYAPPING:", err);

      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Gagal set yapping (cek console)",
          ephemeral: true
        });
      }
    }
  }
};
