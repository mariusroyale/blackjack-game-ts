import { GameService } from "../../services/GameService"
import { PlayerType } from "../../interfaces/Player"

describe('GameService', () => {
    let gameService: GameService
    let gameIdToTest: string
    const playerData = [
        { playerName: 'Player 1', type: 'player' as PlayerType },
        { playerName: 'Player 2', type: 'dealer' as PlayerType }
    ]

    beforeAll(() => {
        gameService = new GameService()
    })

    test('should create a game and return game id and game state', () => {
        const { gameId, state } = gameService.createGame(playerData)
        expect(gameId).toBeDefined()
        expect(gameId).not.toBeNull()
        expect(state).toBeDefined()
        expect(state.players.length).toBe(2)
        expect(state.deckSeed).not.toBeNull()
        expect(state.players[0].name).toBe('Player 1')
        gameIdToTest = gameId
    })

    test('should perform hit action', () => {
        const { gameId, state } = gameService.actionHit(gameIdToTest, playerData[0])!
        expect(gameId).toBeDefined()
        expect(gameId).not.toBeNull()
        expect(state).toBeDefined()
        expect(state.players.length).toBe(2)
        expect(state.deckSeed).not.toBeNull()
        expect(state.players[0].name).toBe('Player 1')
    })

    test('should perform stand action', () => {
        const { gameId, state } = gameService.actionStand(gameIdToTest, playerData[0])!
        expect(gameId).toBeDefined()
        expect(gameId).not.toBeNull()
        expect(state).toBeDefined()
        expect(state.players.length).toBe(2)
        expect(state.deckSeed).not.toBeNull()
        expect(state.players[0].name).toBe('Player 1')
    })

    test('should return game state', () => {
        const { gameId, state } = gameService.getGameState(gameIdToTest)!
        expect(state).toBeDefined()
        expect(gameId).toBeDefined()
        expect(gameId).toBe(gameIdToTest)
    })

    test('should return undefined for non-existing game', () => {
        const invalidGameId = '0-0-7'
        expect(() => gameService.getGameState(invalidGameId)).toThrow('Game not found')
    })
})