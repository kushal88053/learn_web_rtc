import { Routes, Route } from "react-router-dom";
import "./App.css";
import Lobby from "./screens/Lobby";
import Room from "./screens/Room";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Correctly pass Lobby as a JSX element */}
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
