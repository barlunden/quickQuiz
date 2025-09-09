
// Login component: handles user login form, validation, and authentication
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handles form submission and validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend validation
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // If validation passes, call login
    login();
  };

  // Authenticate user with backend
  const login = async () => {
    await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
            "Content-type": "application/json"
        }
    }).then(async (data) => {
        const response = await data.json();
    if (response.token) {
      localStorage.setItem("token", response.token);
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("authchange"));
      setSuccess("You are logged in!");
      setError("");
      navigate("/");
    } else if (response.error) {
            setError(response.error)
        } else {
            setError("Something went wrong, please try again later.");
        }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col text-left w-full gap-5">
      <p>Log in to your existing account</p>
      <div>
        <Label className="pb-2" htmlFor="email">Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
          placeholder="Email"
        />
      </div>
      <div>
        <Label className="pb-2" htmlFor="password">Password</Label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
          placeholder="Password"
        />
      </div>
      <Button type="submit">Submit</Button>
      {/* Show error or success messages */}
      {error && <p className="bg-red-500 text-white p-4 rounded-xl">{error}</p>}
      {success && (
        <p className="bg-green-500 text-white p-4 rounded-xl">{success}</p>
      )}
    </form>
  );
}
