import { Leaderboards } from "../../models/Leaderboards"
import { createHash, randomUUID  } from "crypto"
import { v4 as uuidv4 } from 'uuid'
import { pgPool } from "../../db/pgPool"

describe.skip("Leaderboards integration test", () => {
    let testPlayerName = `Marius_${randomUUID().slice(0, 8)}`

    afterAll(async () => {
        // await pgPool.query(`DELETE FROM leaderboards WHERE player_name = '${testPlayerName}'`)
        await pgPool.end()
    })

    test("should save and retrieve leaderboard data", async () => {
        const leaderboardDefaults = {
            id: undefined,
            playerId: createHash("sha256").update(testPlayerName).digest("hex"),
            playerName: testPlayerName,
            playerSessionId: uuidv4(),
            totalGames: Math.floor(Math.random() * 101) + 100,
            totalWinPoints: 1000,
            totalWins: Math.floor(Math.random() * 99) + 1,
            totalLosses: 0,
            highestWinStreak: 5,
            dateCreated: new Date(),
            winPercentage: 0,
        }

        leaderboardDefaults.totalLosses = leaderboardDefaults.totalGames - leaderboardDefaults.totalWins

        const leaderboards = new Leaderboards(leaderboardDefaults)

        const savedId = await leaderboards.saveToDatabase()
        expect(savedId).toBeDefined()

        const results = await leaderboards.getAllFromDatabase("week")
        expect(results).not.toBeNull()
        expect(Array.isArray(results)).toBe(true)

        const marius = results!.find(r => r.playerName === testPlayerName)
        
        expect(marius).toBeDefined()
        expect(marius!.playerId).toBe(leaderboardDefaults.playerId)
    })
})