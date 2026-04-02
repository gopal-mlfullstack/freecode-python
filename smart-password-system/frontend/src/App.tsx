import { useState } from "react";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <div className="p-4 bg-gray-800 text-white flex gap-4">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("history")}>History</button>
      </div>

      {page === "home" ? <Home /> : <History />}
    </>
  );
}

export default App;
