import { ICard } from "./Card";

export interface IDealer {
    name: string;
    hand: ICard[];
    getName(): string;
    getHand(): ICard[];
    addCard(card: ICard): void;
}