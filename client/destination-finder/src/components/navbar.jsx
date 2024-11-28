import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleAuth = () => {
    if (isLoggedIn) {
      // Perform logout logic here
      console.log("User logged out");
    } else {
      // Perform login logic here
      console.log("User logged in");
    }
    setIsLoggedIn(!isLoggedIn); // Toggle login state
  };

  return (
    <nav className="relative bg-violet-950 text-white h-16 z-20">
      {/* Navbar Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold">
          My Spots
        </Link>

        <div className="lg:hidden">
          {/* Menu Toggle Button */}
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Desktop Menu */}
        {!isLoggedIn && (
          <div className="hidden lg:flex space-x-6">
            <Link
              to="/login"
              className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
        {isLoggedIn && (
          <div className="hidden lg:flex space-x-6">
            <Link
              to="/map"
              className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
            >
              Map
            </Link>
            <Link
              to="/"
              className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
            >
              Logout
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && !isLoggedIn && (
        <div className="absolute top-full left-0 w-full bg-purple-500 lg:hidden">
          <Link
            to="/login"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)} // Close menu on click
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)} // Close menu on click
          >
            Sign Up
          </Link>
        </div>
      )}
      {menuOpen && isLoggedIn && (
        <div className="absolute top-full left-0 w-full bg-purple-500 lg:hidden">
          <Link
            to="/map"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)} // Close menu on click
          >
            Map
          </Link>
          <Link
            to="/"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)} // Close menu on click
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
