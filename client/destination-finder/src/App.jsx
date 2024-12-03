import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landing";
import Navbar from "./components/navbar";
import LoginPage from "./components/login";
import SignUpPage from "./components/signup";
import LeafletMap from "./components/map";
import AccountSettings from "./components/accountSettings";
import AdminDashboard from "./components/adminDashboard";
import AcceptableUse from "./components/privacyPolocies/AcceptableUse";
import DMCA from "./components/privacyPolocies/DMCA";
import PrivacyPolicy from "./components/privacyPolocies/PrivacyPolicy";
function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/map" element={<LeafletMap />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/acceptable-use" element={<AcceptableUse />} />
          <Route path="/dmca-policy" element={<DMCA />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
