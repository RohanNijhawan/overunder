# Facts Seeding Strategy

## Goals
- Low-lift process for adding new daily facts
- Each day's 5 facts come from a single Wikipedia article
- Claude-assisted extraction of numerical claims from Wikipedia
- Free, low-maintenance hosting compatible with the GitHub Pages frontend

---

## Architecture

## Static JSON on GitHub Pages — Fact Finding Plan

### Overview
All daily facts are stored as static JSON files in the repo (e.g. `/facts/2026-03-04.json`). The frontend fetches facts for the current day with:

```js
return fetch(`/facts/${dateStr}.json`).then(r => r.json());
```


---

## Fact Sourcing & Seeding Workflow

### 1. Pick a Wikipedia Article
Choose a topic with lots of measurable numbers (space, geography, history, science, sports records, etc.).

### 2. Download the Article in Raw Format

> ⚠️ **CRITICAL — NO EXCEPTIONS:** You MUST use `curl` to download the raw Wikipedia wikitext before extracting any facts. You must NEVER:
> - Use WebFetch or any web-fetching tool
> - Use training data, memory, or prior knowledge for fact values
> - Guess or estimate numbers from general knowledge
>
> Every single number in every fact MUST come directly from the downloaded raw file. If you are not certain a number appears in the downloaded file, do not use it.

Use `curl` to fetch the article's raw wikitext:

```sh
curl -s -o /tmp/ARTICLE_raw.txt "https://en.wikipedia.org/w/index.php?title=ARTICLE_TITLE&action=raw"
```
Example for Saturn:
```sh
curl -s -o /tmp/saturn_raw.txt "https://en.wikipedia.org/w/index.php?title=Saturn&action=raw"
```

**Check for redirect first:**
```sh
wc -l /tmp/ARTICLE_raw.txt
```
If the output is `1`, the file is a redirect (e.g. `#REDIRECT [[Kīlauea]]`). Re-fetch using the redirect target with URL-encoded title (e.g. `Kīlauea` → `K%C4%ABlauea`).

**Extract numbers — Step A: Infobox fields (most reliable, run this first)**
```sh
grep -E '^\s*\|' /tmp/ARTICLE_raw.txt | grep -E '[0-9]' | head -60
```
Wikipedia infoboxes contain the most precise, citable numbers (area, length, population, speed, elevation, etc.) in compact form.

**Extract numbers — Step B: Prose with measurement units (for additional variety)**
```sh
grep -iE '(km|metres?|meters?|miles?|tonnes?|kg|°[CF]|years? old|km/h|billion|million|hectare|elevation|depth|pressure)' /tmp/ARTICLE_raw.txt | grep -v '^\s*[|!{]' | head -40
```
Catches measurement mentions in article body text not found in the infobox.

Only use numbers that appear in the output of these two commands. Do not use any number from memory or training data.

### 3. Extract Over/Under Facts
- Read the downloaded file and identify 5 numerical claims that are:
  - Varied (cover different aspects of the topic)
  - Fun, interesting, or thought-provoking
  - Not trivially obvious — the stated number should be plausible but the real answer surprisingly different
  - Unambiguous and clearly supported by the downloaded article text

> ⚠️ **CRITICAL — STATEMENT WORDING:** The `statement` field must state a plain number with **no directional language**. The player's job is to guess whether the real value is over or under the number in the statement. Never use words like "over", "under", "more than", "fewer than", "less than", "above", "below", "only", "exceeds", or any other phrase that hints at the answer direction. Write statements as neutral assertions: "The Eiffel Tower stands 400 meters tall" (not "The Eiffel Tower stands over 400 meters tall").

### 4. Write the Facts JSON
Format each day's facts as:

```json
{
  "source": "Wikipedia: Saturn",
  "sourceUrl": "https://en.wikipedia.org/wiki/Saturn",
  "facts": [
    {
      "statement": "Saturn's mass is 50 times that of Earth",
      "answer": "over",
      "actual": "95.159 times Earth's mass"
    }
    // ...4 more
  ]
}
```

`source` and `sourceUrl` are top-level since all 5 facts come from the same article. The end screen shows a single "Continue learning on Wikipedia" link and a Wikimedia donate link.

### 5. Save and Commit
Save as `/facts/YYYY-MM-DD.json` and commit to the repo. Facts are now live for that date.

---

## Batching & Scheduling
- Source facts 1–2 weeks ahead. Each Wikipedia article = one day's facts.
- A single session can cover multiple days.
---

