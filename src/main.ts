import { Blackjack } from "./Blackjack";
import { Player } from "./models/Player";
import { Dealer } from "./models/Dealer";

const player = new Player("Marius");
const dealer = new Dealer("Ace Dealer")

const BlackjackGame = new Blackjack(player, dealer);

const deck = BlackjackGame.getDeck();

BlackjackGame.startGame();

