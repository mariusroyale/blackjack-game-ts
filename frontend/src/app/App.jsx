import { useState, useEffect, useRef } from "react";
import "../styles/modern/App.css";
import { getRandomDealerName } from '../shared/utils/getRandomDealerName';
import SaveStatsPopup from './components/SaveStatsPopUp';
import ToggleSwitch from "./components/ToggleSwitch";
import NavBar from './components/NavBar';


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
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimeoutRef = useRef(null);
  const loadingInProgress = useRef(false);
  const [fadeOutCards, setFadeOutCards] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

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
        currentDealerName = getRandomDealerName();
        setDealerName(currentDealerName);
      }

      const res = await fetch(`${API_BASE_URL}/api/games`, {
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
    } finally {
      clearLoadingScreen();
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
        initiateLoadingScreen();
        const res = await fetch(`${API_BASE_URL}/api/games/${gameId}/hit`, {
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
      } finally {
        clearLoadingScreen();
      }
    } else {
      console.error("Game is not active.");
    }
  };

  async function saveStatsToDB() {
    try {

      console.log(getPlayerData());
      const player = getPlayerData();

      const playerSessionStats = {
        playerId: player.id,
        playerSessionId: player.gameSessionId,
        playerName: player.name,
        totalGames: player.stats.totalGames,
        totalWinPoints: player.stats.winPoints,
        totalWins: player.stats.wins,
        totalLosses: player.stats.losses,
        highestWinStreak: player.stats.highestWinStreak,
        dateCreated: player.stats.dateCreated,
        winPercentage: player.stats.winPercentage,
      };

      // get stats ready
      const response = await fetch(`${API_BASE_URL}/api/leaderboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerSessionStats),
      });

      if (!response.ok) {
        throw new Error('Failed to save stats');
      }

      setShowPopup(false);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  useEffect(() => {
    if (game?.gameStatus === "completed") {
      if (autoSave) {
        // TODO: auto save in batches of 5 -- revisit this, currently, it will save stats with each turn
        if (true || game.gameStats.totalGames % 5 === 0) {
          console.log('Auto saving stats...');
          saveStatsToDB(); // auto save
        }
      } else {
        setShowPopup(false); // show prompt
      }
    }
  }, [game?.gameStatus]);

  // Mock or real stand
  const stand = async () => {
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
        initiateLoadingScreen();
        const res = await fetch(`${API_BASE_URL}/api/games/${gameId}/stand`, {
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
      } finally {
        clearLoadingScreen();
      }
    } else {
      console.error("Game is not active.");
    }
  };

  const resetGame = () => {
    // setFadeOutCards(true);
    
    // Clear winner properly by cloning and updating state
    setGame(prevGame => ({
      ...prevGame,
      gameStats: {
        ...prevGame.gameStats,
        winner: ''
      }
    }))

    // Reset player hands after fadeout
    setGame(prevGame => ({
      ...prevGame,
      players: prevGame.players.map(player => ({
        ...player,
        hand: []
      }))
    }))

    startGame()
  
    // setTimeout(() => {
    //   setFadeOutCards(false);
    // }, 100);
  };

  const renderCards = (hand, fadeOut = false) =>
    hand.map((card, idx) => {
      const cardColor = card.suit === "Hearts" || card.suit === "Diamonds" ? "red" : "black";
      const suitClass = cardColor === "red" ? "card-red-suit" : "card-black-suit";
  
      return (
        <div
          key={idx}
          className="card-wrapper"
          style={{
            left: `${idx * 30}px`,
            zIndex: idx,
          }}
        >
          <div
            className={`card deal-in ${suitClass} ${fadeOut ? 'card-fade-out' : ''}`}
            style={{
              color: cardColor,
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <div className="card-value">
              {card.rank === "10" ? "10" : card.rank[0]}
            </div>
            <div className="card-suit">
              {{
                Hearts: "♥",
                Diamonds: "♦",
                Clubs: "♣",
                Spades: "♠",
              }[card.suit]}
            </div>
          </div>
        </div>
      );
    });
  

  const handleStartGame = () => {
    if (!playerName.trim()) {
      setNameError(true);
      return;
    }

    initiateLoadingScreen();
    setNameError(false);
    startGame(); // existing function
  };

  const handleGameCompletion = () => {
    // Update the game status to 'completed'
    setGame((prevGame) => ({
      ...prevGame,
      gameStatus: 'completed',
    }));

    // Show the popup
    setShowPopup(true);
  };

  const initiateLoadingScreen = () => {
    if (loadingInProgress.current) {
      return;
    }

    loadingInProgress.current = true;

    setLoading(true);
    spinnerTimeoutRef.current = setTimeout(() => {
      setShowSpinner(true);
    }, 500);
  }

  const clearLoadingScreen = () => {
    if (spinnerTimeoutRef.current) {
      clearTimeout(spinnerTimeoutRef.current);
    }
    
    setLoading(false);
    setShowSpinner(false);
    loadingInProgress.current = false;
  }

  const ThemeSelector = () => {
    return null;
    const [isDark, setIsDark] = useState(() => {
      // Read from localStorage on initial load
      const saved = localStorage.getItem("theme");
      
      if (saved) {
        return saved === "dark";
      }
      
      // Default to current DOM state
      return document.body.classList.contains("dark-theme");
    });

    useEffect(() => {
      if (isDark) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
      }
    }, [isDark]);

    return (
      <div className="theme-selector">
        <div
          className={`theme-box light ${!isDark ? "selected" : ""}`}
          onClick={() => setIsDark(false)}
          title="Light Theme"
        ></div>
        <div
          className={`theme-box dark ${isDark ? "selected" : ""}`}
          onClick={() => setIsDark(true)}
          title="Dark Theme"
        ></div>
      </div>
    );
  }


  const getPlayerData = () => {
    if (!game) {
      return null;
    }

    const player = game.players.find((player) => player.name === playerName);
    
    return player;    
  }

  const getPlayerStats = (player) => {
    if (!player.stats) {
      return null;
    }
  
    return (
      <div className="stats">
        <div className="stats-item">
          <span>🏆Wins</span>
          <span>{player.stats.wins}</span>
        </div>
        <div className="stats-item">
          <span>🎮Total Games</span>
          <span>{player.stats.totalGames}</span>
        </div>
        <div className="stats-item">
          <span>📊 Win %</span>
          <span>{player.stats.winPercentage}</span>
        </div>
        {/* <div className="stats-item">
          <span>🔥 Highest Win Streak</span>
          <span>{player.stats.highestWinStreak}</span>
        </div>
        <div className="stats-item">
          <span>📈 Current Win Streak</span>
          <span>{player.stats.currentWinStreak}</span>
        </div> */}
      </div>
    );
  };

  return (
    <>
    <NavBar />
    <div className="app">
      <ThemeSelector />
      <h1>
        <span style={{ color: "black" }}>♠ Blackjack</span> 
      </h1>

      {!game && (
        <div className="player-name-entry">
          <div className="name-input-wrapper">
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                if (nameError) setNameError(false);
              }}
              placeholder="Enter your name to start"
              className={nameError ? "input-error" : ""}
            />
            <button className="card-logo-button" onClick={handleStartGame}>
              🂡 Start
            </button>
          </div>
        </div>
      )}

      {showSpinner && (
        <div className="overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Dealing out some fun...</p>
          </div>
        </div>
      )}

      {game && (
        <div className="table">
          {/* <div className="deck-area">
            <div className="deck-back"></div>
          </div> */}
          <div className="status-panel">
            <div className="status-item">
              <span className="status-label">Status</span>
              <span className={`status-badge status-${game.gameStatus}`}>
                {game.gameStatus}
              </span>
            </div>

            {/* <div className="status-item">
              <span className="status-label">Winner</span>
              <span className="status-badge status-winner">
                {game.gameStats.winner || "—"}
              </span>
            </div> */}

            <div className="status-item">
              <span className="status-label">State</span>
              <span className="status-badge status-reason">
                {game.gameEndStatus || "—"}
              </span>
            </div>

            {/* <div className="status-item">
              <span className="status-label">Turn</span>
              <span className="status-badge status-turn">
                {game.turn}
              </span>
            </div> */}
            <div className="status-item">
              <span className="status-label">Auto-Save Stats</span>
              <ToggleSwitch
                isOn={autoSave}
                handleToggle={() => setAutoSave((prev) => !prev)}
              />
            </div>
          </div>
          {/* {game.gameStatus === "completed" && ( 
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
          )} */}

          

          <div className="hands">
            <div className="hand">
            <h2
              className={
                game.gameStatus === "completed" && game.gameStats.winner === game.players[1].type
                  ? "winner-highlight"
                  : ""
              }
            >
              {game.turn === "dealer" && game.gameStatus !== "completed" && (
                <span className="turn-arrow">➤ </span>
              )}{game.players[1].name}
              {game.gameStatus === "completed" && game.gameStats.winner === game.players[1].type && " Wins!🏆"}
            </h2>
              <div className="cards">{renderCards(game.players[1].hand, fadeOutCards)}</div>
              {/* {getPlayerStats(game.players[1])} */}
            </div>
            <div className="hand">
            <h2
              className={
                game.gameStatus === "completed" && game.gameStats.winner === game.players[0].type
                  ? "winner-highlight"
                  : ""
              }
            >
              {game.turn === "player" && game.gameStatus !== "completed" && (
                <span className="turn-arrow">➤ </span>
              )}{game.players[0].name}
              {game.gameStatus === "completed" && game.gameStats.winner === game.players[0].type && " Wins! 🏆"}
            </h2>
              <div className="cards">{renderCards(game.players[0].hand, fadeOutCards)}</div>
              <div className="controls">
                {game.gameStatus !== "completed" && (
                  <>
                    <button className="retro-button" onClick={() => hit(game.players[0])}>Hit</button>
                    <span> 🎲 </span>
                    <button className="retro-button" onClick={stand}>Stand</button>
                  </>
                )}
                
                {game.gameStatus === "completed" && (
                  <>
                    <div>
                      <button className="retro-button" onClick={resetGame}>Start New Game</button>
                    </div>
                    <SaveStatsPopup
                      visible={showPopup}
                      onSave={saveStatsToDB}
                      onClose={() => setShowPopup(false)}
                    />
                  </>
                )}
                {/* <button disabled>Double</button>
                <button disabled>Split</button> */}
              </div>
              {getPlayerStats(game.players[0])}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
