import { Suit, Rank, ICard } from '../interfaces/Card';

export class Card implements ICard {
    public suit: Suit;
    public rank: Rank;

    constructor(suit: Suit, rank: Rank) {
        this.suit = suit;
        this.rank = rank;
    }

    public getValue(): number {
        if (this.rank === "Ace") { 
            return 11; 
        }

        if (this.rank === "Jack" || this.rank === "Queen" || this.rank === "King") { 
            return 10;
        }

        return parseInt(this.rank);
    }
}
