# ♠️ Blackjack Game (TypeScript + Express)

[![Backend Tests](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/backend-tests.yml) [![Frontend Tests](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/mariusroyale/blackjack-game-ts/actions/workflows/frontend-tests.yml)

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
    "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
    "state": {
        "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
        "players": [
            {
                "name": "marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Hearts",
                        "rank": "3",
                        "nonce": 308,
                        "id": "a93630b5-89f2-4dbd-9f63-96aa0f00e420"
                    },
                    {
                        "suit": "Spades",
                        "rank": "King",
                        "nonce": 307,
                        "id": "3f403a99-4c0b-4216-b52e-b07ddb29288e"
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
                },
                "id": "5b39bfccb1447d4aae30e7a4fb0f4ba37e79ea96ec54b5ba7223979a15e4d0ae",
                "gameSessionId": "cef072b9-f38d-40df-864f-47b29257777a"
            },
            {
                "name": "JackBot Royale",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Spades",
                        "rank": "9",
                        "nonce": 306,
                        "id": "150b46e9-5c1d-4be8-badb-37655e600451"
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
                },
                "id": "a18177fb3849d47a0f495ba85f59d2fa019ecd5666d10438f239b7db1b7ed15f",
                "gameSessionId": "55380701-1884-4fbe-a346-022d4fd6ccbc"
            }
        ],
        "deckSize": 306,
        "deckSeed": "7f9646496a768b2cb2a9bddc6fe1d359d98f4a5db4f007f2c5ee61535d187501",
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
                "player": 13,
                "dealer": 9
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
    "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
    "state": {
        "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
        "players": [
            {
                "name": "marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Hearts",
                        "rank": "3",
                        "nonce": 308,
                        "id": "a93630b5-89f2-4dbd-9f63-96aa0f00e420"
                    },
                    {
                        "suit": "Spades",
                        "rank": "King",
                        "nonce": 307,
                        "id": "3f403a99-4c0b-4216-b52e-b07ddb29288e"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "8",
                        "nonce": 305,
                        "id": "761306ff-7620-4399-b51f-fc5b6c90915d"
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
                },
                "id": "5b39bfccb1447d4aae30e7a4fb0f4ba37e79ea96ec54b5ba7223979a15e4d0ae",
                "gameSessionId": "cef072b9-f38d-40df-864f-47b29257777a"
            },
            {
                "name": "JackBot Royale",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Spades",
                        "rank": "9",
                        "nonce": 306,
                        "id": "150b46e9-5c1d-4be8-badb-37655e600451"
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
                },
                "id": "a18177fb3849d47a0f495ba85f59d2fa019ecd5666d10438f239b7db1b7ed15f",
                "gameSessionId": "55380701-1884-4fbe-a346-022d4fd6ccbc"
            }
        ],
        "deckSize": 305,
        "deckSeed": "7f9646496a768b2cb2a9bddc6fe1d359d98f4a5db4f007f2c5ee61535d187501",
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
                "player": 21,
                "dealer": 9
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
    "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
    "state": {
        "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
        "players": [
            {
                "name": "marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Hearts",
                        "rank": "3",
                        "nonce": 308,
                        "id": "a93630b5-89f2-4dbd-9f63-96aa0f00e420"
                    },
                    {
                        "suit": "Spades",
                        "rank": "King",
                        "nonce": 307,
                        "id": "3f403a99-4c0b-4216-b52e-b07ddb29288e"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "8",
                        "nonce": 305,
                        "id": "761306ff-7620-4399-b51f-fc5b6c90915d"
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
                },
                "id": "5b39bfccb1447d4aae30e7a4fb0f4ba37e79ea96ec54b5ba7223979a15e4d0ae",
                "gameSessionId": "cef072b9-f38d-40df-864f-47b29257777a"
            },
            {
                "name": "JackBot Royale",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Spades",
                        "rank": "9",
                        "nonce": 306,
                        "id": "150b46e9-5c1d-4be8-badb-37655e600451"
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
                },
                "id": "a18177fb3849d47a0f495ba85f59d2fa019ecd5666d10438f239b7db1b7ed15f",
                "gameSessionId": "55380701-1884-4fbe-a346-022d4fd6ccbc"
            }
        ],
        "deckSize": 305,
        "deckSeed": "7f9646496a768b2cb2a9bddc6fe1d359d98f4a5db4f007f2c5ee61535d187501",
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
                "player": 21,
                "dealer": 9
            }
        }
    }
}
```

---

### 🎮 Get an existing game state

**GET** `/api/games/:id`  
Get an existing instance of a game by id. Refer to `/api/games` for obtaining the game id.

#### Request Body
```json

