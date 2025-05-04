import { IGameService } from "../interfaces/GameService";
import { IGameState } from "../interfaces/GameState";
import { Blackjack } from "../models/Blackjack";
import { Player } from "../models/Player";
import { PlayerType } from "../interfaces/Player";
import { GameAI } from "../models/GameAI";
import { IGame } from "../interfaces/Game";
import { Deck } from "../models/Deck";

export class GameService implements IGameService {
    private games = new Map<string, Blackjack>();
    private gameAI: GameAI;
    private deck: Deck;

    constructor() {
        this.deck = new Deck();
        this.gameAI = new GameAI(new Blackjack(this.deck));

        this.deck.getDeck().forEach((card, index) => {
            console.log(`${index}: ${card.rank} of ${card.suit}`);
        });
    }

    public createGame(playersData: { playerName: string, type: PlayerType }[]): { gameId: string; state: IGameState } {
        const game = new Blackjack(this.deck);
        const gameId = game.getGameId();

        // adding players
        playersData.forEach((playerData) => {
            const { playerName, type } = playerData;
            const player = new Player(playerName, type);
            game.addPlayer(player);
        });

        // start the game
        game.startGame();

        // save the game state
        this.games.set(gameId, game);

        // todo: implement logging
        console.log(game);

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
            this.gameAI.bindToGame(game);

            while (AIFlow) {
                const shouldPlayerHit = this.gameAI.shouldPlayerHit(player);

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

                // update game state in AI
                this.gameAI.bindToGame(game);
            }
        } else {
            // perform the action
            game.hit(player);
        }

        // check winner -- if winner is found, game ends
        game.checkWinner();

        // update AI
        if (game.gameStatus !== 'active' && game.gameStatus === 'completed') {
           if (game.gameStats.winner === 'dealer') {
               // win for AI
               this.gameAI.incrementWins();
           } else if (game.gameStats.winner === 'player') {
               // loss for AI
               this.gameAI.incrementLosses();
           }
        }

        // todo: implement logging
        console.log(this.gameAI);
        console.log(game);

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

        // update AI
        if (game.gameStatus !== 'active' && game.gameStatus === 'completed') {
            this.gameAI.bindToGame(game);
            
            if (game.gameStats.winner === 'dealer') {
                // win for AI
                this.gameAI.incrementWins();
            } else if (game.gameStats.winner === 'player') {
                // loss for AI
                this.gameAI.incrementLosses();
            }
        }

        // todo: implement logging
        console.log(this.gameAI);
        console.log(game);

        return {
            gameId: gameId,
            state: game.getState()
        };
    }
}
