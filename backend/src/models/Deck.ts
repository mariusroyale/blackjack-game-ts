import { IDeck } from "../interfaces/Deck";
import { ICard, Rank, Suit } from "../interfaces/Card";
import { Card, SUITS, RANKS } from "./Card";
import { createHash, randomBytes  } from "crypto";
import seedrandom from 'seedrandom';

export class Deck implements IDeck {
    public deck: ICard[] = [];
    private deckSeed: string = '';
    private deckSeedHash: string = '';

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

        // this.deckSeed = '7e0f301b3abb2e2124f65ec8951267f9';

        // create deck seed hash
        this.createDeckSeedHash();
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
                this.deck.push(new Card(suit, rank));
            }
        }
    }

    public shuffleDeck(): void {
        if (!this.deck) {
            return;
        }

        // create rng based on deck seed
        const rng = seedrandom(this.deckSeed);

        // shuffle deck
        for (let i =  this.deck.length - 1; i > 0; i--) {
           const randomIndex = Math.floor(rng() * (i + 1));
           // swap cards
           [this.deck[i], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[i]];
        }

        // Assign deterministic card nonce after shuffle
        this.deck.forEach((card, index) => {
            card.nonce = index;
        });
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

    private createDeckSeedHash(): void {
        this.deckSeedHash = createHash('sha256').update(this.deckSeed).digest('hex');
    }

    public getDeckSeedHash(): string {
        return this.deckSeedHash;
    }

    public getDeck(): ICard[] {
        return this.deck;
    }
}