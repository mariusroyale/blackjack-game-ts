import { ICard } from '../interfaces/Card';
import { IPlayer } from '../interfaces/Player';
import { PlayerType } from '../interfaces/Player';
import { PlayerStats } from '../models/PlayerStats';
import { IPlayerStats } from '../interfaces/PlayerStats';

export class Player implements IPlayer {
    public name: string;
    public hand: ICard[];
    public type: PlayerType;
    public stats: IPlayerStats;

    constructor(name: string, type: PlayerType, stats: IPlayerStats) {
        this.name = name;
        this.type = type;
        this.hand = [];
        this.stats = stats;
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