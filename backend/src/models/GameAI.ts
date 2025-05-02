import { IGame } from "../interfaces/Game";
import { IGameAI } from "../interfaces/GameAI";
import { IPlayer } from "../interfaces/Player";
import { Blackjack } from "./Blackjack";

export class GameAI implements IGameAI {
    public game: Blackjack;

    public constructor(game: Blackjack) {
        this.game = game;
    }

    public shouldPlayerHit(player: IPlayer): boolean {
        const dealerScore = this.game.getPlayerScore(player);
        let chanceToHit = 0;

        if (dealerScore < 16) {
            chanceToHit = 1;
        } else if (dealerScore < 17) {
            chanceToHit = 0.65;
        } else if (dealerScore < 21) {
            let delta = 20 - dealerScore;
            chanceToHit = delta / 10;
            if (chanceToHit > 0) {
                chanceToHit -= 0.05;
            }
        }

        // todo: move to logger
        console.log(`Dealer points: ${dealerScore}`);
        console.log(`Dealer chance to hit: ${chanceToHit * 100}%`);
        
        let randomChance = Math.random();
        console.log(`Random chance: ${randomChance}`);

        if (randomChance < chanceToHit) {
            return true;
        }

        return false;
    }
}