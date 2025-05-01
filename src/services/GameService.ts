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
