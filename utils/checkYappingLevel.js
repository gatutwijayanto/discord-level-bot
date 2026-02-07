const levels = require("./yappingLevels");

module.exports = async (member, totalChat) => {
  if (totalChat < 100) return null;

  let currentLevel = null;

  for (const lvl of levels) {
    if (totalChat >= lvl.min) currentLevel = lvl;
  }

  if (!currentLevel) return null;

  // hapus role yapping lain
  for (const lvl of levels) {
    if (lvl.roleId !== currentLevel.roleId) {
      if (member.roles.cache.has(lvl.roleId)) {
        await member.roles.remove(lvl.roleId).catch(() => {});
      }
    }
  }

  // pasang role baru
  if (!member.roles.cache.has(currentLevel.roleId)) {
    await member.roles.add(currentLevel.roleId).catch(() => {});
  }

  return currentLevel;
};
