// src/SaveStatsPopup.jsx
export default function SaveStatsPopup({ visible, onSave, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Save Game Stats?</h2>
        <p className="mb-4">Would you like to save your session stats to the leaderboard?</p>
        <div className="flex justify-around">
          <button
            onClick={onSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
