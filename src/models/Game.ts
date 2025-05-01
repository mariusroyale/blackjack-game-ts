import { IGame } from "../interfaces/Game";
import { IPlayer } from "../interfaces/Player";
import { ICard } from "../interfaces/Card";
import { IGameState } from "../interfaces/GameState";

import { v4 as uuidv4 } from 'uuid';

export class Game implements IGame {
    public gameId: string;
    public players: IPlayer[] = [];
    public deck: ICard[] = [];
    public turn: 'player' | 'dealer';
    public gameStatus: 'active' | 'finished';

    constructor() {
        this.gameId = uuidv4();
        this.turn = 'player';
        this.gameStatus = 'active';
    }

    public getGameId(): string {
        return this.gameId;
    }

    public getPlayers(): IPlayer[] {
        return this.players;
    }

    public addPlayer(player: IPlayer): void {
        this.players.push(player);
    }

    public startGame(): void { 
        
    }

    public getState(): IGameState {
        return {
            gameId: this.gameId,
            players: this.players,
            deck: this.deck,
            turn: this.turn,
            gameStatus: this.gameStatus
        };
    }

    public hit(player: IPlayer): void {
        
    }

    public stand(player: IPlayer): void {
        
    }

    public dealInitialCards(): void {
        
    }
}