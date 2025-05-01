import { ICard } from "./Card";
import { IPlayer } from "./Player";
import { IGameState } from "./GameState"; 
import { PlayerType } from "./Player";

export type GameStatus = 'active' | 'finished';
export type GameTurn = 'player' | 'dealer';

export interface IGame {
    gameId: string;
    players: IPlayer[];
    deck: ICard[];
    deckSize: number;
    turn: GameTurn;
    gameStatus: GameStatus;

    // game related methods
    startGame(): void;
    getGameId(): string;

    // card related methods        
    dealInitialCards(): void;
    
    // player related methods
    addPlayer(player: IPlayer): void;
    getPlayers(): IPlayer[];

    // player actions methods
    hit(player: IPlayer): void;
    stand(player: IPlayer): void;
   
    // game state methods
    getState(): IGameState;
    setTurn(turn: PlayerType): void;
}