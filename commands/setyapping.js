const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const checkYappingLevel = require("../utils/checkYappingLevel");

const dataPath = path.join(__dirname, "../data/yapping.json");

function loadData() {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setyapping")
    .setDescription("Set total yapping (chat) member")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Member")
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName("amount")
        .setDescription("Total chat")
        .setRequired(true)
        .setMinValue(0)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "❌ Kamu tidak punya izin",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const member = await interaction.guild.members.fetch(user.id);

    const data = loadData();

    if (!data[user.id]) {
      data[user.id] = {
        chat: 0,
        level: null,
        lastEmbedDate: null,
        lastEmbedMessageId: null
      };
    }

    // ✅ overwrite angka chat (TIDAK reset level)
    data[user.id].chat = amount;

    // 🔁 sync role langsung
    await checkYappingLevel(member, amount);

    saveData(data);

    await interaction.reply({
      content: `✅ Yapping <@${user.id}> diset ke **${amount}**`,
      ephemeral: true
    });
  }
};
