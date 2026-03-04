/**
 * Facts data layer.
 *
 * To switch to a server, replace getFactsForDate with:
 *   return fetch(`/api/facts?date=${dateStr}`).then(r => r.json());
 *
 * Each fact:
 *   statement  - the claim shown to the player (with a specific number)
 *   answer     - "over" or "under" (the correct answer)
 *   actual     - the real value, shown after the game ends
 *   source     - display name for the citation
 *   sourceUrl  - URL for the citation link
 */
const DAILY_FACTS = {
  "2026-03-03": {
    facts: [
      {
        statement: "The Moon's average distance from Earth is 200,000 miles",
        answer: "over",
        actual: "238,854 miles (384,399 km)",
        source: "Wikipedia: Moon",
        sourceUrl: "https://en.wikipedia.org/wiki/Moon",
      },
      {
        statement: "The Moon's diameter is 2,500 miles",
        answer: "under",
        actual: "2,159 miles (3,474 km) — roughly the width of the contiguous US",
        source: "Wikipedia: Moon",
        sourceUrl: "https://en.wikipedia.org/wiki/Moon",
      },
      {
        statement: "The Moon completes one full orbit around Earth every 25 days",
        answer: "over",
        actual: "29.5 days (one synodic month)",
        source: "Wikipedia: Moon",
        sourceUrl: "https://en.wikipedia.org/wiki/Moon",
      },
      {
        statement: "Apollo missions had landed 10 humans on the Moon by 1972",
        answer: "over",
        actual: "12 humans across 6 Apollo missions",
        source: "Wikipedia: Moon",
        sourceUrl: "https://en.wikipedia.org/wiki/Moon",
      },
      {
        statement: "The Moon's mass is 2% of Earth's mass",
        answer: "under",
        actual: "1.2% of Earth's mass",
        source: "Wikipedia: Moon",
        sourceUrl: "https://en.wikipedia.org/wiki/Moon",
      },
    ],
  },
};

function getFactsForDate(dateStr) {
  return Promise.resolve(DAILY_FACTS[dateStr] || null);
}
