# ♠️ Blackjack Game (TypeScript + Express)

[![Backend Tests](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/backend-tests.yml)

A lightweight, server-side Blackjack game API built with **TypeScript** and **Express**. Designed for experimentation, learning, and extension, the backend handles game state, deck logic, player turns, and actions like hitting or standing — all exposed via a simple RESTful interface.

---

## ✨ Features

- ♠️ Fully functional Blackjack rules
- 👤 Player vs Dealer logic
- 🧠 Turn-based game flow
- 🔄 Stateless JSON API
- 🧪 Easy to test and expand
- 📦 Clean project structure (services, models, routes)
- ✍️ Written entirely in **TypeScript**

### 🚧 Planned Feature

- **Betting system**: In future versions, players will be able to place bets and manage balances.

---

## ♠️ Blackjack Rules

The game follows the basic rules of Blackjack:

- **Card Values**:
  - Number cards are worth their face value.
  - Face cards (Jack, Queen, King) are worth 10.
  - Aces are worth either 1 or 11, depending on which is more advantageous.
  
- **Gameplay**:
  - Players aim to get as close to 21 as possible without going over.
  - Players can choose to "hit" (take another card) or "stand" (stop their turn).
  - The dealer must hit until their total is at least 17.
  - Players win if their hand is closer to or equal to 21 than the dealer's without exceeding 21.
  - A hand that has 21 is refered to as `Blackjack`, or a win
  - If players have gone over 21 it is refered to as `Bust`, or a loss
  - If players have equal points, including 21 v 21, it is refered to as `Draw`

---

## ⚙️ Requirements

- Node.js (v22+ recommended)
- npm

---

## 📦 Tech Stack

| Tool        | Version   |
|-------------|-----------|
| TypeScript  | ^5.8.x    |
| Express     | ^5.1.x    |
| Node        | ^22.x     |

---

## 🚀 Getting Started

### 🔧 Development

```bash
git clone https://github.com/mariusroyale/blackjack-game-ts.git
cd blackjack-game-ts
npm install
npm run dev
```

### 🔧 Production

```bash
npm install
npm run build
npm start
```

---

## 📡 API Routes

### 🎮 Create a New Game

**POST** `/api/games`  
Initializes a new Blackjack game.

#### Request Body
```json
{
    "playerData": [
        {
            "playerName": "Marius",
            "type": "player"
        },
        {
            "playerName": "Ace Dealer Bot",
            "type": "dealer"
        }
    ]
}
```

#### Response
```json
{
    "gameId": "4d432259-b74f-4d23-af4a-8d776a0179c3",
    "state": {
        "gameId": "4d432259-b74f-4d23-af4a-8d776a0179c3",
        "players": [
            {
                "name": "Marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Diamonds",
                        "rank": "4",
                        "nonce": 311
                    },
                    {
                        "suit": "Spades",
                        "rank": "Jack",
                        "nonce": 310
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 0,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            },
            {
                "name": "Blackjackzilla",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "10",
                        "nonce": 309
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 0,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            }
        ],
        "deckSize": 309,
        "deckSeed": "a957822fb76fd829d9c197a25c2545889989c2bdfd4c81bd4730e5fa745adbcb",
        "turn": "player",
        "gameStatus": "active",
        "gameEndStatus": "",
        "gameStats": {
            "turnsPlayed": 0,
            "playerTurnsPlayed": 0,
            "playerEndedTurn": false,
            "dealerTurnsPlayed": 0,
            "dealerEndedTurn": false,
            "winner": "",
            "playerScore": {
                "player": 14,
                "dealer": 10
            }
        }
    }
}
```

---

### ✋ Hit

**POST** `/api/games/:id/hit`  
Player chooses to draw another card.

#### Request Body
```json
{
    "playerData": {
        "playerName": "Marius",
        "type": "player"
    }
}
```

#### Response
```json
{
    "gameId": "4d432259-b74f-4d23-af4a-8d776a0179c3",
    "state": {
        "gameId": "4d432259-b74f-4d23-af4a-8d776a0179c3",
        "players": [
            {
                "name": "M",
                "type": "player",
                "hand": [
                    {
                        "suit": "Diamonds",
                        "rank": "4",
                        "nonce": 311
                    },
                    {
                        "suit": "Spades",
                        "rank": "Jack",
                        "nonce": 310
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Ace",
                        "nonce": 308
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 0,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            },
            {
                "name": "Blackjackzilla",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "10",
                        "nonce": 309
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 0,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            }
        ],
        "deckSize": 308,
        "deckSeed": "a957822fb76fd829d9c197a25c2545889989c2bdfd4c81bd4730e5fa745adbcb",
        "turn": "player",
        "gameStatus": "active",
        "gameEndStatus": "",
        "gameStats": {
            "turnsPlayed": 0,
            "playerTurnsPlayed": 0,
            "playerEndedTurn": false,
            "dealerTurnsPlayed": 0,
            "dealerEndedTurn": false,
            "winner": "",
            "playerScore": {
                "player": 15,
                "dealer": 10
            }
        }
    }
}
```

---

### 🤚 Stand

**POST** `/api/games/:id/stand`  
Player ends their turn; the dealer will automatically play.

#### Request Body
```json
{
    "playerData": {
        "playerName": "Marius",
        "type": "player"
    }
}
```

#### Response
```json
{
    "gameId": "4d432259-b74f-4d23-af4a-8d776a0179c3",
    "state": {
        "gameId": "4d432259-b74f-4d23-af4a-8d776a0179c3",
        "players": [
            {
                "name": "M",
                "type": "player",
                "hand": [
                    {
                        "suit": "Diamonds",
                        "rank": "4",
                        "nonce": 311
                    },
                    {
                        "suit": "Spades",
                        "rank": "Jack",
                        "nonce": 310
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Ace",
                        "nonce": 308
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 0,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            },
            {
                "name": "Blackjackzilla",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "10",
                        "nonce": 309
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 0,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            }
        ],
        "deckSize": 308,
        "deckSeed": "a957822fb76fd829d9c197a25c2545889989c2bdfd4c81bd4730e5fa745adbcb",
        "turn": "dealer",
        "gameStatus": "active",
        "gameEndStatus": "",
        "gameStats": {
            "turnsPlayed": 1,
            "playerTurnsPlayed": 1,
            "playerEndedTurn": true,
            "dealerTurnsPlayed": 0,
            "dealerEndedTurn": false,
            "winner": "",
            "playerScore": {
                "player": 15,
                "dealer": 10
            }
        }
    }
}
```

---

### 🎮 Get an existing game state

**GET** `/api/game/:id`  
Get an existing instance of a game by id. Refer to `/api/game/startGame` for obtaining the game id.

#### Request Body
```json

```

#### Response
```json
{
    "gameId": "88cfde81-b9a9-4167-a23c-9237a7669a7c",
    "state": {
        "gameId": "88cfde81-b9a9-4167-a23c-9237a7669a7c",
        "players": [
            {
                "name": "M",
                "type": "player",
                "hand": [
                    {
                        "suit": "Diamonds",
                        "rank": "4",
                        "nonce": 311
                    },
                    {
                        "suit": "Spades",
                        "rank": "Jack",
                        "nonce": 310
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Ace",
                        "nonce": 308
                    }
                ],
                "stats": {
                    "wins": 0,
                    "losses": 1,
                    "draws": 0,
                    "totalGames": 1,
                    "winPercentage": 0,
                    "highestWinStreak": 0,
                    "currentWinStreak": 0
                }
            },
            {
                "name": "Blackjackzilla",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "10",
                        "nonce": 309
                    },
                    {
                        "suit": "Clubs",
                        "rank": "8",
                        "nonce": 307
                    }
                ],
                "stats": {
                    "wins": 1,
                    "losses": 0,
                    "draws": 0,
                    "totalGames": 1,
                    "winPercentage": 100,
                    "highestWinStreak": 1,
                    "currentWinStreak": 1
                }
            }
        ],
        "deckSize": 307,
        "deckSeed": "a957822fb76fd829d9c197a25c2545889989c2bdfd4c81bd4730e5fa745adbcb",
        "turn": "player",
        "gameStatus": "completed",
        "gameEndStatus": "highScore",
        "gameStats": {
            "turnsPlayed": 2,
            "playerTurnsPlayed": 1,
            "playerEndedTurn": true,
            "dealerTurnsPlayed": 1,
            "dealerEndedTurn": true,
            "winner": "dealer",
            "playerScore": {
                "player": 15,
                "dealer": 18
            }
        }
    }
}
```

---

## 🧪 Example cURL to create a game

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{"playerData":[{"playerName":"Marius","type":"player"}, {"playerName":"Ace Dealer Bot","type":"dealer"}]}'
```

---

## 📝 License

MIT © [Marius Royale](https://github.com/mariusroyale)