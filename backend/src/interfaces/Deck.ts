import { ICard } from "./Card";

export interface IDeck {
    deck: ICard[];
    deckSeed: string;

    numberOfCardsPerDeck: number;
    numberOfCardsInDeck: number;
    numberOfDecks: number;

    createDeck(): void;
    shuffleDeck(): void;
    setDeckSize(): void;
    getDeckSize(): number;
    getDeck(): ICard[];
    getDeckSeed(): string;
}