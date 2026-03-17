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
Use `curl` to fetch the article's raw wikitext:

```sh
curl -o ARTICLE_raw.txt "https://en.wikipedia.org/w/index.php?title=ARTICLE_TITLE&action=raw"
```
Example for Saturn:
```sh
curl -o saturn_raw.txt "https://en.wikipedia.org/w/index.php?title=Saturn&action=raw"
```

### 3. Extract Over/Under Facts
- Read the downloaded file and identify 5 numerical claims that are:
  - Varied (cover different aspects of the topic)
  - Fun, interesting, or thought-provoking
  - Not trivially obvious (numbers should be plausible but not instantly guessable)
  - Unambiguous and clearly supported by the article

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

