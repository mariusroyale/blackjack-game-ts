## 🆕 Recent Updates

[![Backend Tests](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/backend-tests.yml) [![Frontend Tests](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/frontend-tests.yml)

### May 19, 2025
- 🎨 Dropped retro theme and introduced modern theme
- 🔄 Improved layout so it is mobile friendly

### May 13, 2025
- 🎴 Major update version 2.0 of the game brings lots of goodies
- 🎴 Added a completely new retro look
- 🎴 Added /leaderboards
- 🎴 Added functionality to auto-save stats
- 🎴 Leaderboards will display top 50 players sorted by highest points earned

### May 12, 2025
- 🎮 Game engine upgrade with ability to save, and retrieve player stats
- 🔧 Added api rate limiter
- 🔄 Implemented postgres final db schema
- 🔄 Added db pool connector and configured infrastructure

### May 7, 2025
- 🎴 Started major React App refactor, moving from jsx to tsx. The code will be componetized more. Part 1 is done.

### May 6, 2025
- 🧪 Added **unit tests** for Gaming Service using jest testing suite
- 🧪 Added **unit tests** for Frontend react app using vitest testing suite

### May 5, 2025
- ♠️ Switched from 1-deck to a 6-deck shoe (300+ cards) for realistic gameplay
- ✅ Added **provable fairness** using deck seed hashes and per-card nonces (deck index)
- 🔁 Decks now **persist per player pair** and automatically reshuffle below 25% threshold
- 🌙 Introduced a sleek **dark theme** for the frontend
- 📊 Added **player stats**: total games, wins, win percentage
- 🎨 Improved **UI/UX**: cards are stacked for better space usage; buttons are easier to hit
- 🔧 Upcoming: React frontend will be refactored to modern standards (Hooks, modular structure, better state management)

### May 3, 2025
- 🤖 Upgraded the **Game AI** to enhance decision-making and realism
- 🛣️ Refactored and improved **game route APIs** for cleaner logic (REST API) and better performance