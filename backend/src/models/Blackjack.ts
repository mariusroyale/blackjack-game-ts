import { IGame, GameTurn, GameStatus, GameEndStatus } from "../interfaces/Game"
import { IPlayer } from "../interfaces/Player"
import { PlayerType } from "../interfaces/Player"
import { ICard, Suit, Rank } from "../interfaces/Card"
import { CardRank } from "./Card"
import { IGameState } from "../interfaces/GameState"
import { IGameStats } from "../interfaces/GameStats"
import { IDeck } from "../interfaces/Deck"
import { Card } from "./Card"
import { v4 as uuidv4 } from 'uuid'
import { Deck } from "./Deck"

export class Blackjack implements IGame {
    public gameId: string
    public players: IPlayer[] = []
    public deck: IDeck
    public turn: GameTurn
    public gameStatus: GameStatus
    public gameEndStatus: GameEndStatus
    public gameStats: IGameStats

    constructor(deck: IDeck) {
        this.gameId = uuidv4()
        this.deck = deck
        this.turn = 'player'
        this.gameStatus = 'active'
        this.gameEndStatus = ''
        this.gameStats = {
            turnsPlayed: 0,
            playerTurnsPlayed: 0,
            playerEndedTurn: false,
            dealerTurnsPlayed: 0,
            dealerEndedTurn: false,
            winner: '',
            playerScore: {
                player: 0,
                dealer: 0
            }
        }
    }

    public startGame(): void {
         // deal initial cards
         this.dealInitialCards()
    }

    public getGameId(): string {
        return this.gameId
    }

    private setDeckSize(): void {
        this.deck.setDeckSize()
    }

    public dealInitialCards(): void {
        if (!this.deck) {
            return
        }

        this.players.forEach(player => {
            this.drawCard(player)
            if (player.type === 'player') {
                this.drawCard(player)
            }

            // update the score
            this.updatePlayerScore(player)
        })

        this.setDeckSize()
    }

    public addPlayer(player: IPlayer): void {
        this.players.push(player)
    }

    public getPlayers(): IPlayer[] {
        return this.players
    }

    public getPlayerStateByName(playerName: string, playerType: PlayerType): IPlayer | null {

        const players = this.getPlayers()
        const player = players.find(player => player.getName() === playerName && player.getType() === playerType)

        if (!player) {
            return null
        }
        
        return player
    }

    public getPlayerByType(playerType: PlayerType): IPlayer | null {
        const players = this.getPlayers()
        const player = players.find(player => player.getType() === playerType)

        if (!player) {
            return null
        }
        
        return player
    }

    public hit(player: IPlayer): void {
        this.drawCard(player)
        this.updatePlayerScore(player)
        this.setDeckSize()
    }

    public stand(player: IPlayer): void {
        this.playerEndTurn(player)
    }

    private drawCard(player: IPlayer): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty')
        }
        
        const deck = this.deck.getDeck()
        const card = deck.pop()

        if (card) {
            player.addCard(card)
        } else {
            throw new Error('Deck ran out of cards while dealing.')
        }
    }

    public getState(): IGameState {
        return {
            gameId: this.gameId,
            players: this.players,
            deckSize: this.deck.getDeckSize(),
            deckSeed: this.deck.getDeckSeedHash(),
            turn: this.turn,
            gameStatus: this.gameStatus,
            gameEndStatus: this.gameEndStatus,
            gameStats: this.gameStats
        }
    }
    
    private calculateCardPoints(cards: ICard[]): number {
        let points = 0

        // lets sort in order to move Aces to the end, needed for ace logic
        const sortedCards = this.getCardsSortedByAceLast(cards)

        for (const card of sortedCards) {
            // check for ace
            if (card.rank === CardRank.Ace) {
                let tempPoints = points + card.getHighAceValue()

                if (tempPoints > this.getBlackjackValue()) {
                    points += card.getLowAceValue()
                } else {
                    points += card.getHighAceValue()
                }
            } else {
                points += card.getValue()
            }
        }

        return points
    }

    private getCardsSortedByAceLast(cards: ICard[]): ICard[] {
        const sortedCards = [
            ...cards.filter(card => card.rank !== CardRank.Ace),
            ...cards.filter(card => card.rank === CardRank.Ace),
        ]

        return sortedCards
    }

    public setTurn(turn: PlayerType): void {
        this.turn = turn
    }

    public playerEndTurn(player: IPlayer): void {
        if (player.type === 'player') {
            this.gameStats.playerEndedTurn = true
        } else {
            this.gameStats.dealerEndedTurn = true
        }
    }

    public checkWinner(): void {
        const player = this.getPlayerByType('player')
        const dealer = this.getPlayerByType('dealer')

        if (!player || !dealer) {
            return
        }

        // check for bust first
        if (this.gameStats.playerScore.player > this.getBlackjackValue()) {
            this.endGame('bust', 'dealer')
            dealer.stats.recordWin()
            player.stats.recordLoss()
            return
        }

        if (this.gameStats.playerScore.dealer > this.getBlackjackValue()) {
            this.endGame('bust', 'player')
            dealer.stats.recordLoss()
            player.stats.recordWin()
            return
        }

        // very important to check if both players have ended their turn before proceeding with the rest of the checks
        if (this.gameStats.playerEndedTurn && this.gameStats.dealerEndedTurn) {
            if (this.gameStats.playerScore.player === this.gameStats.playerScore.dealer) {
                this.endGame('draw', '')
                dealer.stats.recordDraw()
                player.stats.recordDraw()
                return
            }
    
            if (this.gameStats.playerScore.player === this.getBlackjackValue()) {
                this.endGame('blackjack', 'player')
                dealer.stats.recordLoss()
                player.stats.recordWin()
                return
            }
    
            if (this.gameStats.playerScore.dealer === this.getBlackjackValue()) {
                this.endGame('blackjack', 'dealer')
                dealer.stats.recordWin()
                player.stats.recordLoss()
                return
            }
            
            if (this.gameStats.playerScore.player > this.gameStats.playerScore.dealer) {
                this.endGame('highScore', 'player')
                dealer.stats.recordLoss()
                player.stats.recordWin()
                return
            }

            this.endGame('highScore', 'dealer')
            dealer.stats.recordWin()
            player.stats.recordLoss()
        }
    }

    public updatePlayerScore(player: IPlayer): number {
        const playerHand = player.getHand()
        const playerScore = this.calculateCardPoints(playerHand)

        // todo: change to player ID at some point in time.
        this.gameStats.playerScore[player.type] = playerScore

        return playerScore
    }

    public getPlayerScore(player: IPlayer): number {
        return this.gameStats.playerScore[player.type]
    }

    public incrementTurnsPlayed(): number {
        const turnsPlayed = this.gameStats.turnsPlayed + 1
        this.gameStats.turnsPlayed = turnsPlayed

        return turnsPlayed
    }

    public incrementPlayerTurnsPlayed(player: IPlayer): number {
        if (player.type === 'player') {
            let turnsPlayed = this.gameStats.playerTurnsPlayed
            turnsPlayed += 1
            this.gameStats.playerTurnsPlayed += turnsPlayed

            return turnsPlayed
        } else {
            let turnsPlayed = this.gameStats.dealerTurnsPlayed
            turnsPlayed += 1
            this.gameStats.dealerTurnsPlayed += turnsPlayed

            return turnsPlayed
        }
    }

    public endGame(status: GameEndStatus, winner: string = ''): void {
        this.gameStatus = 'completed'
        this.gameEndStatus = status
        this.gameStats.winner = winner
    }

    public getBlackjackValue(): number {
        return 21
    }
}