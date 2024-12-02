import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you use an AuthContext to manage auth

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nickname, setNickname] = useState("User"); // Default nickname

  const { user, logout, getProfile } = useAuth(); // Use `useAuth` to get the user, logout function, and profile fetcher
  const isLoggedIn = !!user; // Check if a user is logged in

  useEffect(() => {
    if (isLoggedIn) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfile();
          setNickname(profile.nickname || "User");
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };
      fetchProfile();
    }
  }, [isLoggedIn, getProfile]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/map"
              className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
            >
              Map
            </Link>
            {/* Nickname and Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium focus:outline-none"
              >
                {nickname} {/* Display the nickname */}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <Link
                    to="/account-settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
            to="/account-settings"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)} // Close menu on click
          >
            Account Settings
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false); // Close menu
              logout(); // Logout user
            }}
            className="block w-full text-left py-2 px-4 hover:bg-purple-400"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
