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

app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 40px;
            text-align: center;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            color: #007BFF;
            text-decoration: none;
            font-size: 18px;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Hi there! 👋</h1>
        <p>Welcome to my app. This is Marius, the engineer.</p>
        <p>You landed here because you're wondering where the game is.</p>
        <a href="https://github.com/mariusroyale/blackjack-game-ts" target="_blank">👉 Check out the game on GitHub</a>
      </body>
      </html>
    `);
  });