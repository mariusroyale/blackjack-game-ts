export type GameStateProps = {
    game: {
        gameId: string,
        players: {
            name: string,
            type: string,
            hand: {
                suit: string,
                rank: string,
                nonce: number | null,
            },
            stats: {
                wins: number,
                losses: number,
                draws: number,
                totalGames: number,
                winPercentage: number,
                highestWinStreak: number,
                currentWinStreak: number
            }
        },
        deckSize: number,
        deckSeed: string,
        gameStatus: string,
        gameEndStatus: string,
        turn: string,
        gameStats: {
            turnsPlayed: number,
            playerTurnsPlayed: number,
            playerEndedTurn: boolean,
            dealerTurnsPlayed: number,
            dealerEndedTurn: boolean,
            winner: string,
            playerScore: {
                player: number,
                dealer: number
            }
        }
    }
}

export default function GameState({ game }: GameStateProps ) {
    return (
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
    );
}