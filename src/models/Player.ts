import { ICard } from '../interfaces/Card';
import { IPlayer } from '../interfaces/Player';

export class Player implements IPlayer {

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
