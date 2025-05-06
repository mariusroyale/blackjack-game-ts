import { Deck } from '../../models/Deck';
import { PlayerType } from '../../interfaces/Player';

describe('Deck', () => {
    let deck: Deck;
    
    beforeEach(() => {
        deck = new Deck();
    });

    it('should create a new deck with cards initialized', () => {
        expect(deck).toBeDefined();
        expect(deck['deckSeed']).not.toBeNull();
        expect(deck['deckSeedHash']).not.toBeNull();
        expect(deck.numberOfCardsInDeck).toBeGreaterThan(1);
    });
});