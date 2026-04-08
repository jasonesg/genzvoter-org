// In-memory sliding-window rate limiter
// Resets automatically when the serverless function cold-starts,
// so it's lightweight but still blocks rapid-fire abuse.

const windows = new Map();

const CLEANUP_INTERVAL = 60_000; // purge stale entries every 60s
let lastCleanup = Date.now();

function cleanup(windowMs) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of windows) {
    if (now - entry.start > windowMs * 2) windows.delete(key);
  }
}

/**
 * @param {Request} request
 * @param {{ maxRequests?: number, windowMs?: number }} opts
 * @returns {{ success: boolean, remaining: number, reset: number }}
 */
export function rateLimit(request, { maxRequests = 10, windowMs = 60_000 } = {}) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  cleanup(windowMs);

  const entry = windows.get(ip);

  if (!entry || now - entry.start > windowMs) {
    windows.set(ip, { start: now, count: 1 });
    return { success: true, remaining: maxRequests - 1, reset: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return { success: false, remaining: 0, reset: entry.start + windowMs };
  }

  return { success: true, remaining: maxRequests - entry.count, reset: entry.start + windowMs };
}
