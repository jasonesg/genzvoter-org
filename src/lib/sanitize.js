// Input sanitization utilities for user-submitted data

/**
 * Strip HTML tags, collapse whitespace, and trim.
 * Prevents XSS via stored payloads.
 */
export function sanitizeString(input, { maxLength = 2000 } = {}) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/&lt;/g, "<")            // decode common entities (then re-strip)
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")          // second pass after entity decode
    .replace(/javascript:/gi, "")     // strip JS protocol
    .replace(/on\w+\s*=/gi, "")       // strip inline event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control chars (keep \n \r \t)
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate and sanitize an email address.
 * Returns the cleaned email or null if invalid.
 */
export function sanitizeEmail(input) {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase().slice(0, 254);
  // RFC 5322 simplified — good enough for form submissions
  const re = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
  return re.test(email) ? email : null;
}

/**
 * Sanitize an entire answers object.
 * Handles strings, arrays of strings, and nested values.
 */
export function sanitizeAnswers(answers) {
  if (!answers || typeof answers !== "object") return {};

  const clean = {};
  const allowedKeys = /^[a-z0-9_]+$/i;

  for (const [key, value] of Object.entries(answers)) {
    // Only allow alphanumeric + underscore keys
    if (!allowedKeys.test(key)) continue;

    if (Array.isArray(value)) {
      // Arrays (e.g. logo_recognition: ["airbnb", "zillow"])
      clean[key] = value
        .filter((v) => typeof v === "string")
        .map((v) => sanitizeString(v, { maxLength: 200 }))
        .slice(0, 20); // cap array length
    } else if (typeof value === "string") {
      clean[key] = sanitizeString(value, { maxLength: 5000 });
    }
    // Silently drop non-string, non-array values
  }

  return clean;
}
