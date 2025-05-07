

export default function PlayerStats(player: any) {
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
}