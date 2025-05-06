export type Suit = 'Hearts' | 'Spades' | 'Clubs' | 'Diamonds';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King' | 'Ace';

export interface ICard {
    suit: Suit;
    rank: Rank;
    nonce: number | null;
    id: string;

    getValue(): number;
    getHighAceValue(): number;
    getLowAceValue(): number;
    getId(): string;
}