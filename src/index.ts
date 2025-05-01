import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', gameRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
