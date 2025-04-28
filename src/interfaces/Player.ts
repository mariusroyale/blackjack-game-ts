import { ICard } from "./Card";

export interface IPlayer {
    name: string;
    hand: ICard[];
    getName(): string;
    getHand(): ICard[];
    addCard(card: ICard): void;
}