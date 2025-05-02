import { ICard } from '../interfaces/Card';
import { IPlayer } from '../interfaces/Player';
import { PlayerType } from '../interfaces/Player';

export class Player implements IPlayer {
    public name: string;
    public hand: ICard[];
    public type: PlayerType;

    constructor(name: string, type: PlayerType) {
        this.name = name;
        this.type = type;
        this.hand = [];
    }

    public getName(): string {
        return this.name;
    }

    public getType(): PlayerType {
        return this.type;
    }

    public getHand(): ICard[] {
        return this.hand;
    }

    public addCard(card: ICard): void {
        this.hand.push(card);
    }
}