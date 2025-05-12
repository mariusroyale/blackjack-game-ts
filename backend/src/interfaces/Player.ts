import { ICard } from "./Card"
import { IPlayerStats } from "./PlayerStats"

export type PlayerType = 'player' | 'dealer'

export interface IPlayer {
    id: string
    name: string
    hand: ICard[]
    type: PlayerType
    stats: IPlayerStats
    gameSessionId: string
    getName(): string
    getType(): PlayerType
    getHand(): ICard[]
    addCard(card: ICard): void
    getId(): string
    setPlayerSessionId(playerSessionId: string): void
}