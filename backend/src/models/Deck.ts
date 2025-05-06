import { IDeck } from "../interfaces/Deck";
import { ICard, Rank, Suit } from "../interfaces/Card";
import { Card, SUITS, RANKS } from "./Card";
import { createHash, randomBytes  } from "crypto";
import { PlayerType } from "../interfaces/Player";
import seedrandom from 'seedrandom';

export class Deck implements IDeck {
    public deck: ICard[] = [];
    private deckSeed: string = '';
    private deckSeedHash: string = '';

    public numberOfCardsPerDeck: number = 52;
    public numberOfCardsInDeck: number = 0;
    public numberOfDecks: number = 6;
    
    constructor(deckSeed: string = '', shuffleDeck: boolean = true) {
        this.resetDeck(deckSeed, shuffleDeck);
    }

    public resetDeck(deckSeed: string = '', shuffleDeck: boolean = true): void {
        this.deck = [];
        // create deck seed if not provided
        if (!deckSeed) {
            deckSeed = this.createDeckSeed();
        }
        // set the deckSeed
        this.deckSeed = deckSeed;
        // create deck seed
        this.createDeckSeed();
        // create deck seed hash
        this.createDeckSeedHash();
        // create deck
        for (let i = 0; i < this.numberOfDecks; i++) {
            this.createDeck();
        }
        // shuffle deck
        if (shuffleDeck) {
            this.shuffleDeck();
        }
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

    private createDeckSeed(): string {
        return randomBytes(16).toString('hex');
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

    public getDeckHashWithPlayersData(playersData: { playerName: string, type: PlayerType }[]): string {
        const playersDataString = JSON.stringify(playersData);
        return createHash('sha256').update(playersDataString).digest('hex');
    }
}