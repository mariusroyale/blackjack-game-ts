import { IPlayer } from "./Player";
import { IGameState } from "./GameState";
import { Player } from "../models/Player";
import { PlayerType } from "./Player";

export interface IGameService {
    createGame(playerData: { playerName: string, type: PlayerType }[]): {
        gameId: string;
        state: IGameState;
    }

    getGameState(gameId: string): {
        gameId: string;
        state: IGameState;
    } | null;

    actionHit(gameId: string, playersData: { playerName: string, type: PlayerType }): {
        gameId: string;
        state: IGameState;
    } | null;

    actionStand(gameId: string, playersData: { playerName: string, type: PlayerType }): {
        gameId: string;
        state: IGameState;
    } | null;
}