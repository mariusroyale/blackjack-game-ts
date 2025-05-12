import { IGame } from "./Game"
import { IPlayer } from "./Player"

export interface IGameAI {
    game: IGame

    shouldPlayerHit(player: IPlayer): boolean
}