
// ChallengeFriendModal: modal dialog for sending a quiz challenge to a friend (mocked)
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


export default function ChallengeFriendModal() {
  // State for email input, sent status, and error message
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission: validate email and simulate sending challenge
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);
    // TODO: Send challenge to backend (not implemented)
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Simulate success (mocked)
    setTimeout(() => setSent(true), 700);
  };

  // Render modal dialog
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-pink-600 shadow-xs transition-all duration-200 hover:shadow-lg  hover:bg-pink-700 text-white font-semibold w-full sm:w-auto"
        >
          Challenge a friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogClose className="absolute top-2 right-2" />
        <h2 className="text-xl font-bold mb-2">Challenge a Friend</h2>
        <p className="mb-4">
          Enter your friend's email address to send them a fun quiz challenge!
        </p>
        <i>This feature is not fully developed due to the scope of the original assignment.</i>
        {/* Show success message if sent, otherwise show form */}
        {sent ? (
          <div className="text-green-700 font-semibold">
            Challenge sent! Your friend will receive an email soon 🎉
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Friend's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Show error if email is invalid */}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold"
            >
              Send Challenge
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
