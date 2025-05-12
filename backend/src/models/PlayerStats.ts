import { IPlayerStats } from "../interfaces/PlayerStats"

export class PlayerStats implements IPlayerStats {
    wins: number = 0
    losses: number = 0
    draws: number = 0
    totalGames: number = 0
    winPercentage: number = 0
    highestWinStreak: number = 0
    currentWinStreak: number = 0

    public recordWin(): void {
        this.wins++
        this.totalGames++
        this.currentWinStreak++
        
        if (this.currentWinStreak > this.highestWinStreak) {
            this.highestWinStreak = this.currentWinStreak
        }

        this.updateWinPercentage()
    }

    public recordLoss(): void {
        this.losses++
        this.totalGames++
        this.currentWinStreak = 0
        this.updateWinPercentage()
    }

    public recordDraw(): void {
        this.draws++
        this.totalGames++
        this.currentWinStreak = 0
        this.updateWinPercentage()
    }

    public updateWinPercentage(): void {
        if (this.totalGames <= 0) {
            return
        }

        this.winPercentage = parseFloat(((this.wins / this.totalGames) * 100).toFixed(2))
    }
    
    public resetStats(): void {
        this.wins = 0
        this.losses = 0
        this.draws = 0
        this.totalGames = 0
        this.winPercentage = 0
        this.highestWinStreak = 0
        this.currentWinStreak = 0
    }
}