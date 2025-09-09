import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


// AuthContext: provides login state and updater to the app
// (imports are above)

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (val: boolean) => {},
});

// AuthProvider: wraps app and manages login state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Set initial status from localStorage
    setIsLoggedIn(!!localStorage.getItem("token"));

    // Listen for changes in localStorage (other tabs)
    const onStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", onStorage);

    // Listen for custom event in same tab
    const onAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("authchange", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authchange", onAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth: hook to access login state and updater
export function useAuth() {
  return useContext(AuthContext);
}