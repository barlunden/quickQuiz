
// LoginStatusMarker: shows a floating indicator of login status (bottom right)
import { useAuth } from "../lib/AuthContext";

export default function LoginStatusMarker() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-lg border border-gray-200">
      {/* Colored icon and checkmark/exclamation for status */}
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-base font-bold ${
          isLoggedIn ? "bg-green-500" : "bg-red-400"
        }`}
        title={isLoggedIn ? "Logged in" : "Not logged in"}
      >
        {isLoggedIn ? "\u2713" : "!"}
      </span>
      <span className="text-gray-800 font-semibold text-sm">
        Login Status:{" "}
        <span className={isLoggedIn ? "text-green-600" : "text-red-600"}>
          {isLoggedIn ? "Logged in" : "Not logged in"}
        </span>
      </span>
    </div>
  );
}