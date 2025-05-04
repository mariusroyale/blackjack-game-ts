import { IDeck } from "../interfaces/Deck";
import { ICard, Rank, Suit } from "../interfaces/Card";
import { Card, SUITS, RANKS } from "./Card";
import { randomInt, randomBytes  } from "crypto";
import seedrandom from 'seedrandom';

export class Deck implements IDeck {
    public deck: ICard[] = [];
    public deckSeed: string = '';

    public numberOfCardsPerDeck: number = 52;
    public numberOfCardsInDeck: number = 0;
    public numberOfDecks: number = 6;
    
    constructor() {
        this.resetDeck();
    }

    public resetDeck(): void {
        this.deck = [];
        // create deck seed
        this.createDeckSeed();
        // create deck
        for (let i = 0; i < this.numberOfDecks; i++) {
            this.createDeck();
        }
        // shuffle deck
        this.shuffleDeck();
        // update deck size
        this.setDeckSize();
    }

    public createDeck(): void {
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                this.deck.push(new Card(suit, rank, this.deckSeed));
            }
        }
    }

    public shuffleDeck(): void {
        if (!this.deck) {
            return;
        }

        // create rng based on deck seed
        const rng = seedrandom(this.deckSeed);

        for (let i =  this.deck.length - 1; i > 0; i--) {
           const randomIndex = Math.floor(rng() * (i + 1));
           [this.deck[i], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[i]];
       }
    }

    public setDeckSize(): void {
        // re-shuffle if deck size reaches < 25% threshold
        if (this.deck.length < 90) {
            this.resetDeck();
        }

        this.numberOfCardsInDeck = this.deck.length;
    }

    public getDeckSize(): number {
        return this.numberOfCardsInDeck;
    }

    private createDeckSeed(): void {
        this.deckSeed = randomBytes(16).toString('hex');
    }

    public getDeckSeed(): string {
        return this.deckSeed;
    }

    public getDeck(): ICard[] {
        return this.deck;
    }
}