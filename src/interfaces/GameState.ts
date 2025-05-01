import { IPlayer } from "./Player";
import { GameStatus, GameTurn } from "./Game";
import { IGameStats } from "./GameStats";

export interface IGameState {
    gameId: string;
    players: IPlayer[];
    deckSize: number;
    turn: GameTurn;
    gameStatus: GameStatus;
    gameStats: IGameStats;
}