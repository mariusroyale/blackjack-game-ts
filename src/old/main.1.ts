import { CardsDeck } from './cardDeck';
import { Player } from './players';
import * as readlineSync from 'readline-sync';

// create game inputs for Black Jack game.
// 1. Each turn, draw Card option until 21 is reached. If over 21, you loose and game ends.
// 2. End Turn


const cardsDeck = new CardsDeck();
const player1 = new Player('Marius', 'human', cardsDeck);

console.log('Welcome to BlackJack Cards Game ' + player1.getPlayerName() + '!');

// first card is drawn by default
player1.drawCard();

let drawCard = true;
let turnCounter = 1;

while (drawCard === true) {
    console.log('Turn ' + turnCounter); 
    // display current hand of cards
    console.log('Current hand of cards: ' + player1.getHandOfCards());
    console.log('Current sum of cards: ' + cardsDeck.calculatePlayerCardsSum(player1));
    let input: string = readlineSync.question('Would you like to draw another card? (y/n): ');

    if (input === 'y') {
        player1.drawCard();
    } else {
        drawCard = false;
    }

    turnCounter++;

    // pre-validation
    if (cardsDeck.validatePlayerHandOfCards(player1) === false) {
        drawCard = false;
    }
}

console.log('Current hand of cards: ' + player1.getHandOfCards());
console.log('Current sum of cards: ' + cardsDeck.calculatePlayerCardsSum(player1));

console.log('Thank you for playing! $$$');