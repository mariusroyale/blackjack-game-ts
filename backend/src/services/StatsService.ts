import { ILeaderboards } from "../interfaces/Leaderboards"
import { IStatsService } from "../interfaces/StatsService"
import { DateRangeTypes } from "../interfaces/Leaderboards"
import { Leaderboards } from "../models/Leaderboards"

export class StatsService implements IStatsService {
    public leaderboards = new Map<string, ILeaderboards>()
    private dummyLeaderboardValues: ILeaderboards

    constructor() {
        this.dummyLeaderboardValues = {
            id: undefined,
            playerId: '',
            playerSessionId: '',
            playerName: '',
            totalGames: 0,
            totalWinPoints: 0,
            totalWins: 0,
            totalLosses: 0,
            highestWinStreak: 0,
            dateCreated: new Date(),
            winPercentage: 0
        }
    }

    public async getLeaderboards(dateRange: DateRangeTypes): Promise<ILeaderboards[] | null | undefined> {        
        try {
            const leaderboards = new Leaderboards(this.dummyLeaderboardValues)

            const result = await leaderboards.getAllFromDatabase(dateRange)

            if (!result) {
                console.log('No leaderboards found')
            }

            return result
        } catch (error) {
            console.log(error)
        }
    }

    public async addStatsToLeaderboards(data: ILeaderboards): Promise<number | undefined> {
        try {
            const leaderboards = new Leaderboards(data)
            const resultId = await leaderboards.saveToDatabase()

            if (!resultId) {
                throw new Error("Failed to save leaderboard to database")
            }
            
            return resultId
        } catch (error) {
            console.log(error)
        }
    }
}