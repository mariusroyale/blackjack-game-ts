# ♠️ Blackjack Game (TypeScript + Express)

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

---

## ⚙️ Requirements

- Node.js (v22+ recommended)
- npm

---

## 📦 Tech Stack

| Tool        | Version   |
|-------------|-----------|
| TypeScript  | ^5.4.5    |
| Express     | ^4.18.2   |
| Node        | ^18.x     |

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

**POST** `/api/game/startGame`  
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
                        "rank": "9"
                    },
                    {
                        "suit": "Clubs",
                        "rank": "Ace"
                    }
                ]
            },
            {
                "name": "Ace Dealer Bot",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "8"
                    }
                ]
            }
        ],
        "deckSize": 49,
        "turn": "player",
        "gameStatus": "active"
    }
}
```

---

### ✋ Hit

**POST** `/api/game/:id/hit`  
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
                "name": "Marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Diamonds",
                        "rank": "9"
                    },
                    {
                        "suit": "Clubs",
                        "rank": "Ace"
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Queen"
                    }
                ]
            },
            {
                "name": "Ace Dealer Bot",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "8"
                    }
                ]
            }
        ],
        "deckSize": 48,
        "turn": "dealer",
        "gameStatus": "active"
    }
}
```

---

### 🤚 Stand

**POST** `/api/game/:id/stand`  
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
                "name": "Marius",
                "type": "player",
                "hand": [
                    {
                        "suit": "Diamonds",
                        "rank": "9"
                    },
                    {
                        "suit": "Clubs",
                        "rank": "Ace"
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Queen"
                    }
                ]
            },
            {
                "name": "Ace Dealer Bot",
                "type": "dealer",
                "hand": [
                    {
                        "suit": "Clubs",
                        "rank": "8"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "6"
                    },
                    {
                        "suit": "Spades",
                        "rank": "Ace"
                    }
                ]
            }
        ],
        "deckSize": 46,
        "turn": "player",
        "gameStatus": "finished"
    }
}
```

---

## 🧪 Example cURL to create a game

```bash
curl -X POST http://localhost:3000/api/game/startGame \
  -H "Content-Type: application/json" \
  -d '{"playerData":[{"playerName":"Marius","type":"player"}, {"playerName":"Ace Dealer Bot","type":"dealer"}]}'
```

---

## 📝 License

MIT © [Marius Royale](https://github.com/mariusroyale)
