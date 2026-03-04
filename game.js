// game.js — requires facts.js to be loaded first (defines getFactsForDate)

const MAX_ATTEMPTS = 3;

let state = {
  date: "",
  facts: [],
  currentGuesses: [], // null | "over" | "under" per fact
  attempts: [],       // { guesses, score, results[] }
  gameOver: false,
  won: false,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function scoreAttempt(guesses) {
  return state.facts.reduce(
    (n, fact, i) => n + (guesses[i] === fact.answer ? 1 : 0),
    0
  );
}

function getResults(guesses) {
  return state.facts.map((fact, i) => guesses[i] === fact.answer);
}

// ─── Actions ────────────────────────────────────────────────────────────────

function hasChangedSinceLastAttempt() {
  if (state.attempts.length === 0) return true;
  const last = state.attempts[state.attempts.length - 1].guesses;
  return state.currentGuesses.some((g, i) => g !== last[i]);
}

function handleGuess(index, value) {
  if (state.gameOver) return;
  const next = [...state.currentGuesses];
  // Toggle off if already selected
  next[index] = next[index] === value ? null : value;
  state.currentGuesses = next;
  render();
}

function handleSubmit() {
  if (state.currentGuesses.some((g) => g === null)) return;
  if (!hasChangedSinceLastAttempt()) return;

  const score = scoreAttempt(state.currentGuesses);
  const results = getResults(state.currentGuesses);

  state.attempts.push({ guesses: [...state.currentGuesses], score, results });

  if (score === state.facts.length) {
    state.gameOver = true;
    state.won = true;
  } else if (state.attempts.length >= MAX_ATTEMPTS) {
    state.gameOver = true;
    state.won = false;
  }

  render();
}

function handleShare() {
  const text = buildShareText();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(showCopyFeedback);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showCopyFeedback();
  }
}

function showCopyFeedback() {
  const btn = document.getElementById("share-btn");
  if (!btn) return;
  btn.textContent = "Copied! ✓";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = "Copy & Share 📋";
    btn.classList.remove("copied");
  }, 2000);
}

// ─── Share text ─────────────────────────────────────────────────────────────

function buildShareText() {
  const total = state.facts.length;
  const used = state.attempts.length;
  const header = `Over/Under 📅 ${state.date}`;
  const result = state.won
    ? `Solved in ${used}/${MAX_ATTEMPTS} ${used === 1 ? "attempt" : "attempts"}! 🎉`
    : `Failed to solve today's puzzle 😔`;

  const rows = state.attempts
    .map((a) => {
      const squares = a.results.map((r) => (r ? "🟩" : "🟥")).join("");
      return `${squares} (${a.score}/${total})`;
    })
    .join("\n");

  return `${header}\n${result}\n\n${rows}`;
}

// ─── Render ──────────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById("app");
  app.innerHTML = state.gameOver ? renderEndGame() : renderGame();
  attachListeners();
}

