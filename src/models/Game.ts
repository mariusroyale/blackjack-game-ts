import { IGame } from "../interfaces/Game";
import { IPlayer } from "../interfaces/Player";
import { ICard, Suit, Rank } from "../interfaces/Card";
import { Card } from "./Card";
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
        this.createDeck();
        this.shuffleDeck();
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
        this.drawCard(player);
    }

    public stand(player: IPlayer): void {
        
    }

    public setTurn(turn: 'player' | 'dealer'): void {
        this.turn = turn;
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
            console.warn(`Deck ran out of cards while dealing.`);
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

    private createDeck(): void {
        const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"]; 
        const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push(new Card(suit, rank));
            }
        }
    }
}