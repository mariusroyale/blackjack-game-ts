import { useEffect, useState } from 'react';
import '../styles/modern/Leaderboards.css';
import NavBar from './components/NavBar';

export default function Leaderboards() {
  const [players, setPlayers] = useState([]);

  const API_BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://blackjack-game-ts.onrender.com"
    : "http://localhost:3000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboards`)
      .then(res => res.json())
      .then(data =>  {
        const sorted = data.sort((a, b) => b.totalWinPoints - a.totalWinPoints);
        setPlayers(sorted.slice(0, 50))
      })
      .catch(console.error);
  }, []);

  return (
    <div className="leaderboard-wrapper">
      <NavBar />
      <h1>Weekly Top 50 Players by Points</h1>
      
      <table className="table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Points</th>
            <th>Games</th>
            <th>Wins</th>
            <th>Win%</th>
            <th>Win Streak</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 && (
            <tr>
              <td colSpan="7">
                No players found :( consider hitting that PLAY button ^_^
              </td>
            </tr>
          )}

          {players.map((p, i) => (
            <tr key={p.playerId}>
              <td>{i + 1}</td>
              <td>{p.playerName}</td>
              <td>{p.totalWinPoints}</td>
              <td>{p.totalGames}</td>
              <td>{p.totalWins}</td>
              <td>{p.winPercentage}%</td>
              <td>{p.highestWinStreak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
