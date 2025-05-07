import { useState, useEffect, useRef } from "react";
import { getRandomDealerName } from "../../shared/utils/getRandomDealerName";
import LoadingSpinner from "../../shared/components/loadingSpinner";
import ThemeSelector from "./themeSelector";
import GameState from "./gameState";

// Utility to draw a random card
const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default function Game() {
    const [game, setGame] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [dealerName, setDealerName] = useState("");
    const [showBanner, setShowBanner] = useState(true);
    const [nameError, setNameError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const loadingInProgress = useRef(false);
    const [fadeOutCards, setFadeOutCards] = useState(false);

    const API_BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://blackjack-game-ts.onrender.com"
    : "http://localhost:3000";

    const handleStartGame = () => {
        if (!playerName.trim()) {
          setNameError(true);
          return;
        }
    
        initiateLoadingScreen();
        setNameError(false);
        startGame(); // existing function
      };

    const startGame = async () => {
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
            throw new Error(`Failed to start game ${await res.text()}`);
        }
    
        const data = await res.json();
        setGame(data.state);
        setGameId(data.gameId);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Start game failed:", error.message);
            } else {
                console.error("Start game failed:", error);
            }
        } finally {
        clearLoadingScreen();
        }
    };

    const clearLoadingScreen = () => {
        if (spinnerTimeoutRef.current) {
            clearTimeout(spinnerTimeoutRef.current);
        }
        
        setLoading(false);
        setShowSpinner(false);
        loadingInProgress.current = false;
    }
        
    
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

    return (
        <div className="app">
            <ThemeSelector />
            
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

            {showSpinner && (
                // Show loading spinner
                <LoadingSpinner />
            )}

            {game && ( 
                <div className="table">
                    <GameState game={game} />
                    {
                        // Player Hand Component
                        // Player Stats are inside Player Hand Component
                    }
                </div>
            )}
        </div>
    );
}