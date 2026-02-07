const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const checkYappingLevel = require("../utils/checkYappingLevel");
const { getWIBDate } = require("../utils/date");

const dataPath = path.join(__dirname, "../data/yapping.json");
const cooldown = new Map();

function loadData() {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;
    if (message.content.trim().length < 5) return;

    const now = Date.now();
    if (cooldown.has(message.author.id) &&
        now - cooldown.get(message.author.id) < 15000) return;
    cooldown.set(message.author.id, now);

    const data = loadData();
    const userId = message.author.id;
    const today = getWIBDate();

    if (!data[userId]) {
      data[userId] = {
        chat: 0,
        level: null,
        lastEmbedDate: null,
        lastEmbedMessageId: null
      };
    }

    // ✅ chat SELALU nambah
    data[userId].chat += 1;

    const newLevel = await checkYappingLevel(
      message.member,
      data[userId].chat
    );

    if (!newLevel) {
      saveData(data);
      return;
    }

    if (data[userId].level === newLevel.name) {
      saveData(data);
      return;
    }

    data[userId].level = newLevel.name;

    const channel = message.guild.channels.cache.get(
      process.env.LEVEL_CHANNEL_ID
    );
    if (!channel) {
      saveData(data);
      return;
    }

    // ❌ 1 embed per hari (WIB)
    if (data[userId].lastEmbedDate === today) {
      saveData(data);
      return;
    }

    // 🧹 hapus embed lama
    if (data[userId].lastEmbedMessageId) {
      channel.messages
        .fetch(data[userId].lastEmbedMessageId)
        .then(m => m.delete().catch(() => {}))
        .catch(() => {});
    }

    // ✅ kirim embed baru
    const embed = new EmbedBuilder()
      .setColor(newLevel.color)
      .setAuthor({ name: "🗣️ Yapping Level Update" })
      .setThumbnail(message.author.displayAvatarURL())
      .addFields(
        { name: "👤 Member", value: `<@${userId}>`, inline: true },
        { name: "🏷️ Level", value: newLevel.name, inline: true },
        { name: "💬 Total Chat", value: `${data[userId].chat}`, inline: true }
      )
      .setFooter({ text: "1 embed / user / hari (WIB)" })
      .setTimestamp();

    const sent = await channel.send({ embeds: [embed] });

    data[userId].lastEmbedDate = today;
    data[userId].lastEmbedMessageId = sent.id;

    saveData(data);
  }
};
