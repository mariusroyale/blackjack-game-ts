import { ICard } from '../interfaces/Card'
import { IPlayer } from '../interfaces/Player'
import { PlayerType } from '../interfaces/Player'
import { IPlayerStats } from '../interfaces/PlayerStats'
import { createHash } from 'crypto'

export class Player implements IPlayer {
    public id: string
    public name: string
    public hand: ICard[]
    public type: PlayerType
    public stats: IPlayerStats

    constructor(name: string, type: PlayerType, stats: IPlayerStats) {
        this.name = name
        this.type = type
        this.hand = []
        this.stats = stats
        this.id = this.generateUniqueIdBasedOnName(name)
    }

    public getName(): string {
        return this.name
    }

    public getType(): PlayerType {
        return this.type
    }

    public getHand(): ICard[] {
        return this.hand
    }

    public addCard(card: ICard): void {
        this.hand.push(card)
    }

    private generateUniqueIdBasedOnName(name: string): string {
        const lowerCaseName = name.toLocaleLowerCase()
        return createHash('sha256').update(lowerCaseName).digest('hex')
    }
}