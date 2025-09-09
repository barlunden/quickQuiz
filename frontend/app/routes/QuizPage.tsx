

// Main quiz page: handles quiz setup, question flow, answer submission, and result display
import { useState, useEffect } from "react";
import LoginStatusMarker from "~/components/LoginStatusMarker";
import UserCard from "../components/UserCard";
import { categories } from "../lib/quizCategories";


// Type for a quiz question (from Open Trivia API)
type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: string;
  category: string;
  difficulty: string;
};


// Utility: shuffle an array (used to randomize answer order)
function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}


// Custom hook: increments key when a quiz result is saved (to refresh UserCard)
function useQuizResultKey() {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const handler = () => setKey(k => k + 1);
    window.addEventListener("quizresult", handler);
    return () => window.removeEventListener("quizresult", handler);
  }, []);
  return key;
}


// Main QuizPage component
export default function QuizPage() {
  // State for quiz questions and progress
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0); // current question index
  const [answers, setAnswers] = useState<string[]>([]); // user's answers
  const [showScore, setShowScore] = useState(false); // show results?

  // State for quiz setup form
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  // Start quiz: fetch questions from backend (which proxies Open Trivia API)
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuestions(null);
    setCurrent(0);
    setAnswers([]);
    setShowScore(false);
    const query = new URLSearchParams();
    query.append("amount", amount.toString());
    if (category) query.append("category", category.toString());
    if (difficulty) query.append("difficulty", difficulty);
    if (type) query.append("type", type);
    try {
      const res = await fetch(`http://localhost:4000/quiz?${query.toString()}`);
      const data = await res.json();
      if (data.response_code === 0) {
        setQuestions(data.results);
      } else {
        setError("No questions found for your selection.");
      }
    } catch (err) {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection: save answer and go to next question or show results
  const handleAnswer = (answer: string) => {
    setAnswers((prev) => [...prev, answer]);
    if (questions && current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowScore(true);
    }
  };

  // Save quiz result to backend when quiz is completed and user is logged in
  useEffect(() => {
    if (!showScore || !questions) return;
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem("token");
    if (!token) return;
    const score = answers.filter((a, i) => a === questions[i].correct_answer).length;
    fetch("http://localhost:4000/quiz/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        score,
        total: questions.length,
        category: questions[0]?.category,
        difficulty: questions[0]?.difficulty,
      }),
    }).then(() => {
      window.dispatchEvent(new Event("quizresult")); // triggers UserCard update
    });
  }, [showScore, questions]);

  // Restart quiz: reset all state
  const handleRestart = () => {
    setQuestions(null);
    setAnswers([]);
    setCurrent(0);
    setShowScore(false);
  };

  // Calculate score for results view
  let score = 0;
  if (showScore && questions) {
    score = answers.filter((a, i) => a === questions[i].correct_answer).length;
  }

  const quizResultKey = useQuizResultKey();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-6">
      <div className="container mx-auto max-w-5xl p-4 flex flex-col md:flex-row gap-8 h-full min-h-[70vh] md:items-stretch">
        {/* Sidebar with UserCard */}
        <aside className="w-full md:w-1/3 flex-shrink-0 flex justify-center h-full">
          <div className="w-full flex flex-col h-full items-center md:items-stretch">
            <div className="w-full max-w-xs md:max-w-none mx-auto">
              <UserCard key={quizResultKey} />
            </div>
          </div>
        </aside>
        {/* Main quiz content */}
  <main className="flex-1 h-full flex flex-col w-full md:w-2/3">
          <h2 className="text-center text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow">Take a Quiz</h2>
          {/* Quiz Setup Form */}
          {!questions && (
              <form onSubmit={handleStart} className="flex flex-col gap-4 w-full md:max-w-2xl mx-auto mt-8 bg-white/80 rounded-2xl shadow-lg border p-6">
              <label className="font-semibold">
                Number of questions:
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="border rounded p-1 ml-2 w-16 bg-blue-50"
                />
              </label>
              <label className="font-semibold">
                Category:
                <select value={category} onChange={e => setCategory(Number(e.target.value))} className="border rounded p-1 ml-2 bg-blue-50">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </label>
              <label className="font-semibold">
                Difficulty:
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border rounded p-1 ml-2 bg-blue-50">
                  <option value="">Any</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label className="font-semibold">
                Type:
                <select value={type} onChange={e => setType(e.target.value)} className="border rounded p-1 ml-2 bg-blue-50">
                  <option value="">Any</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True/False</option>
                </select>
              </label>
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg px-6 py-2 mt-2 font-bold shadow hover:scale-105 transition-all">Start quiz</button>
            </form>
          )}
          {/* Loading/Error */}
          {loading && <p className="text-center text-blue-700 font-semibold mt-6 animate-pulse">Loading questions...</p>}
          {error && <p className="text-center text-red-500 font-semibold mt-6">{error}</p>}
          {/* Quiz In Progress */}
          {questions && !showScore && (
            <div className="mt-8 bg-white/90 rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Question {current + 1} of {questions.length}</h2>
                <div className="w-1/2 bg-blue-100 rounded-full h-3 ml-4">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mb-6 text-lg font-medium text-blue-900" dangerouslySetInnerHTML={{ __html: questions[current].question }} />
              <div className="flex flex-col gap-3">
                {shuffle([
                  questions[current].correct_answer,
                  ...questions[current].incorrect_answers,
                ]).map((option) => (
                  <button
                    key={option}
                    className="border-2 border-blue-200 rounded-lg p-3 bg-blue-50 hover:bg-blue-200 hover:border-blue-400 font-semibold text-left shadow transition-all duration-150"
                    onClick={() => handleAnswer(option)}
                    dangerouslySetInnerHTML={{ __html: option }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Quiz Results */}
          {showScore && questions && (
            <div className="mt-8 bg-white/90 rounded-2xl shadow-lg border p-6">
              <h2 className="text-2xl font-bold mb-2 text-green-700">Quiz Complete!</h2>
              <p className="mb-4 text-lg">You scored <span className="font-bold text-blue-700">{score}</span> out of <span className="font-bold text-blue-700">{questions.length}</span>.</p>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Your Answers:</h3>
                <ol className="list-decimal ml-6">
                  {questions.map((q, i) => {
                    const userAnswer = answers[i];
                    const isCorrect = userAnswer === q.correct_answer;
                    return (
                      <li key={i} className="mb-3">
                        <div className="font-medium" dangerouslySetInnerHTML={{ __html: q.question }} />
                        <div>
                          Your answer: <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'} dangerouslySetInnerHTML={{ __html: userAnswer || "No answer" }} />
                        </div>
                        {!isCorrect && (
                          <div>
                            Correct answer: <span className="text-green-700 font-semibold" dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
              <button className="border-2 border-blue-300 rounded-lg p-2 bg-blue-100 hover:bg-blue-200 font-semibold shadow transition-all" onClick={handleRestart}>
                Try Again
              </button>
            </div>
          )}
          <LoginStatusMarker />
        </main>
      </div>
    </div>
  );
}
