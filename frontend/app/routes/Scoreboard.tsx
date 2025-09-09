import { useEffect, useState } from "react";
import LoginStatusMarker from "~/components/LoginStatusMarker";

type UserScore = {
  nickname: string;
  totalScore: number;
  totalQuestions: number;
  percent: number;
};

export default function Scoreboard() {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/quiz/scoreboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setScores(data);
      })
      .catch(() => setError("Failed to fetch scoreboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading scoreboard...</div>;
  if (error) return <div className="bg-red-100 p-4 rounded">{error}</div>;

  // Sort for each board
  const byTotal = [...scores].sort((a, b) => b.totalScore - a.totalScore);
  const byPercent = [...scores].filter(u => u.totalQuestions >= 10).sort((a, b) => b.percent - a.percent);

  // Trophy/crown icons for top 3
  const icons = [
    <span key="gold" title="1st" className="inline-block mr-1">🥇</span>,
    <span key="silver" title="2nd" className="inline-block mr-1">🥈</span>,
    <span key="bronze" title="3rd" className="inline-block mr-1">🥉</span>,
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow">Scoreboard</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Total Points Board */}
        <div className="flex-1 border-2 border-blue-400/30 rounded-2xl drop-shadow-lg bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 transition-all duration-300 hover:scale-[1.03] hover:drop-shadow-2xl p-5 relative overflow-hidden">
          <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">Total Points <span className="text-2xl">🏆</span></h2>
          <ol className="ml-2">
            {byTotal.map((u, i) => (
              <li
                key={u.nickname}
                className={`mb-3 flex items-center gap-2 ${i === 0 ? "bg-yellow-100/80 border-l-4 border-yellow-400 pl-2 font-bold scale-105 shadow-lg" : i < 3 ? "font-semibold" : ""} rounded transition-all duration-200`}
              >
                {i < 3 && icons[i]}
                <span className="font-bold text-blue-900">{u.nickname}</span>
                <span className="text-blue-700">{u.totalScore} pts</span>
                <span className="text-xs text-gray-500">({u.totalQuestions} q)</span>
              </li>
            ))}
          </ol>
        </div>
        {/* Highest Accuracy Board */}
        <div className="flex-1 border-2 border-blue-400/30 rounded-2xl drop-shadow-lg bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 transition-all duration-300 hover:scale-[1.03] hover:drop-shadow-2xl p-5 relative overflow-hidden">
          <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">Highest Accuracy <span className="text-2xl">🎯</span> <span className="text-xs text-gray-500">(min 10 questions)</span></h2>
          <ol className="ml-2">
            {byPercent.map((u, i) => (
              <li
                key={u.nickname}
                className={`mb-3 flex items-center gap-2 ${i === 0 ? "bg-green-100/80 border-l-4 border-green-400 pl-2 font-bold scale-105 shadow-lg" : i < 3 ? "font-semibold" : ""} rounded transition-all duration-200`}
              >
                {i < 3 && icons[i]}
                <span className="font-bold text-blue-900">{u.nickname}</span>
                <span className="text-green-700">{u.percent}%</span>
                <span className="text-xs text-gray-500">({u.totalQuestions} q)</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <LoginStatusMarker />
    </div>
  );
}
