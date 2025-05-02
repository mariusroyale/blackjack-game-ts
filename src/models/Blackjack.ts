import { IGame, GameTurn, GameStatus, GameEndStatus } from "../interfaces/Game";
import { IPlayer } from "../interfaces/Player";
import { PlayerType } from "../interfaces/Player";
import { ICard, Suit, Rank } from "../interfaces/Card";
import { IGameState } from "../interfaces/GameState";
import { IGameStats } from "../interfaces/GameStats";

import { Card } from "./Card";
import { v4 as uuidv4 } from 'uuid';

export class Blackjack implements IGame {
    public gameId: string;
    public players: IPlayer[] = [];
    public deck: ICard[] = [];
    public deckSize: number;
    public turn: GameTurn;
    public gameStatus: GameStatus;
    public gameEndStatus: GameEndStatus;
    public gameStats: IGameStats;

    constructor() {
        this.gameId = uuidv4();
        this.turn = 'player';
        this.gameStatus = 'active';
        this.gameEndStatus = '';
        this.deckSize = 0;
        this.gameStats = {
            turnsPlayed: 0,
            playerTurnsPlayed: 0,
            playerEndedTurn: false,
            dealerTurnsPlayed: 0,
            dealerEndedTurn: false,
            winner: '',
            playerScore: {
                player: 0,
                dealer: 0
            }
        };
    }

    public startGame(): void { 
        this.createDeck();
        this.shuffleDeck();
    }

    public getGameId(): string {
        return this.gameId;
    }

    private createDeck(): void {
        const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"]; 
        const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push(new Card(suit, rank));
            }
        }
    }

    private shuffleDeck(): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }

        const deck = this.deck;

        // modified set
        for (let i =  deck.length - 1; i > 0; i--) {
           const x = Math.floor(Math.random() * (i + 1));
           [deck[i], deck[x]] = [deck[x], deck[i]];
       }

       this.deck = deck;
    }

    private setDeckSize(): void {
        this.deckSize = this.deck.length;
    }

    public dealInitialCards(): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }

        this.players.forEach(player => {
            this.drawCard(player);
            if (player.type === 'player') {
                this.drawCard(player);
            }

            // update the score
            this.updatePlayerScore(player);
        });

        this.setDeckSize();
    }

    public addPlayer(player: IPlayer): void {
        this.players.push(player);
    }

    public getPlayers(): IPlayer[] {
        return this.players;
    }

    public hit(player: IPlayer): void {
        this.drawCard(player);
        this.updatePlayerScore(player);
        this.setDeckSize();
    }

    public stand(player: IPlayer): void {
        this.playerEndTurn(player);
    }

    private drawCard(player: IPlayer): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }
        
        const card = this.deck.pop();

        if (card) {
            player.addCard(card);
        } else {
            throw new Error('Deck ran out of cards while dealing.');
        }
    }

    public getState(): IGameState {
        return {
            gameId: this.gameId,
            players: this.players,
            deckSize: this.deckSize,
            turn: this.turn,
            gameStatus: this.gameStatus,
            gameEndStatus: this.gameEndStatus,
            gameStats: this.gameStats
        };
    }
    
    private calculateCardPoints(cards: ICard[]): number {
        let points = 0;

        for (const card of cards) {
            points += card.getValue();
        }

        return points;
    }

    public setTurn(turn: PlayerType): void {
        this.turn = turn;
    }

    public playerEndTurn(player: IPlayer): void {
        if (player.type === 'player') {
            this.gameStats.playerEndedTurn = true;
        } else {
            this.gameStats.dealerEndedTurn = true;
        }
    }

    public checkWinner(): void {
        // check for bust first
        if (this.gameStats.playerScore.player > 21) {
            this.gameStats.winner = 'dealer';
            this.gameStatus = 'completed';
            this.gameEndStatus = 'bust';
            return;
        }

        if (this.gameStats.playerScore.dealer > 21) {
            this.gameStats.winner = 'player';
            this.gameStatus = 'completed';
            this.gameEndStatus = 'bust';
            return;
        }

        // very important to check if both players have ended their turn before proceeding with the rest of the checks
        if (this.gameStats.playerEndedTurn && this.gameStats.dealerEndedTurn) {
            if (this.gameStats.playerScore.player === this.gameStats.playerScore.dealer) {
                this.gameStats.winner = '';
                this.gameStatus = 'completed';
                this.gameEndStatus = 'draw';
                return;
            }
    
            if (this.gameStats.playerScore.player === 21) {
                this.gameStats.winner = 'player';
                this.gameStatus = 'completed';
                this.gameEndStatus = 'blackjack';
                return;
            }
    
            if (this.gameStats.playerScore.dealer === 21) {
                this.gameStats.winner = 'dealer';
                this.gameStatus = 'completed';
                this.gameEndStatus = 'blackjack';
                return;
            }
            
            if (this.gameStats.playerScore.player > this.gameStats.playerScore.dealer) {
                this.gameStats.winner = 'player';
                this.gameStatus = 'completed';
                this.gameEndStatus = 'highScore';
                return;
            }

            this.gameStats.winner = 'dealer';
            this.gameStatus = 'completed';
            this.gameEndStatus = 'highScore';
        }
    }

    public updatePlayerScore(player: IPlayer): number {
        const playerHand = player.getHand();
        const playerScore = this.calculateCardPoints(playerHand);

        // todo: change to player ID at some point in time.
        this.gameStats.playerScore[player.type] = playerScore;

        return playerScore;
    }

    public getPlayerScore(player: IPlayer): number {
        return this.gameStats.playerScore[player.type];
    }

    public incrementTurnsPlayed(): number {
        const turnsPlayed = this.gameStats.turnsPlayed + 1;
        this.gameStats.turnsPlayed = turnsPlayed;

        return turnsPlayed;
    }

    public incrementPlayerTurnsPlayed(player: IPlayer): number {
        if (player.type === 'player') {
            let turnsPlayed = this.gameStats.playerTurnsPlayed;
            turnsPlayed += 1;
            this.gameStats.playerTurnsPlayed += turnsPlayed;

            return turnsPlayed;
        } else {
            let turnsPlayed = this.gameStats.dealerTurnsPlayed;
            turnsPlayed += 1;
            this.gameStats.dealerTurnsPlayed += turnsPlayed;

            return turnsPlayed;
        }
    }

    public endGame(): void {
        this.gameStatus = 'completed';
    }
}