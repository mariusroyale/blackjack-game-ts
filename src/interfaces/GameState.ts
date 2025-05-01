import { ICard } from "./Card";
import { IPlayer } from "./Player";

export interface IGameState {
    gameId: string;
    players: IPlayer[];
    deck: ICard[]; // todo: this is not important, and maybe it can be removed from the client
    turn: 'player' | 'dealer';
    gameStatus: 'active' | 'finished';
}