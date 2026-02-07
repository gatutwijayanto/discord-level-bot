function getWIBDate() {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().split("T")[0]; // YYYY-MM-DD
}

module.exports = { getWIBDate };
