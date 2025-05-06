import { IGameService } from "../interfaces/GameService";
import { IGameState } from "../interfaces/GameState";
import { Blackjack } from "../models/Blackjack";
import { Player } from "../models/Player";
import { IPlayer, PlayerType } from "../interfaces/Player";
import { GameAI } from "../models/GameAI";
import { IGame } from "../interfaces/Game";
import { PlayerStats } from "../models/PlayerStats";
import { Deck } from "../models/Deck";
import { createHash } from 'crypto';

export class GameService implements IGameService {
    private games = new Map<string, Blackjack>();
    private playerStats = new Map<string, PlayerStats>();
    private gameAI!: GameAI;
    private decks = new Map<string, Deck>();

    public createGame(playersData: { playerName: string, type: PlayerType }[]): { gameId: string; state: IGameState } {
        // initialize deck instance
        const playersDataString = JSON.stringify(playersData);
        const deckHash = createHash('sha256').update(playersDataString).digest('hex');

        let deck = this.decks.get(deckHash);

        if (!deck) {
            deck = new Deck();
            this.decks.set(deckHash, deck);
        }

        // initialize game AI instance
        const gameAI = this.gameAI;

        if (!gameAI) {
            const newGameAI = new GameAI(new Blackjack(this.decks.get(deckHash)!));
            this.gameAI = newGameAI;
        }

        // initialize game instance
        const game = new Blackjack(deck);
        const gameId = game.getGameId();

        // adding players
        playersData.forEach((playerData) => {
            // get or create the stats
            let playerStats =  this.playerStats.get(playerData.playerName);
            
            if (!playerStats) {
                playerStats = new PlayerStats();
                this.playerStats.set(playerData.playerName, playerStats);
            }

            const { playerName, type } = playerData;
            const player = new Player(playerName, type, playerStats);
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
