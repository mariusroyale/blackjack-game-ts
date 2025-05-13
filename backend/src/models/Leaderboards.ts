import { ILeaderboards, DateRangeTypes } from "../interfaces/Leaderboards"
import { pgPool } from "../db/pgPool"
import { createHash } from 'crypto'


export class Leaderboards implements ILeaderboards {
    public id: number | undefined
    public playerId: string
    public playerSessionId: string
    public playerName: string
    public totalGames: number
    public totalWinPoints: number
    public totalWins: number
    public totalLosses: number
    public winPercentage: number
    public highestWinStreak: number
    public dateCreated: Date

    /**
     * Creates a new instance of the Leaderboards class with the given data. If playerId is not provided, it is generated based on the playerName.
     * @param {ILeaderboards} data - The data to initialize the instance with.
     */
    public constructor({ id, playerId, playerSessionId, playerName, totalGames, totalWinPoints, totalWins, totalLosses, highestWinStreak, dateCreated, winPercentage }: ILeaderboards) {
        this.id = id
        this.playerSessionId = playerSessionId
        this.playerName = playerName
        this.totalGames = totalGames
        this.totalWinPoints = totalWinPoints
        this.totalWins = totalWins
        this.totalLosses = totalLosses
        this.highestWinStreak = highestWinStreak
        this.dateCreated = dateCreated || new Date()
        this.winPercentage = winPercentage

        this.playerId = playerId || this.generatePlayerIdHash(this.playerName)
    }

    /**
     * Saves the leaderboard data to the database and returns the id of the newly inserted record. If the save fails, it returns undefined.
     * @returns {Promise<number | undefined>}
     */
    public async saveToDatabase(): Promise<number | undefined> {
        try {
            const result = await pgPool.query(
                `
                INSERT INTO leaderboards (
                player_id, 
                player_game_session_id, 
                player_name, 
                total_games, 
                total_win_points, 
                total_wins, 
                total_losses, 
                highest_win_streak, 
                date_created
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (player_game_session_id)
                DO UPDATE SET
                    player_id = EXCLUDED.player_id,
                    player_name = EXCLUDED.player_name,
                    total_games = EXCLUDED.total_games,
                    total_win_points = EXCLUDED.total_win_points,
                    total_wins = EXCLUDED.total_wins,
                    total_losses = EXCLUDED.total_losses,
                    highest_win_streak = EXCLUDED.highest_win_streak,
                    date_created = LEAST(leaderboards.date_created, EXCLUDED.date_created)
                RETURNING id           
                `, [
                this.playerId,
                this.playerSessionId,
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

    /**
     * Retrieves all leaderboard data from the database for the given date range.
     * @param {DateRangeTypes} dateRange - The date range for which to retrieve leaderboard data. Options are "week" or "month".
     * @returns {Promise<ILeaderboards[] | null>} - A promise that resolves to an array of leaderboard objects, or null if there was an error.
     */
    public async getAllFromDatabase(dateRange: DateRangeTypes): Promise<ILeaderboards[] | null> {

        try {
            const results = await pgPool.query(`SELECT * FROM leaderboards_view_${dateRange}`)

            if (!results || !results.rows.length) {
                return null
            }

            const data = results.rows.map(row => new Leaderboards({
                id: row.id, 
                playerId: row.player_id,
                playerSessionId: row.player_session_id, 
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

    /**
     * Generates a SHA-256 hash based on a player's name, after trimming the name.
     * This hash is used as a unique identifier for a player in the database.
     * NOTE! Player name will be case sensitive, hence two players with same name but different cases will be treated as different players
     * @param {string} playerName the name of the player
     * @returns {string} a SHA-256 hash of the player's name
     */
    private generatePlayerIdHash(playerName: string): string {
        return createHash('sha256').update(playerName.trim()).digest('hex')
    }
}