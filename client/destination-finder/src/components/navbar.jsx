import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nickname, setNickname] = useState("User");
  const [role, setRole] = useState(""); // Track the user's role

  const { user, logout, getProfile } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (isLoggedIn) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfile();
          setNickname(profile.nickname || "User");
          setRole(profile.role || "user"); // Default role is "user"
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };
      fetchProfile();
    }
  }, [isLoggedIn, getProfile]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isAdminOrManager = role === "admin" || role === "manager"; // Check role

  return (
    <nav
      className={`relative text-white h-16 z-20 ${
        isAdminOrManager ? "bg-gray-950" : "bg-violet-950"
      }`}
    >
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
        {isLoggedIn && (
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/privacy-policy"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setPolicyDropdownOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              to="/dmca-policy"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setPolicyDropdownOpen(false)}
            >
              DMCA Policy
            </Link>
            <Link
              to="/acceptable-use"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setPolicyDropdownOpen(false)}
            >
              Acceptable Use Policy
            </Link>
            <Link
              to="/map"
              className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
            >
              Map
            </Link>
            {isAdminOrManager && (
              <Link
                to="/admin-dashboard"
                className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium"
              >
                Admin Dashboard
              </Link>
            )}
            {/* Nickname and Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-slate-400 hover:text-green-600 px-3 py-2 text-base font-medium focus:outline-none"
              >
                {role === "admin" ? "Admin" : nickname}
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

        {/* Desktop Menu for not logged in */}
        {!isLoggedIn && (
          <div className="hidden lg:flex space-x-6">
            <Link
              to="/privacy-policy"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setPolicyDropdownOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              to="/dmca-policy"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setPolicyDropdownOpen(false)}
            >
              DMCA Policy
            </Link>
            <Link
              to="/acceptable-use"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setPolicyDropdownOpen(false)}
            >
              Acceptable Use Policy
            </Link>
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-purple-500 lg:hidden">
          {isLoggedIn ? (
            <>
              <Link
                to="/map"
                className="block py-2 px-4 hover:bg-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Map
              </Link>
              {isAdminOrManager && (
                <Link
                  to="/admin-dashboard"
                  className="block py-2 px-4 hover:bg-purple-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/account-settings"
                className="block py-2 px-4 hover:bg-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Account Settings
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="block w-full text-left py-2 px-4 hover:bg-purple-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 px-4 hover:bg-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block py-2 px-4 hover:bg-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            to="/privacy-policy"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)}
          >
            Privacy Policy
          </Link>
          <Link
            to="/dmca-policy"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)}
          >
            DMCA Policy
          </Link>
          <Link
            to="/acceptable-use"
            className="block py-2 px-4 hover:bg-purple-400"
            onClick={() => setMenuOpen(false)}
          >
            Acceptable Use Policy
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
