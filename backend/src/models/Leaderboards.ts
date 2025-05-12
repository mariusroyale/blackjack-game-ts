import { ILeaderboards, DateRangeTypes } from "../interfaces/Leaderboards"
import { pgPool } from "../db/pgPool"
import { createHash } from 'crypto'


export class Leaderboards implements ILeaderboards {
    public id: number | undefined
    public playerId: string
    public playerName: string
    public totalGames: number
    public totalWinPoints: number
    public totalWins: number
    public totalLosses: number
    public winPercentage: number
    public highestWinStreak: number
    public dateCreated: Date

    public constructor({ id, playerId, playerName, totalGames, totalWinPoints, totalWins, totalLosses, highestWinStreak, dateCreated, winPercentage }: ILeaderboards) {
        this.id = id
        this.playerId = playerId
        this.playerName = playerName
        this.totalGames = totalGames
        this.totalWinPoints = totalWinPoints
        this.totalWins = totalWins
        this.totalLosses = totalLosses
        this.highestWinStreak = highestWinStreak
        this.dateCreated = dateCreated
        this.winPercentage = winPercentage
    }

    public async saveToDatabase(): Promise<number | undefined> {
        try {
            const result = await pgPool.query(`INSERT INTO leaderboards (player_id, player_name, total_games, total_win_points, total_wins, total_losses, highest_win_streak, date_created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [
                this.playerId,
                this.playerName,
                this.totalGames,
                this.totalWinPoints,
                this.totalWins,
                this.totalLosses,
                this.highestWinStreak,
                this.dateCreated
            ])

            if (!result || !result.rows.length) {
                throw new Error("Failed to save leaderboard to database")
            }

            this.id = result.rows[0].id

            // return id
            return this.id
        } catch (error) {
            console.log(error)
        }
    }

    public async getAllFromDatabase(dateRange: DateRangeTypes): Promise<ILeaderboards[] | null> {

        try {
            const results = await pgPool.query(`SELECT * FROM leaderboards_view_${dateRange}`)

            if (!results || !results.rows.length) {
                return null
            }

            const data = results.rows.map(row => new Leaderboards({
                id: row.id, 
                playerId: row.player_id, 
                playerName: row.player_name, 
                totalGames: row.total_games, 
                totalWinPoints: row.total_win_points, 
                totalWins: row.total_wins, 
                totalLosses: row.total_losses,
                highestWinStreak: row.highest_win_streak, 
                dateCreated: row.date_created,
                winPercentage: row.win_percentage
            }))

            // return data
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }
}