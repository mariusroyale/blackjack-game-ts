import express from 'express';

// todo: add Game Service

const gameRoutes = express.Router();

gameRoutes.get('/game/:gameId', (req, res) => {
    const { gameId } = req.params;

    // todo: get game state from Game Service

    const game = false;

    if (!game) {
        res.status(404).json({ message: 'Game not found with id: ' + gameId });
        return;
    }
    
    res.json({});
});

gameRoutes.post('/game/startGame', (req, res) => {
    const { playerData } = req.body;

    // todo: start game with Game Service

    // const { gameId, gameState } GameService.createGame(playerData);

    // todo:can do some validation such as does the player data have names and types

    const gameId = '123';
    const gameState = 'active';

    res.json({ gameId, gameState });
});

gameRoutes.post('/game/:gameId/hit', (req, res) => {
    try {
        const { gameId } = req.params;
        const { actorData } = req.body;

        // todo: validate which actor turn it is, that is the player or the dealer
        // todo:validate game state / id
        // todo: end game with Game Service
        // GameService.hit(gameId, actorData);

        res.json({});
    } catch (error) {
        console.log(error); // implement logging
        res.status(400).json({ message: 'Bad request' });
        return;
    }
});

gameRoutes.post('/game/:gameId/stand', (req, res) => {
    try {
        const { gameId } = req.params;
        const { actorData } = req.body;

        // todo: validate which actor turn it is, that is the player or the dealer
        // todo:validate game state / id
        // todo: end game with Game Service
        // GameService.hit(gameId, actorData);

        res.json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Bad request' });
        return;
    }
});

export default gameRoutes;