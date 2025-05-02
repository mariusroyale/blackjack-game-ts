import { IGameService } from "../interfaces/GameService";
import { IGameState } from "../interfaces/GameState";
import { Blackjack } from "../models/Blackjack";
import { Player } from "../models/Player";
import { PlayerType } from "../interfaces/Player";
import { GameAI } from "../models/GameAI";

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

        // check if game is active
        if (game.gameStatus !== 'active') {
            throw new Error('Game is not active');
        }

        if (game.turn !==  playerData.type) {
            throw new Error('Not player turn');
        }

        const player = game.getPlayerStateByName(playerData.playerName, playerData.type);

        if (!player) {
            throw new Error('Player not found');
        }

        // dealers will process multiple hits at once
        if (player.getType() === 'dealer') {
            let AIFlow = true;

            while (AIFlow) {
                const gameAI = new GameAI(game);
                const shouldPlayerHit = gameAI.shouldPlayerHit(player);

                if (shouldPlayerHit) {
                    // dealer hits
                    game.hit(player);
                } else {
                    // dealer stands
                    game.stand(player);
                    AIFlow = false;

                    // update the turn
                    game.setTurn('player');

                    // update game stats
                    game.incrementTurnsPlayed();
                    game.incrementPlayerTurnsPlayed(player);
                }
            }
        } else {
            // perform the action
            game.hit(player);
        }

        // todo: add actions played stats

        // check winner -- if winner is found, game ends
        game.checkWinner();

        return {
            gameId: gameId,
            state: game.getState()
        };
    }

    public actionStand(gameId: string, playerData: { playerName: string, type: PlayerType }): { gameId: string; state: IGameState } | null {
        const game = this.games.get(gameId);
        
        if (!game) {
            throw new Error('Game not found');
        }

        // check if game is active
        if (game.gameStatus !== 'active') {
            throw new Error('Game is not active');
        }

        // validate game state to be able to perform the action
        if (game.turn !== playerData.type) {
            throw new Error('Not player turn');
        }

        const player = game.getPlayerStateByName(playerData.playerName, playerData.type);

        if (!player) {
            throw new Error('Player not found');
        }

        // perform the action
        game.stand(player);

        // update the turn
        game.setTurn(game.turn === 'player' ? 'dealer' : 'player');

        // update game stats
        game.incrementTurnsPlayed();
        game.incrementPlayerTurnsPlayed(player);

        // check winner -- if winner is found, game ends
        game.checkWinner();

        return {
            gameId: gameId,
            state: game.getState()
        };
    }
}