```

#### Response
```json
{
    "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
    "state": {
        "gameId": "e625533b-5889-403c-9103-adc9d7311c88",
        "players": [
            {
                "name": "marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Hearts",
                        "rank": "3",
                        "nonce": 308,
                        "id": "a93630b5-89f2-4dbd-9f63-96aa0f00e420"
                    },
                    {
                        "suit": "Spades",
                        "rank": "King",
                        "nonce": 307,
                        "id": "3f403a99-4c0b-4216-b52e-b07ddb29288e"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "8",
                        "nonce": 305,
                        "id": "761306ff-7620-4399-b51f-fc5b6c90915d"
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
                },
                "id": "5b39bfccb1447d4aae30e7a4fb0f4ba37e79ea96ec54b5ba7223979a15e4d0ae",
                "gameSessionId": "cef072b9-f38d-40df-864f-47b29257777a"
            },
            {
                "name": "JackBot Royale",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Spades",
                        "rank": "9",
                        "nonce": 306,
                        "id": "150b46e9-5c1d-4be8-badb-37655e600451"
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
                },
                "id": "a18177fb3849d47a0f495ba85f59d2fa019ecd5666d10438f239b7db1b7ed15f",
                "gameSessionId": "55380701-1884-4fbe-a346-022d4fd6ccbc"
            }
        ],
        "deckSize": 305,
        "deckSeed": "7f9646496a768b2cb2a9bddc6fe1d359d98f4a5db4f007f2c5ee61535d187501",
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
                "player": 21,
                "dealer": 9
            }
        }
    }
}
```

---

### 🤚 Stand

**GET** `/api/leaderboards`  
Fetch all players from the leaderboards in the past week (LIMIT to be implemented).

TODO: player game session id will be added soon!

#### Request Body
```json
{
    "dateRange": "week",
}
```

#### Response
```json
[
    {
        "playerName": "Marius_9cc9d10d",
        "totalGames": "190",
        "totalWinPoints": "1000",
        "totalWins": "26",
        "totalLosses": "164",
        "highestWinStreak": 5,
        "dateCreated": "2025-05-12T18:01:54.921Z",
        "winPercentage": "13.68",
        "playerId": "cc42708f549e46a123827bac7dab20d792aad05b20a8c33a1d9189ac7bab49cc"
    },
    {
        "playerName": "Marius_c7ee0098",
        "totalGames": "122",
        "totalWinPoints": "1000",
        "totalWins": "74",
        "totalLosses": "48",
        "highestWinStreak": 5,
        "dateCreated": "2025-05-12T18:00:49.934Z",
        "winPercentage": "60.66",
        "playerId": "20411a2ab2c5cdcb8c888d106db1aec2215f3cf01c04d44855241b33287290f8"
    },
    {
        "playerName": "Marius",
        "totalGames": "923",
        "totalWinPoints": "7000",
        "totalWins": "384",
        "totalLosses": "539",
        "highestWinStreak": 5,
        "dateCreated": "2025-05-12T02:57:50.275Z",
        "winPercentage": "41.60",
        "playerId": "f115f284ba8ff17d061edb8751ae2eae093b1a53cea7cc5e82b1c6a0aed96f47"
    },
    {
        "playerName": "Marius_c7ff8609",
        "totalGames": "187",
        "totalWinPoints": "1000",
        "totalWins": "95",
        "totalLosses": "92",
        "highestWinStreak": 5,
        "dateCreated": "2025-05-12T18:01:23.044Z",
        "winPercentage": "50.80",
        "playerId": "bdbe825d2bf7f41a67447b9913981b78174d0fab369bcf50245c010173d9e601"
    }
]
```

---

### 🤚 Stand

**POST** `/api/leaderboards`  
Save a leaderboards tracking event in database.

#### Request Body
```json
{
    "name": "marius",
    "type": "player",
    "hand": [
        {
            "suit": "Hearts",
            "rank": "3",
            "nonce": 308,
            "id": "a93630b5-89f2-4dbd-9f63-96aa0f00e420"
        },
        {
            "suit": "Spades",
            "rank": "King",
            "nonce": 307,
            "id": "3f403a99-4c0b-4216-b52e-b07ddb29288e"
        },
        {
            "suit": "Diamonds",
            "rank": "8",
            "nonce": 305,
            "id": "761306ff-7620-4399-b51f-fc5b6c90915d"
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
    },
    "id": "5b39bfccb1447d4aae30e7a4fb0f4ba37e79ea96ec54b5ba7223979a15e4d0ae",
    "gameSessionId": "cef072b9-f38d-40df-864f-47b29257777a"
}
```

#### Response
```json
{ leaderboardsId: 1 } 
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