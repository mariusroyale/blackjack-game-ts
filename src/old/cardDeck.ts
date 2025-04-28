import { Player } from './players';

export class CardsDeck {

    private cardsDeck: string[];

    constructor() {
        this.cardsDeck = this.initializeCardsDeck();
        this.shuffleCards();
    }

    private initializeCardsDeck(): string[] {
        return [
            "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS",
            "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
            "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
            "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC"
        ];
    }

    private shuffleCards(): void {
        // original set
        let cards = this.cardsDeck;

        // modified set
        for (let i =  cards.length - 1; i > 0; i--) {
            const x = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[x]] = [cards[x], cards[i]];
        }

        // replace original deck
        this.cardsDeck = cards;
    }

    public drawCard(): string | undefined {
        return this.cardsDeck.shift();
    }

    public getCards(): string[] {
        return this.cardsDeck;
    }

    public validatePlayerHandOfCards(player: Player): boolean {
        let num = this.calculatePlayerCardsSum(player);

        // set the player sum of cards
        player.setCardsSum(num);

        // validate if player has won
        if (num === 21) {
            console.log("BLACKJACK!");
            return false;
        } else if (num > 21) {
            console.log("BUST!");
            return false; 
        }

        return true;
    }

    public calculatePlayerCardsSum(player: Player): number {
        let playerHandOfCards = player.getHandOfCards();
        let num = 0;

        // A = 11
        // J = 12
        // Q = 13
        // K = 14

        playerHandOfCards.forEach((card: string) => {
            if (card[0] === "A") {
                num += 11;
            } else if (card[0] === "J") {
                num += 12;
            } else if (card[0] === "Q") {
                num += 13;
            } else if (card[0] === "K") {
                num += 14;
            } else {
                num += parseInt(card.replace(/[^0-9]/g, ''));
            }
        });

        return num;
    }
} 