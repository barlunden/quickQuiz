import { useState } from "react";
import { Button } from "../components/ui/button";

const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 17, name: "Science & Nature" },
  { id: 23, name: "History" },
  { id: 21, name: "Sports" },
  // ...add more categories if desired
];

export default function QuizSetup({ onStart }: { onStart: (params: any) => void }) {
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ amount, category, difficulty, type });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      <label>
        Number of questions:
        <input
          type="number"
          min={1}
          max={50}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="border rounded p-1 ml-2 w-16"
        />
      </label>
      <label>
        Category:
        <select value={category} onChange={e => setCategory(Number(e.target.value))} className="border rounded p-1 ml-2">
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </label>
      <label>
        Difficulty:
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border rounded p-1 ml-2">
          <option value="">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <label>
        Type:
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded p-1 ml-2">
          <option value="">Any</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True/False</option>
        </select>
      </label>
      <Button type="submit">Start quiz</Button>
    </form>
  );
}
