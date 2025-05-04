import { ICard } from "./Card";
import { IPlayerStats } from "./PlayerStats";

export type PlayerType = 'player' | 'dealer';

export interface IPlayer {
    name: string;
    hand: ICard[];
    type: PlayerType;
    stats: IPlayerStats;
    getName(): string;
    getType(): PlayerType;
    getHand(): ICard[];
    addCard(card: ICard): void;
}