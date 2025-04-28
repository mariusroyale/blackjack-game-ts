import { ICard } from '../interfaces/Card';
import { IDealer } from '../interfaces/Dealer';

export class Dealer implements IDealer {

    public name: string;
    public hand: ICard[];

    constructor(name: string) {
        this.name = name;
        this.hand = [];
    }

    public getName(): string {
        return this.name;
    }

    public getHand(): ICard[] {
        return this.hand;
    }

    public addCard(card: ICard): void {
        this.hand.push(card);
    }
}