function renderGame() {
  const attemptNum = state.attempts.length + 1;
  const allSelected = state.currentGuesses.every((g) => g !== null);
  const canSubmit = allSelected && hasChangedSinceLastAttempt();

  const historyHtml = state.attempts.length > 0
    ? `<div class="guess-history">
        ${state.attempts.map((attempt, i) => `
          <div class="attempt-row">
            <span class="attempt-label">Attempt ${i + 1}</span>
            <span class="attempt-score">${attempt.score} / ${state.facts.length} correct</span>
          </div>`).join("")}
      </div>`
    : "";

  const factsHtml = state.facts
    .map((fact, i) => {
      const guess = state.currentGuesses[i];
      return `
      <div class="fact-card">
        <div class="fact-number">${i + 1}</div>
        <div class="fact-body">
          <p class="fact-statement">${fact.statement}</p>
          <div class="guess-buttons">
            <button class="guess-btn over-btn${guess === "over" ? " selected" : ""}"
              data-index="${i}" data-value="over">Over ↑</button>
            <button class="guess-btn under-btn${guess === "under" ? " selected" : ""}"
              data-index="${i}" data-value="under">Under ↓</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  const submitHint = !allSelected
    ? "Select Over or Under for each fact"
    : !hasChangedSinceLastAttempt()
    ? "Change at least one answer to submit again"
    : "";

  return `
    <div class="game-header">
      <span class="date">${formatDate(state.date)}</span>
      <span class="attempts-info">Attempt ${attemptNum} of ${MAX_ATTEMPTS}</span>
    </div>
    ${historyHtml}
    <div class="facts-list">${factsHtml}</div>
    <div class="submit-area">
      <button class="submit-btn${canSubmit ? "" : " disabled"}" id="submit-btn"
        ${canSubmit ? "" : "disabled"}>Submit Answers</button>
      ${submitHint ? `<p class="submit-hint">${submitHint}</p>` : ""}
    </div>`;
}

function renderEndGame() {
  const used = state.attempts.length;
  const lastResults = state.attempts[used - 1].results;

  const factsHtml = state.facts
    .map((fact, i) => {
      const correct = lastResults[i];
      const label = fact.answer === "over" ? "Over ↑" : "Under ↓";
      return `
      <div class="fact-card${correct ? " correct" : " wrong"}">
        <div class="fact-number">${i + 1}</div>
        <div class="fact-body">
          <p class="fact-statement">${fact.statement}</p>
          <div class="fact-reveal">
            <span class="correct-answer">${label}</span>
            <span class="actual-value">Actual: ${fact.actual}</span>
          </div>
          <a class="citation-link" href="${fact.sourceUrl}" target="_blank" rel="noopener noreferrer">
            ↗ ${fact.source}
          </a>
        </div>
      </div>`;
    })
    .join("");

  const summaryHtml = state.attempts
    .map((attempt, i) => {
      const squares = attempt.results
        .map((r) => `<span class="square${r ? " sq-correct" : " sq-wrong"}"></span>`)
        .join("");
      return `
      <div class="attempt-row">
        <span class="attempt-label">Attempt ${i + 1}</span>
        <div class="squares">${squares}</div>
        <span class="attempt-score">${attempt.score}/${state.facts.length}</span>
      </div>`;
    })
    .join("");

  const resultMsg = state.won
    ? `Solved in ${used} ${used === 1 ? "attempt" : "attempts"}! 🎉`
    : `Better luck tomorrow! 😔`;

  return `
    <div class="game-header">
      <span class="date">${formatDate(state.date)}</span>
    </div>
    <div class="end-game">
      <div class="result-message${state.won ? " won" : " lost"}">${resultMsg}</div>

      <div class="share-section">
        <h3>Your Results</h3>
        <div class="attempts-summary">${summaryHtml}</div>
        <button class="share-btn" id="share-btn">Copy &amp; Share 📋</button>
      </div>

      <div class="answers-section">
        <h3>Today's Answers</h3>
        <div class="facts-list">${factsHtml}</div>
      </div>
    </div>`;
}

// ─── Event wiring ────────────────────────────────────────────────────────────

function attachListeners() {
  document.querySelectorAll(".guess-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      handleGuess(parseInt(btn.dataset.index), btn.dataset.value)
    );
  });

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.addEventListener("click", handleSubmit);

  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) shareBtn.addEventListener("click", handleShare);
}

// ─── Init ────────────────────────────────────────────────────────────────────

async function init() {
  const today = getTodayString();
  const data = await getFactsForDate(today);
  const app = document.getElementById("app");

  if (!data) {
    app.innerHTML = `<div class="error"><p>No puzzle available for today (${today}).<br>Check back tomorrow!</p></div>`;
    return;
  }

  state.date = today;
  state.facts = data.facts;
  state.currentGuesses = Array(data.facts.length).fill(null);
  render();
}

init();
