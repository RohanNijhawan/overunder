/**
 * Facts data layer.
 *
 * Daily facts are stored as static JSON files under /facts/YYYY-MM-DD.json.
 * Each file contains: { "facts": [ { statement, answer, actual, source, sourceUrl } ] }
 *
 * To switch to a server, replace getFactsForDate with:
 *   return fetch(`/api/facts?date=${dateStr}`).then(r => r.json());
 */
async function getFactsForDate(dateStr) {
  try {
    const r = await fetch(`facts/${dateStr}.json`);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}
