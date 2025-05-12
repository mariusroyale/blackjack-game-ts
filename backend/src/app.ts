import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';
import { generalRateLimiter } from './middlewares/rateLimiter';

const app = express();

// Add rate limiter
app.use(generalRateLimiter);
// Add cors
app.use(cors());
// Prepare for json payloads
app.use(express.json());
// Register game routes
app.use('/api', gameRoutes);

export default app;