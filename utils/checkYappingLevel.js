const { EmbedBuilder } = require("discord.js");

module.exports = async (member, messages) => {
  const channel = member.guild.channels.cache.get(process.env.LEVEL_CHANNEL_ID);
  if (!channel) return;

  const levels = [
    {
      min: 5000,
      role: "Yapping God",
      title: "Yapping God",
      color: "#E74C3C" // merah
    },
    {
      min: 2500,
      role: "Yapping Lord",
      title: "Yapping Lord",
      color: "#E67E22" // oranye
    },
    {
      min: 1000,
      role: "Yapping Pro",
      title: "Yapping Pro",
      color: "#9B59B6" // ungu
    },
    {
      min: 300,
      role: "Yapping Enjoyer",
      title: "Yapping Enjoyer",
      color: "#3498DB" // biru
    },
    {
      min: 100,
      role: "Yapping Rookie",
      title: "Yapping Rookie",
      color: "#2ECC71" // hijau
    }
  ];

  const level = levels.find(l => messages >= l.min);
  if (!level) return;

  // hapus role yapping lama
  for (const l of levels) {
    const r = member.guild.roles.cache.find(x => x.name === l.role);
    if (r && member.roles.cache.has(r.id) && l.role !== level.role) {
      await member.roles.remove(r);
    }
  }

  const newRole = member.guild.roles.cache.find(r => r.name === level.role);
  if (!newRole) {
    console.log("❌ ROLE TIDAK DITEMUKAN:", level.role);
    return;
  }

  if (member.roles.cache.has(newRole.id)) return;

  await member.roles.add(newRole);

  // EMBED FINAL (WARNA + AVATAR)
  const embed = new EmbedBuilder()
    .setColor(level.color)
    .setTitle("🗣️ Yapping Level Up")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      { name: "👤 Member", value: `${member}`, inline: true },
      { name: "🏷️ Level", value: `**${level.title}**`, inline: true },
      { name: "💬 Total Chat", value: `${messages}`, inline: true }
    )
    .setFooter({ text: "Pelacak Level & Role" })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
};
