
// UserCard: displays the logged-in user's quiz stats and best category
import { useEffect, useState } from "react";


export default function UserCard() {
  // State for user stats (null until loaded)
  const [stats, setStats] = useState<null | {
    nickname: string;
    totalScore: number;
    totalQuestions: number;
    percent: number;
    bestCategory?: { category: string; percent: number };
  }>(null);
  // State for error message
  const [error, setError] = useState("");

  // Fetch user stats from backend on mount and when quizresult event fires
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchStats = () => {
      const token = window.localStorage.getItem("token");
      if (!token) return;
      fetch("http://localhost:4000/quiz/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setStats(data);
        })
        .catch(() => setError("Failed to fetch user stats."));
    };
    fetchStats();
    // Listen for quizresult event to refresh stats after quiz
    window.addEventListener("quizresult", fetchStats);
    return () => window.removeEventListener("quizresult", fetchStats);
  }, []);

  // Hide card if not logged in or SSR
  if (typeof window === "undefined" || !window.localStorage.getItem("token")) return null;
  // Show error if fetch failed
  if (error) return <div className="bg-red-100 p-4 rounded">{error}</div>;
  // Show loading state
  if (!stats) return <div className="bg-gray-100 p-4 rounded">Loading user info...</div>;

  // Render user stats card
  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-2 border-blue-200/60 drop-shadow-xl rounded-2xl p-6 mt-5 mb-6 w-full max-w-xs flex flex-col items-center animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📊</span>
        <h3 className="font-extrabold text-xl text-blue-900 tracking-wide">Your Stats</h3>
      </div>
      {/* Nickname */}
      <div className="mb-2 w-full flex justify-between"><span className="font-semibold">Nickname:</span> <span>{stats.nickname}</span></div>
      {/* Total points */}
      <div className="mb-2 w-full flex justify-between"><span className="font-semibold">Total points:</span> <span className="text-blue-700 font-bold">{stats.totalScore}</span></div>
      {/* Total questions answered */}
      <div className="mb-2 w-full flex justify-between"><span className="font-semibold">Questions:</span> <span>{stats.totalQuestions}</span></div>
      {/* Correct answer percentage */}
      <div className="w-full flex justify-between"><span className="font-semibold">Correct:</span> <span className="text-green-700 font-bold">{stats.percent}%</span></div>
      {/* Best category, if available */}
      {stats.bestCategory && (
        <div className="mt-3 w-full flex flex-col items-center">
          <span className="font-semibold text-blue-800">Best category:</span>
          <span className="text-blue-700 font-bold">{stats.bestCategory.category} ({stats.bestCategory.percent}%)</span>
        </div>
      )}
    </div>
  );
}
