// Simple in-memory rate limiter (per user, per action)
const limits = {};
const WINDOW = 60 * 1000; // 1 min
const MAX = 10;
function rateLimitCheck(userId, action) {
  const key = `${userId}:${action}`;
  const now = Date.now();
  if (!limits[key]) limits[key] = [];
  limits[key] = limits[key].filter((ts) => now - ts < WINDOW);
  if (limits[key].length >= MAX) return false;
  limits[key].push(now);
  return true;
}
module.exports = { rateLimitCheck };
