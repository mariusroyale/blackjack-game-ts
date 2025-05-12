import { ICard } from "./Card"

export interface IDeck {
    deck: ICard[]

    numberOfCardsPerDeck: number
    numberOfCardsInDeck: number
    numberOfDecks: number

    createDeck(): void
    shuffleDeck(): void
    resetDeck(deckSeed: string, shuffleDeck: boolean): void
    setDeckSize(): void
    getDeckSize(): number
    getDeck(): ICard[]
    getDeckSeed(): string
    getDeckSeedHash(): string
}