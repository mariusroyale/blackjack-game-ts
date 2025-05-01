import { IPlayer } from "./Player";
import { IGameState } from "./GameState";

export interface IGameService {
    createGame(playerData: IPlayer[]): {
        gameId: string;
        state: IGameState;
    }
}