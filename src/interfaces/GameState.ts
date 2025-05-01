import { IPlayer } from "./Player";
import { GameStatus, GameTurn } from "./Game";

export interface IGameState {
    gameId: string;
    players: IPlayer[];
    deckSize: number;
    turn: GameTurn;
    gameStatus: GameStatus;
}