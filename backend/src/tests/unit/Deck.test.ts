import { Deck } from '../../models/Deck'
import { PlayerType } from '../../interfaces/Player'

describe('Deck', () => {
    let deck = new Deck('', false)
    let deckSeed = ''
    
    beforeEach(() => {
        
    })

    it('should create a new deck with cards initialized', () => {
        expect(deck).toBeDefined()
        expect(deck['deckSeed']).not.toBeNull()
        expect(deck['deckSeedHash']).not.toBeNull()
        expect(deck.numberOfCardsInDeck).toBeGreaterThan(1)
        deckSeed = deck.getDeckSeed()
    })

    it('should shuffle deck', () => {
        // get a copy of the deck cards
        let deckOfCards = [...deck.getDeck()]
        // shuffle
        deck.shuffleDeck()
        let shuffledDeckOfCards = deck.getDeck()
        // compare origina deck with the shuffled deck
        const isSameOrder = deckOfCards.every(
            (card, index) => card.id === shuffledDeckOfCards[index].id
        )
        // assert
        expect(isSameOrder).toBe(false)
    })

    it('should rebuild identical deck based on deck seed', () => {
        // lets make sure deck seed is not empty
        expect(deckSeed).not.toBe('')
        let originalCardDeck = deck.getDeck()
        // create new deck
        let newDeck = new Deck(deckSeed, true)
        let newDeckCardDeck = newDeck.getDeck()
        // compare original deck with new deck
        const isSameOrder = originalCardDeck.every((card, index) => {
            return card.suit === newDeckCardDeck[index].suit && card.rank === newDeckCardDeck[index].rank
        })
        // assert
        expect(isSameOrder).toBe(true)
    })
})