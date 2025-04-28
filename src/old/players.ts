import { CardsDeck } from './cardDeck';

export class Player {
    // type should be "human" or "ai"
    private type: string;
    private name: string;
    private handOfCards: string[] = [];
    private cardsDeck: CardsDeck;
    private cardsSum: number = 0;

    constructor(name: string, type: string, cardsDeck: CardsDeck) {
        this.type = type;
        this.name = name;
        this.cardsDeck = cardsDeck;
    }

    public getPlayerType(): string {
        return this.type;
    }

    public getPlayerName(): string {
        return this.name;
    }

    public drawCard(): string | undefined {
        let card = this.cardsDeck.drawCard();

        this.addToHandOfCards(card);

        return card;
    }

    public addToHandOfCards(card: string | undefined): void {

        if (card) {
            this.handOfCards.push(card);
        } else {
            console.log('Card is undefined');
        }
        
    }

    public getHandOfCards(): string[] {
        return this.handOfCards;
    }

    public setCardsSum(sum: number): void {
        this.cardsSum = sum;
    }

    public getCardsSum(): number {
        return this.cardsSum;
    }
}