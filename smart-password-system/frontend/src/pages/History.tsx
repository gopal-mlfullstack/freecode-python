import { useEffect, useState } from "react";
import { getHistory } from "../services/password";

export default function History() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getHistory().then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-6">Password History</h1>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between"
          >
            <span className="break-all">{item.password}</span>
            <span>{item.strength_score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
