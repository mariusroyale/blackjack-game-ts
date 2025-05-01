import express, { Request, Response } from 'express';
import { GameService } from '../services/GameService';

const gameRoutes = express.Router();
// We place GameService here because we want to persist to memory the games map data
const gameService = new GameService(); 

gameRoutes.get('/game/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    // todo: get game state from Game Service
    const game = false;

    if (!game) {
        res.status(404).json({ message: 'Game not found with id: ' + id });
        return;
    }
    
    res.json({});
});

gameRoutes.post('/game/startGame', (req: Request, res: Response) => {
    const { playerData } = req.body;

    if (!playerData) {
        res.status(400).json({ message: 'Bad request, missing player data' });
        return;
    }

    try {
        const { gameId, state } = gameService.createGame(playerData);
        res.json({ gameId, state });
    } catch (error) {
        console.error('Error starting the game:', error);
        res.status(500).json({ error: 'Failed to start the game.' });
    }
});

gameRoutes.post('/game/:id/hit', (req: Request, res: Response) => {
    const { id } = req.params;
    const { playerData } = req.body;

    if (!playerData) {
        res.status(400).json({ message: 'Bad request, missing player data' });
        return;
    } 

    try {
        const game = gameService.actionHit(id, playerData[0]);

        if (!game) {
            res.status(404).json({ message: 'Game not found with id: ' + id });
            return;
        }

        const { gameId, state } = game;
        res.json({ gameId, state });
    } catch (error) {
        console.log(error); // implement logging
        res.status(400).json({ message: error });
    }
});

gameRoutes.post('/game/:id/stand', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { playerData } = req.body;

        // todo: validate which actor turn it is, that is the player or the dealer
        // todo:validate game state / id
        // todo: end game with Game Service
        // GameService.hit(id, actorData);

        res.json({});
    } catch (error) {
        console.log(error); // implement logging
        res.status(400).json({ message: error });
    }
});

export default gameRoutes;