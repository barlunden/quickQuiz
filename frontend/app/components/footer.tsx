
// Footer: simple navigation links for the app
export default function Footer() {
    return (
        <div className="flex flex-wrap gap-4 p-5 justify-center">
        <a href="/quiz" className="underline text-blue-700">Quiz</a>
        <a href="/scoreboard" className="underline text-green-700">Scoreboard</a>
        <a href="/register" className="underline text-yellow-700">Register</a>
        <a href="https://opentdb.com/" target="_blank" rel="noopener noreferrer" className="underline text-gray-700">Open Trivia API</a>
      </div>
    )
}