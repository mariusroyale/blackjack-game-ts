import { IPlayer } from "./Player";
import { GameStatus, GameTurn, GameEndStatus } from "./Game";
import { IGameStats } from "./GameStats";

export interface IGameState {
    gameId: string;
    players: IPlayer[];
    deckSize: number;
    deckSeed: string;
    turn: GameTurn;
    gameStatus: GameStatus;
    gameEndStatus: GameEndStatus;
    gameStats: IGameStats;
}