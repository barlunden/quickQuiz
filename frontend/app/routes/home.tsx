import Navbar from "~/components/navbar";
import type { Route } from "./+types/home";

import { AuthProvider, useAuth } from "../lib/AuthContext";
import { useState, useEffect } from "react";
import LoginStatusMarker from "~/components/LoginStatusMarker";
import ChallengeFriendModal from "../components/ChallengeFriendModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { isLoggedIn } = useAuth();

  // Section: Daily Quiz Question
  const [daily, setDaily] = useState<{ question: string; correct_answer: string } | null>(null);
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=1")
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results[0]) {
          setDaily({
            question: data.results[0].question,
            correct_answer: data.results[0].correct_answer,
          });
        }
      });
  }, []);

  // Section: Top 3 Scoreboard
  const [topScores, setTopScores] = useState<any[]>([]);
  useEffect(() => {
    fetch("http://localhost:4000/quiz/scoreboard")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTopScores(data.sort((a,b)=>b.totalScore-a.totalScore).slice(0,3));
      });
  }, []);

  // Section: App Stats (dummy for now)
  const [stats, setStats] = useState<{ users: number; quizzes: number; points: number }>({ users: 0, quizzes: 0, points: 0 });
  useEffect(() => {
    fetch("http://localhost:4000/quiz/scoreboard")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats({
            users: data.length,
            quizzes: data.reduce((sum,u)=>sum+u.totalQuestions,0),
            points: data.reduce((sum,u)=>sum+u.totalScore,0),
          });
        }
      });
  }, []);

  return (
    <section className="container mx-auto max-w-2xl p-4 flex flex-col gap-8">
      {/* Section: Welcome */}
      <div className="bg-blue-50 rounded-xl p-6 shadow">
        <h1 className="text-3xl font-bold mb-2">quickQuiz</h1>
        <h2 className="text-lg mb-2">The only place to satisfy your hunger for quick quizzes!</h2>
        <p className="mb-4">Test your knowledge, compete with friends, and climb the leaderboard. Choose your own quiz or just try your luck!</p>
        <LoginStatusMarker />
      </div>

      {/* Section: Call to Action */}
      <div className="flex flex-wrap gap-4 justify-center">
  <a href="/quiz" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:bg-blue-700">Start Quiz</a>
  <a href="/scoreboard" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow-xs transition-all duration-200 hover:shadow-lg hover:bg-green-700">View Scoreboard</a>
  <ChallengeFriendModal />
  {!isLoggedIn && <a href="/register" className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow-xs transition-all duration-200 hover:shadow-lg hover:bg-yellow-600">Register</a>}
      </div>

      {/* Section: Daily Quiz Question */}
      <div className="bg-white rounded-xl p-6 shadow border">
        <h3 className="text-xl font-bold mb-2">Quiz of the Day</h3>
        {daily ? (
          <>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: daily.question }} />
            <details>
              <summary className="cursor-pointer text-blue-700">Show Answer</summary>
              <div className="mt-1 text-green-700" dangerouslySetInnerHTML={{ __html: daily.correct_answer }} />
            </details>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      {/* Section: Top 3 Scoreboard */}
      <div className="bg-white rounded-xl p-6 shadow border">
        <h3 className="text-xl font-bold mb-2">Top 3 Players</h3>
        {topScores.length === 0 ? <div>No scores yet.</div> : (
          <ol className="list-decimal ml-6">
            {topScores.map((u,i) => (
              <li key={u.nickname} className="mb-2">
                <span className="font-bold">{u.nickname}</span>: {u.totalScore} points ({u.totalQuestions} questions)
                {u.bestCategory && (
                  <div className="text-sm text-blue-700 ml-2">Best category: <span className="font-semibold">{u.bestCategory.category}</span> ({u.bestCategory.percent}%)</div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Section: App Stats */}
      <div className="bg-blue-100 rounded-xl p-6 shadow border flex flex-col md:flex-row gap-6 justify-between items-center">
        <div><span className="font-bold text-2xl">{stats.users}</span> users</div>
        <div><span className="font-bold text-2xl">{stats.quizzes}</span> questions answered</div>
        <div><span className="font-bold text-2xl">{stats.points}</span> total points</div>
      </div>

      {/* Section: Tips */}
      <div className="bg-yellow-50 rounded-xl p-4 shadow border">
        <h3 className="font-semibold mb-1">Tip</h3>
        <p>You can challenge your friends by sharing your score or inviting them to the scoreboard!</p>
      </div>
    </section>
  );
}
