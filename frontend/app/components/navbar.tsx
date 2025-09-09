
// Navbar: main navigation bar with links and account dialog
import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Login from "./loginForm";
import Register from "./register";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

interface NavbarProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export default function Navbar({ dialogOpen, setDialogOpen }: NavbarProps) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Log out handler: clears token and updates auth state
  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("authchange"));
      navigate("/"); // Redirect to Home
    }
  };

  return (
    <nav className="navbar bg-gradient-to-br from-blue-600 to-blue-800 drop-shadow-lg">
      <div className="flex flex-col max-md:gap-5 md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="grid grid-cols-1 justify-items-center">
          <NavLink to="/">
          <h3 className="font-bold text-blue-50">quickQuiz</h3>
          </NavLink>
        </div>
        {/* Main navigation links */}
        <div className="flex flex-row gap-3 sm:gap-5 md:gap-8 text-xl text-blue-50 font-semibold">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/quiz">Quiz</NavLink>
          <NavLink to="/scoreboard">Scoreboard</NavLink>
          {/* {isLoggedIn && <NavLink to="/users">Users</NavLink>} */}
        </div>
        {/* Account dialog and logout button */}
        <div className="flex flex-row gap-5">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-blue-700">Account</DialogTitle>
                <DialogDescription>
                  <Tabs defaultValue="login">
                    <TabsList className="bg-blue-100">
                      <TabsTrigger value="login" className="text-blue-700">Login</TabsTrigger>
                      <TabsTrigger value="register" className="text-blue-700">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <Login />
                    </TabsContent>
                    <TabsContent value="register">
                      <Register onSuccess={() => setDialogOpen(false)} />
                    </TabsContent>
                  </Tabs>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              className="bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              Log Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
