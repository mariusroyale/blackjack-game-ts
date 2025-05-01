import { IGameService } from "../interfaces/GameService";
import { Game } from "../models/Game";

export class GameService {
    private games = new Map<string, Game>();

    public createGame() {
        const game = new Game();
        const gameId = game.getGameId();

        this.games.set(gameId, game);

        return gameId;
    }

    public getGame(gameId: string) {
        return this.games.get(gameId);
    }
}

const gameService = new GameService();


let gameId1 = gameService.createGame();
console.log(gameId1);

let gameId2 = gameService.createGame();
console.log(gameId2);

let gameId3 = gameService.createGame();
console.log(gameId3);


console.log(gameService.getGame(gameId1));
console.log(gameService.getGame(gameId2));
console.log(gameService.getGame(gameId3));




