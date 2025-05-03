import React, { useState } from "react";
import "./App.css";

// Toggle mock mode
const USE_MOCK = false;

// Utility to draw a random card
const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function drawRandomCard() {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const value = VALUES[Math.floor(Math.random() * VALUES.length)];
  return { suit, value };
}

export default function App() {
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [nameError, setNameError] = useState(false);
  const dealerNames = [
    "Ace Dealer Bot",
    // "Queen of Clubs",
    // "Bot Vegas",
    // "CardMaster 9000",
    // "Dealertron",
    // "King of Spades",
    // "The Shuffle Machine",
    // "LuckyByte",
    // "Blackjackzilla",
    // "Neon Jack",
    // "Deala AI-47",
    // "The House Whisperer",
    // "VegasPulse",
    // "Quantum Dealer",
    // "Chips McBot",
    // "Croupier X",
    // "JackBot Royale",
    // "Shufflemancer",
    // "HighRollerX",
    // "The Algorithm",
    // "Mr. CardSharp",
    // "Bot Sinatra"
  ];

  const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://blackjack-game-ts.onrender.com"
  : "http://localhost:3000"; 

  const startGame = async () => {
    if (USE_MOCK) {
      // Create mock game state
      const playerHand = [drawRandomCard(), drawRandomCard()];
      const dealerHand = [drawRandomCard()];
      const mockGame = {
        id: "mock-" + Date.now(),
        player: { name: "Player1", type: "player" },
        dealer: { name: "DealerBot", type: "dealer" },
        playerHand,
        dealerHand,
        currentTurn: "player",
        status: "in_progress"
      };
      setGame(mockGame);
      setGameId(mockGame.id);
      return;
    }

    try {
      let currentDealerName = dealerName;

      if (!dealerName) {
        currentDealerName = dealerNames[Math.floor(Math.random() * dealerNames.length)];
        setDealerName(currentDealerName);
      }

      const res = await fetch(`${API_BASE_URL}/api/game/startGame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerData: [
            { playerName: playerName, type: "player" },
            { playerName: currentDealerName, type: "dealer" }
          ]
        })
      });

      if (!res.ok) {
        throw new Error("Failed to start game", await res.text());
      }

      const data = await res.json();
      setGame(data.state);
      setGameId(data.gameId);
    } catch (error) {
      console.error("Start game failed:", error.message);
    }
  };

  // Mock or real hit
  const hit = async (player) => {
    if (USE_MOCK) {
      const updatedGame = { ...game };
      updatedGame.playerHand = [...updatedGame.playerHand, drawRandomCard()];
      startGameMock(updatedGame);
      return;
    }

    if (game.gameStatus === "active") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/game/${gameId}/hit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerData: [
              { playerName: player.name, type: player.type }
            ]
          })
        });

        if (!res.ok) {
          throw new Error("Failed to send hit action: " + (await res.text()));
        }

        const data = await res.json();
        setGame(data.state);
        setGameId(data.gameId);
        
        if (data.state.gameStatus === "completed" && data.state.gameStats.winner !== '') {
          console.log(`Player ${data.state.gameStats.winner} won!`);
        } else if (data.state.gameStatus === "completed" && data.state.gameStats.winner === '') {
          console.log(`It is a draw!`);
        }
      } catch (error) {
        console.error("Hit action failed:", err.message);
      }
    } else {
      console.error("Game is not active.");
    }
  };

  // Mock or real stand
  const stand = async () => {
    if (USE_MOCK) {
      // For mock, dealer draws one card then ends game
      const updatedGame = { ...game };
      updatedGame.dealerHand = [...updatedGame.dealerHand, drawRandomCard(), drawRandomCard()];
      updatedGame.currentTurn = "dealer";
      updatedGame.status = "player_won"; // or compute outcome
      setGame(updatedGame);
      return;
    }

    if (game.gameStatus === "active") {

      const player = game?.players?.find(p => p.type === "player");
      const dealer = game?.players?.find(p => p.type === "dealer");

      if (!player) {
        console.error("No player found in game state.");
        return;
      }

      if (!dealer) {
        console.error("No dealer found in game state.");
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/game/${gameId}/stand`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerData: [
              { playerName: player.name, type: player.type }
            ]
          })
        });

        if (!res.ok) {
          throw new Error("Failed to send stand action: " + (await res.text()));
        }

        const data = await res.json();
        setGame(data.state);
        setGameId(data.gameId);

        if (data.state.gameStatus !== "completed") {
          // dealer hits now
          await hit(dealer);
        } else if (data.state.gameStatus === "completed" && data.state.gameStats.winner !== '') {
          console.log(`Player ${data.state.gameStats.winner} won!`);
        } else if (data.state.gameStatus === "completed" && data.state.gameStats.winner === '') {
          console.log(`It is a draw!`);
        }
      } catch (error) {
        console.error("Stand action failed:", err.message);
      }
    } else {
      console.error("Game is not active.");
    }
  };

  const resetGame = () => {
    setGame(null);   // Reset the game state
    setGameId(null); // Reset the gameId

    startGame();
  };

  const renderCards = (hand) =>
    hand.map((card, idx) => (
      <div
        key={idx}
        className="card deal-in"
        style={{
          color: card.suit === "Hearts" || card.suit === "Diamonds" ? "red" : "black",
          animationDelay: `${idx * 100}ms`, // staggered effect
        }}
      >
        <div className="card-value">
          {card.rank === "10" ? "10" : card.rank[0]}
        </div>
        <div className="card-suit">
          {{ Hearts: "♥", Diamonds: "♦", Clubs: "♣", Spades: "♠" }[card.suit]}
        </div>
      </div>
    ));

  const handleStartGame = () => {
    if (!playerName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    startGame(); // existing function
  };

  return (
    <div className="app">
      <h1>
        <span style={{ color: "black" }}>♠</span> Blackjack
      </h1>

      {!game && (
        <div className="player-name-entry">
          <h3>Enter your name to start</h3>
          
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              if (nameError) setNameError(false);
            }}
            placeholder="Your name"
            className={nameError ? "input-error" : ""}
          />
          
          <button onClick={handleStartGame}>Start Game</button>
        
          {nameError && (
            <div className="error-message">Your name is mandatory</div>
          )}
        </div>
      )}

      {game && (
        <div className="table">
          <div className="status-panel">
            <div className="status-item">
              <span className="status-label">Status</span>
              <span className={`status-badge status-${game.gameStatus}`}>
                {game.gameStatus}
              </span>
            </div>

            <div className="status-item">
              <span className="status-label">Winner</span>
              <span className="status-badge status-winner">
                {game.gameStats.winner || "—"}
              </span>
            </div>

            <div className="status-item">
              <span className="status-label">Reason</span>
              <span className="status-badge status-reason">
                {game.gameEndStatus || "—"}
              </span>
            </div>

            <div className="status-item">
              <span className="status-label">Turn</span>
              <span className="status-badge status-turn">
                {game.turn}
              </span>
            </div>
          </div>
          {game.gameStatus === "completed" && ( 
            <div className="winner-banner">
              {game.gameStats.winner === ""
                ? "Draw!"
                : `🎉 ${
                    game.gameStats.winner === "player"
                      ? playerName
                      : dealerName
                  } wins! 🎉`
              }
            </div>
          )}
          <div className="hands">
            <div className="hand">
              <h2>{game.players[1].name}</h2>
              <div className="cards">{renderCards(game.players[1].hand)}</div>
            </div>
            <div className="hand">
              <h2>{game.players[0].name}</h2>
              <div className="cards">{renderCards(game.players[0].hand)}</div>
            </div>
          </div>
          <div className="controls">
            {game.gameStatus !== "completed" && (
              <>
                <button onClick={() => hit(game.players[0])}>Hit</button>
                <button onClick={stand}>Stand</button>
              </>
            )}
            
            {game.gameStatus === "completed" && (
              <div className="new-game-button">
                <button onClick={resetGame}>Start New Game</button>
              </div>
            )}
            {/* <button disabled>Double</button>
            <button disabled>Split</button> */}
          </div>
        </div>
      )}
    </div>
  );
}
