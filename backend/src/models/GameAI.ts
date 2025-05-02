import { IGame } from "../interfaces/Game";
import { IGameAI } from "../interfaces/GameAI";
import { IPlayer } from "../interfaces/Player";
import { Blackjack } from "./Blackjack";
import { ICard } from "../interfaces/Card";

export class GameAI implements IGameAI {
    public game: Blackjack;
    private emotionalConfidence: number = 0.25;
    private memoryConfidence: number = 0.25;
    private wins: number = 0;
    private losses: number = 0;
    private totalGames: number = 0;
    private seenCards: { [key: string]: number} = {};
    
    public constructor(game: Blackjack) {
        this.game = game;
        this.resetSeenCards();
    }

    public bindToGame(game: Blackjack): void {
        this.game = game;
        this.resetSeenCards();
    }

    public incrementWins(): void {
        this.wins += 1;
        this.updateTotalGames();
        this.updateEmotionalConfidence();
    }

    public incrementLosses(): void {
        this.losses += 1;
        this.updateTotalGames();
        this.updateEmotionalConfidence();
    }

    public getEmotionalConfidence(): number {
        return this.emotionalConfidence;
    }

    public updateEmotionalConfidence(): void {
        this.calculateEmotionalConfidence();
    }

    private calculateEmotionalConfidence(): void {
        const totalGames = this.totalGames;
        const scalingFactor = 1;

        if (totalGames === 0) {
            this.emotionalConfidence = 0.25;
        } else {
            const netScore = this.wins - this.losses;
            this.emotionalConfidence = (netScore / totalGames) * Math.log10(totalGames + 1) * scalingFactor;
        }
    }

    public updateTotalGames(): void {
        this.totalGames = this.wins + this.losses;
    }

    public shouldPlayerHit(player: IPlayer): boolean {
        this.updateMemoryConfidence();
        this.updateEmotionalConfidence();

        const dealerScore = this.game.getPlayerScore(player);
        let chanceToHit = 0;

        if (dealerScore < 16) {
            return true;
        } else if (dealerScore < 17) {
            chanceToHit = 0.65;
        } else if (dealerScore < 21) {
            let delta = 20 - dealerScore;
            chanceToHit = delta / 10;
            if (chanceToHit > 0) {
                chanceToHit -= 0.05;
            }
        }
        
        console.log(`Emotional confidence: ${this.emotionalConfidence}`);
        console.log(`Memory confidence: ${this.memoryConfidence}`);

        // todo: move to logger
        console.log(`Dealer points: ${dealerScore}`);
        
        let randomChance = Math.random();
        console.log(`Random chance: ${randomChance}`);
        console.log(`Chance to hit original: ${chanceToHit}`);
        console.log(`Dealer chance to hit(%): ${chanceToHit * 100}%`);
        
        const rawModifier = (this.emotionalConfidence + this.memoryConfidence) / 2;
        const modifier = 1 / (1 + Math.exp(-4 * (rawModifier - 0.5)));

        chanceToHit = chanceToHit + (1 - chanceToHit) * modifier;
        const chanceToHitModified = Math.max(0, Math.min(1, chanceToHit));
        console.log(`Final chance to hit: ${chanceToHitModified}`);

        if (randomChance < chanceToHitModified) {
            return true;
        }

        return false;
    }

    public resetSeenCards(): void {
        this.seenCards = {
            '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0,
            '10': 0, 'Jack': 0, 'Queen': 0, 'King': 0, 'Ace': 0
        };
    }

    public trackCard(card: ICard): void {
        if (this.seenCards[card.rank] === undefined) {
            this.seenCards[card.rank] = 1;
        } else {
            this.seenCards[card.rank] += 1;
        }
    }

    public trackCardsFromGame(): void {
        this.game.players.forEach(player => {
            player.hand.forEach(card => {
                this.trackCard(card);
            }) 
        });
    }

    public updateMemoryConfidence(): void {
        this.calculateMemoryConfidence();
    }

    private calculateMemoryConfidence(): void {
        this.trackCardsFromGame();

        const totalSeenCards = Object.values(this.seenCards).reduce((acc, count) => acc + count, 0);

        // If no cards have been seen, return
        if (totalSeenCards === 0) {
            return;
        }

        let seenCardsConfidence = 0;

        // Iterate over each rank's seen cards and adjust confidence
        for (const [rank, count] of Object.entries(this.seenCards)) {
            // High-value cards (10, J, Q, K, Ace) increase memory confidence
            if (['10', 'J', 'Q', 'K', 'Ace'].includes(rank)) {
                // Positive impact from high-value cards
                seenCardsConfidence += count * 0.1;  
            } else {
                // Low-value cards (2-9) decrease memory confidence
                // Negative impact from low-value cards
                seenCardsConfidence -= count * 0.05;
            }
        }

        // Normalize the confidence to ensure it stays between 0 and 1
        this.memoryConfidence = Math.min(1, Math.max(0, 0.25 + seenCardsConfidence / totalSeenCards));
    }
}