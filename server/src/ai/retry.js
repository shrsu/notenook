/**
 * Retry helper for the Gemini API.
 *
 * Free-tier quotas are per-minute and low, so a burst of requests - an ingest
 * run or an evaluation sweep - will hit 429 routinely. The API tells us how long
 * to wait in its RetryInfo, so honour that when present and fall back to
 * exponential backoff otherwise.
 */

const RETRYABLE = new Set([429, 500, 502, 503, 504]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Pull the server-suggested delay out of an error payload, if it gave one. */
const retryDelayFrom = (body) => {
  const match = /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/.exec(body || "");
  return match ? Math.ceil(Number(match[1]) * 1000) : null;
};

class HttpError extends Error {
  constructor(status, body) {
    super(`${status}: ${body}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Run `request` (returns a fetch Response), retrying on transient failures.
 * Returns the parsed JSON body.
 */
const requestWithRetry = async (request, { label, attempts = 5, baseDelayMs = 1000 } = {}) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await request();
    if (response.ok) return response.json();

    const body = await response.text();
    lastError = new HttpError(response.status, body);

    if (!RETRYABLE.has(response.status) || attempt === attempts) break;

    const wait = retryDelayFrom(body) ?? baseDelayMs * 2 ** (attempt - 1);
    console.warn(`${label} got ${response.status}, retrying in ${wait}ms (${attempt}/${attempts - 1})`);
    await sleep(wait);
  }

  throw new Error(`${label} failed (${lastError.status}): ${lastError.body}`);
};

module.exports = { requestWithRetry, sleep };
