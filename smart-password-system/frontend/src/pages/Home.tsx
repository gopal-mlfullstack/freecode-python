import { useState } from "react";
import API from "../services/api";

export default function Home() {
  const [length, setLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [result, setResult] = useState<any>(null);

  const generatePassword = async () => {
    const res = await API.post("/generate", {
      length,
      include_symbols: includeSymbols,
      include_numbers: includeNumbers,
    });
    setResult(res.data);
  };

  const getStrengthColor = (score: number) => {
    if (score < 40) return "text-red-500";
    if (score < 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🔐 Smart Password Generator
        </h1>

        <div className="mb-4">
          <label>Length: {length}</label>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex justify-between mb-4">
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            />{" "}
            Symbols
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />{" "}
            Numbers
          </label>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
        >
          Generate Password
        </button>

        {result && (
          <div className="mt-6">
            <p className="break-all bg-gray-700 p-2 rounded">
              {result.password}
            </p>
            <p className={`mt-2 ${getStrengthColor(result.strength_score)}`}>
              Strength: {result.strength_score.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
