const fs = require("fs");
const checkYappingLevel = require("../utils/checkYappingLevel");

const DATA_PATH = "./data/yapping.json";

// anti spam: 1 hitung per 15 detik per user
const cooldown = new Map();

module.exports = async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  // abaikan pesan terlalu pendek
  if (message.content.trim().length < 5) return;

  const userId = message.author.id;
  const now = Date.now();

  if (cooldown.has(userId) && now - cooldown.get(userId) < 15000) return;
  cooldown.set(userId, now);

  // load data
  const data = fs.existsSync(DATA_PATH)
    ? JSON.parse(fs.readFileSync(DATA_PATH))
    : {};

  if (!data[userId]) data[userId] = { messages: 0 };

  data[userId].messages += 1;

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

  // cek & update role otomatis
  await checkYappingLevel(message.member, data[userId].messages);
};
