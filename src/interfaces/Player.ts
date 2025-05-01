import { ICard } from "./Card";

export type PlayerType = 'player' | 'dealer';

export interface IPlayer {
    name: string;
    hand: ICard[];
    type: PlayerType;
    getName(): string;
    getType(): PlayerType;
    getHand(): ICard[];
    addCard(card: ICard): void;
}