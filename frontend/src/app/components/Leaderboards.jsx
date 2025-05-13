// src/Leaderboards.jsx
import { useEffect, useState } from 'react';

export default function Leaderboards() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard') // replace with your actual endpoint
      .then(res => res.json())
      .then(data => setPlayers(data.slice(0, 50)))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top 50 Players</h1>
      <table className="table-auto w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Player</th>
            <th className="px-2 py-1">Games</th>
            <th className="px-2 py-1">Wins</th>
            <th className="px-2 py-1">Losses</th>
            <th className="px-2 py-1">Win%</th>
            <th className="px-2 py-1">Points</th>
            <th className="px-2 py-1">Streak</th>
            <th className="px-2 py-1">Joined</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={p.playerId} className="text-center">
              <td className="border px-2 py-1">{i + 1}</td>
              <td className="border px-2 py-1">{p.playerName}</td>
              <td className="border px-2 py-1">{p.totalGames}</td>
              <td className="border px-2 py-1">{p.totalWins}</td>
              <td className="border px-2 py-1">{p.totalLosses}</td>
              <td className="border px-2 py-1">{p.winPercentage}%</td>
              <td className="border px-2 py-1">{p.totalWinPoints}</td>
              <td className="border px-2 py-1">{p.highestWinStreak}</td>
              <td className="border px-2 py-1">{new Date(p.dateCreated).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
