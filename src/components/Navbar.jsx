import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [loggedUser, setLoggedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (storedUser) setLoggedUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(`Logout from ${loggedUser.name}?`);
    if (confirmLogout) {
      localStorage.removeItem("loggedInUser");
      sessionStorage.removeItem("loggedInUser");
      setLoggedUser(null);
      setIsMenuOpen(false);
      window.location.href = "/";
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold"
          style={{ color: "#631730ff" }}
        >
          Reactors 📚
        </Link>

        {/* Nav Links */}
        <div
          className="flex gap-6 text-lg font-medium items-center"
          style={{ color: "#631730ff" }}
        >
          <Link to="/books" className="hover:underline">
            Books
          </Link>
          <Link to="/reading-list" className="hover:underline">
            Reading List
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>

          {/* Right-side: user dropdown or login/home */}
          {loggedUser ? (
            <div className="relative" ref={dropdownRef}>
              {/* User button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-5 py-2 bg-[#631730ff] text-white rounded-lg text-base font-semibold hover:bg-[#B4182D] transition"
              >
                <span>{loggedUser.name}</span>
                <span
                  className={`text-sm transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-100 rounded-lg shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-[#B4182D] hover:text-white rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : pathname === "/login" ? (
            <Link
              to="/"
              className="px-5 py-2 text-white rounded-lg text-base font-semibold transition-colors duration-300"
              style={{ backgroundColor: "#631730ff" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#B4182D")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#631730ff")
              }
            >
              Home
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 text-white rounded-lg text-base font-semibold transition-colors duration-300"
              style={{ backgroundColor: "#631730ff" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#B4182D")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#631730ff")
              }
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
