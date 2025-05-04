import { Suit, Rank, ICard } from '../interfaces/Card';

export enum CardRank {
    Ace = 'Ace',
    King = 'King',
    Queen = 'Queen',
    Jack = 'Jack',
}

export const SUITS: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"]; 
export const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

export class Card implements ICard {
    public suit: Suit;
    public rank: Rank;
    public deckSeed: string;

    constructor(suit: Suit, rank: Rank, deckSeed: string) {
        this.suit = suit;
        this.rank = rank;
        this.deckSeed = deckSeed;
    }

    public getValue(): number {
        if (this.rank === "Jack" || this.rank === "Queen" || this.rank === "King") { 
            return 10;
        }

        return parseInt(this.rank);
    }

    public getHighAceValue(): number {
        return 11;
    }

    public getLowAceValue(): number {
        return 1;
    }
}
