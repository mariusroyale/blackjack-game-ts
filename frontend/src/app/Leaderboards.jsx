import { useEffect, useState } from 'react';
import '../styles/Leaderboards.css';
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
    <div className="p-6">
      <NavBar />
      <h1 className="text-xl font-bold mb-4">Weekly Top 50 Players by points</h1>
      <table className="table-auto w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Player</th>
            <th className="px-2 py-1">Points</th>
            <th className="px-2 py-1">Games</th>
            <th className="px-2 py-1">Wins</th>
            <th className="px-2 py-1">Win%</th>
            <th className="px-2 py-1">Win Streak</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 && (
            <tr>
              <td colSpan="7" className="border px-2 py-1 text-center">
                No players found :( consider hitting that PLAY button ^_^
              </td>
            </tr>
          )}

          {players.map((p, i) => (
            <tr key={p.playerId} className="text-center">
              <td className="border px-2 py-1">{i + 1}</td>
              <td className="border px-2 py-1">{p.playerName}</td>
              <td className="border px-2 py-1">{p.totalWinPoints}</td>
              <td className="border px-2 py-1">{p.totalGames}</td>
              <td className="border px-2 py-1">{p.totalWins}</td>
              <td className="border px-2 py-1">{p.winPercentage}%</td>
              <td className="border px-2 py-1">{p.highestWinStreak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
