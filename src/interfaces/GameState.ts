import { ICard } from "./Card";
import { IPlayer } from "./Player";

export interface IGameState {
    gameId: string;
    players: IPlayer[];
    deck: ICard[];
    turn: 'player' | 'dealer';
    gameStatus: 'active' | 'finished';
}