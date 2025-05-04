import { ICard } from "./Card";
import { IPlayer } from "./Player";
import { IGameState } from "./GameState"; 
import { PlayerType } from "./Player";
import { IDeck } from "./Deck";

export type GameStatus = 'active' | 'completed';
export type GameTurn = 'player' | 'dealer';
export type GameEndStatus = 'draw' | 'blackjack' | 'bust' | 'highScore' | '';

export interface IGame {
    gameId: string;
    players: IPlayer[];
    deck: IDeck;
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