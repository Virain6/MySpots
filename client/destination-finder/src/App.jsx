import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/landing";
import Navbar from "./components/navbar";
import LoginPage from "./components/login";
import SignUpPage from "./components/signup";
import LeafletMap from "./components/map";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/map" element={<LeafletMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
