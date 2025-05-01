import { IGameService } from "../interfaces/GameService";
import { IGameState } from "../interfaces/GameState";
import { Blackjack } from "../models/Blackjack";
import { Player } from "../models/Player";
import { PlayerType } from "../interfaces/Player";

export class GameService implements IGameService {
    private games = new Map<string, Blackjack>();

    public createGame(playersData: { playerName: string, type: PlayerType }[]): { gameId: string; state: IGameState } {
        const game = new Blackjack();
        const gameId = game.getGameId();

        // adding players
        playersData.forEach((playerData) => {
            const { playerName, type } = playerData;
            const player = new Player(playerName, type);
            game.addPlayer(player);
        });

        // start the game
        game.startGame();

        // deal initial cards
        game.dealInitialCards();

        // save the game state
        this.games.set(gameId, game);

        // DEBUG -- to be removed
        console.log(this.games);

        return {
            gameId: gameId,
            state: game.getState()
        };
    }

    public getGameState(gameId: string): { gameId: string; state: IGameState } | null {
        const game = this.games.get(gameId);
        
        if (!game) {
            throw new Error('Game not found');
        }

        return {
            gameId: gameId,
            state: game.getState()
        };
    }

    public actionHit(gameId: string, playerData: { playerName: string, type: PlayerType }): { gameId: string; state: IGameState } | null {
        const game = this.games.get(gameId);
        
        if (!game) {
            throw new Error('Game not found');
        }

        if (game.turn !==  playerData.type) {
            throw new Error('Not player turn');
        }

        const players = game.getPlayers();
        const player = players.find(player => player.getName() === playerData.playerName && player.getType() === playerData.type);

        if (!player) {
            throw new Error('Player not found');
        }

        // perform the action
        game.hit(player);

        // update the turn
        game.setTurn(game.turn === 'player' ? 'dealer' : 'player');

        return {
            gameId: gameId,
            state: game.getState()
        };
    }

    public actionStand(gameId: string): { gameId: string; state: IGameState } | null {
        const game = this.games.get(gameId);
        
        if (!game) {
            throw new Error('Game not found');
        }

        // do the action

        return {
            gameId: gameId,
            state: game.getState()
        };
    }
}
