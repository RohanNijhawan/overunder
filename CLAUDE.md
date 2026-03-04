# CLAUDE.md

## Project: Over/Under Daily Web Game

### Overview
Over/Under is a daily web game inspired by Wordle. Each day, players are presented with 5 factual statements (e.g., "The Moon is 200,000 miles away from Earth (Over/Under)"). For each, the player must guess whether the true value is over or under the given number. After submitting their guesses, players are told how many they got correct (but not which ones). They have a limited number of attempts to get all 5 correct.

### Gameplay
- Each day features 5 new over/under facts.
- Players select "Over" or "Under" for each fact.
- After submitting, the game reveals how many answers are correct (not which ones).
- Players get a few attempts (e.g., 3) to get all 5 correct.
 
 #### End Game Results & Share Screen
 - After all attempts are used or all facts are guessed correctly, the user is shown:
	 - All 5 facts, the correct answers for each, and the Wikipedia citations for those answers.
	 - A Wordle-style share sheet to copy and share their result (e.g., attempt count, success/failure, and a visual summary) with others.
	 - The share sheet should be easy to copy and visually appealing for sharing on social media or with friends.

### Technology Stack

### Design & Priorities
- **Simplicity:** Codebase should be minimal, well-written, and easy to maintain.
- **Aesthetics:** UI should be clean, modern, and mobile responsive.
- **Accessibility:** Game should be easily playable on both desktop and mobile devices.
- **Transparency:** Security of answers is not a concern; API can expose answers if needed.

### Example Fact
> The Moon is 200,000 miles away from Earth (Over/Under)

### Example Flow
1. Player sees 5 facts with numbers.
2. Player selects Over/Under for each.
3. Player submits answers.
4. Game reveals how many are correct.
5. Player can try again (up to the attempt limit).

### Future Considerations
- Add a leaderboard or streak tracker.
- Allow users to suggest new facts.
- Support for multiple languages.

### License
MIT or similar permissive license.

### Credits
- Facts sourced from Wikipedia (citations included in-game).

---

This document describes the vision, priorities, and technical approach for the "Over/Under" daily web game. For questions or contributions, see the repository README or open an issue.