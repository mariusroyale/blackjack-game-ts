import { ICard } from "./Card";
import { IPlayer } from "./Player";
import { IGameState } from "./GameState";   

export interface IGame {
    gameId: string;
    players: IPlayer[];
    deck: ICard[];
    turn: 'player' | 'dealer';
    gameStatus: 'active' | 'finished';

    startGame(): void;
    addPlayer(player: IPlayer): void;
    getState(): IGameState;
    hit(player: IPlayer): void;
    stand(player: IPlayer): void;
    dealInitialCards(): void;
}