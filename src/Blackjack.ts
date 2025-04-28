import { ICard, Suit, Rank } from './interfaces/Card';
import { IPlayer } from './interfaces/Player';
import { IDealer } from './interfaces/Dealer';
import { Card } from './models/Card';
import * as readlineSync from 'readline-sync';

export class Blackjack {
    
    private player: IPlayer;
    private dealer: IDealer;
    private deck: ICard[] = [];
    private gameActiveStatus: boolean = false;

    constructor(player: IPlayer, dealer: IDealer) {
        this.player = player;
        this.dealer = dealer;
        this.createDeck();
        this.shuffleDeck();
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
        const deck = this.deck;

         // modified set
         for (let i =  deck.length - 1; i > 0; i--) {
            const x = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[x]] = [deck[x], deck[i]];
        }

        this.deck = deck;
    }

    public getDeck(): ICard[] {
        return this.deck;
    }

    private dealInitialCards(): void {
        if (!this.deck) {
            // throw error
            console.log('Deck is empty');
        }

        // 2 for player
        this.player.addCard(this.deck.pop()!);
        this.player.addCard(this.deck.pop()!);

        // 2 for dealer
        this.dealer.addCard(this.deck.pop()!);
        this.dealer.addCard(this.deck.pop()!);
    }


    public startGame(): void {
        this.dealInitialCards();
        this.playerTurn();
        this.dealerTurn();
        
        // if no blackjack won, compare the hands
        const playerPoints: number = this.calculateCardPoints(this.player.getHand());
        const dealerPoints: number = this.calculateCardPoints(this.dealer.getHand());

        if (playerPoints > dealerPoints && playerPoints <= 21) {
            console.log(`${this.player.getName()} wins!`);    
        } else if (playerPoints < dealerPoints && dealerPoints <= 21) {
            console.log(`${this.dealer.getName()} wins!`);
        } else if (playerPoints  === dealerPoints) {
            console.log('Draw!');
        }
    }

    private playerTurn(): void {
        this.gameActiveStatus = true;
        console.log(this.player.getName() + '\'s turn');
        // show player hand
        this.showPlayerHand();

        // player turn
        while (this.gameActiveStatus) {
            if (this.validateHandOfCards(this.player.getHand())) {
                // ask player to hit or stand
                let input: string = readlineSync.question('Would you like to (h)hit or (s)stand? : ');
            
                if (input === 'h') {
                    // player hits
                    this.player.addCard(this.deck.pop()!);
                    this.showPlayerHand();
                } else {
                    // player stands
                    this.gameActiveStatus = false;
                }
            } else {
                // game is finished or player turn
                this.gameActiveStatus = false;
            }          
        }
    }

    private dealerTurn(): void {
        this.gameActiveStatus = true;
        console.log(this.dealer.getName() + '\'s turn');
        this.showDealerHand();

        // dealer turn
        while (this.gameActiveStatus) {
            if (this.validateHandOfCards(this.dealer.getHand())) {
                let dealerPoints: number = this.calculateCardPoints(this.dealer.getHand());
                let percentChance: number = 0;

                if (dealerPoints < 10) {
                    percentChance = 100;
                } else if (dealerPoints < 19 && dealerPoints > 10) {
                    percentChance = (21 - dealerPoints - 1) * 10;
                }

                console.log(`Dealer points: ${dealerPoints}`);
                console.log(`Dealer chance to hit: ${percentChance}%`);
                let randomChance: number = Math.floor(Math.random() * 100);
                console.log(`Random chance: ${randomChance}`);

                if (percentChance > randomChance) {
                    // dealer hits
                    this.dealer.addCard(this.deck.pop()!);
                    this.showDealerHand();
                } else {
                    // dealer stands
                    this.gameActiveStatus = false;
                }
            } else {
                // game is finished or dealer turn
                this.gameActiveStatus = false;
            }
        }
    }

    private showPlayerHand(): void {
        console.log(`${this.player.getName()}'s hand: `, this.player.getHand());
    }

    private showDealerHand(): void {
        console.log(`${this.dealer.getName()}'s hand: `, this.dealer.getHand());
    }

    private validateHandOfCards(cards: ICard[]): boolean {
        const points = this.calculateCardPoints(cards);

        if (points > 21 ) {
            console.log('BUST!');
            this.gameActiveStatus = false;
            return false;
        }

        if (points === 21) {
            this.gameActiveStatus = false;
            console.log('Blackjack!');
            return false;
        }
    
        return true;
    }

    private calculateCardPoints(cards: ICard[]): number {
        let points = 0;

        for (const card of cards) {
            points += card.getValue();
        }

        return points;
    }
}
