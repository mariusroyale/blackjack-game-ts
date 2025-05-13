export type DateRangeTypes = 'week' | 'month'

export interface ILeaderboards {
    id: number | undefined
    playerId: string
    playerSessionId: string
    playerName: string
    totalGames: number
    totalWinPoints: number
    totalWins: number
    totalLosses: number
    highestWinStreak: number
    dateCreated: Date
    winPercentage: number
}