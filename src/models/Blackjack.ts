import { IGame, GameTurn, GameStatus } from "../interfaces/Game";
import { IPlayer } from "../interfaces/Player";
import { PlayerType } from "../interfaces/Player";
import { ICard, Suit, Rank } from "../interfaces/Card";
import { IGameState } from "../interfaces/GameState";

import { Card } from "./Card";
import { v4 as uuidv4 } from 'uuid';

export class Blackjack implements IGame {
    public gameId: string;
    public players: IPlayer[] = [];
    public deck: ICard[] = [];
    public deckSize: number;
    public turn: GameTurn;
    public gameStatus: GameStatus;

    constructor() {
        this.gameId = uuidv4();
        this.turn = 'player';
        this.gameStatus = 'active';
        this.deckSize = 0;
    }

    public startGame(): void { 
        this.createDeck();
        this.shuffleDeck();
    }

    public getGameId(): string {
        return this.gameId;
    }

    private createDeck(): void {
        const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"]; 
        const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push(new Card(suit, rank));
            }
        }
    }

    private shuffleDeck(): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }

        const deck = this.deck;

        // modified set
        for (let i =  deck.length - 1; i > 0; i--) {
           const x = Math.floor(Math.random() * (i + 1));
           [deck[i], deck[x]] = [deck[x], deck[i]];
       }

       this.deck = deck;
    }

    private setDeckSize(): void {
        this.deckSize = this.deck.length;
    }

    public dealInitialCards(): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }

        this.players.forEach(player => {
            this.drawCard(player);
            if (player.type === 'player') {
                this.drawCard(player);
            }
        });

        this.setDeckSize();
    }

    public addPlayer(player: IPlayer): void {
        this.players.push(player);
    }

    public getPlayers(): IPlayer[] {
        return this.players;
    }

    public hit(player: IPlayer): void {
        this.drawCard(player);
        this.setDeckSize();
    }

    public stand(player: IPlayer): void {
        
    }

    private drawCard(player: IPlayer): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }
        
        const card = this.deck.pop();

        if (card) {
            player.addCard(card);
        } else {
            throw new Error('Deck ran out of cards while dealing.');
        }
    }

    public getState(): IGameState {
        return {
            gameId: this.gameId,
            players: this.players,
            deckSize: this.deckSize,
            turn: this.turn,
            gameStatus: this.gameStatus
        };
    }

    public setTurn(turn: PlayerType): void {
        this.turn = turn;
    }
}