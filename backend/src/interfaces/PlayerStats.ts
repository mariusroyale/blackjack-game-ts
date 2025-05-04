export interface IPlayerStats {
    wins: number;
    losses: number;
    draws: number;
    totalGames: number;
    winPercentage: number;
    highestWinStreak: number;
    currentWinStreak: number;

    recordWin(): void;
    recordLoss(): void;
    recordDraw(): void;
    updateWinPercentage(): void;
    resetStats(): void;
}