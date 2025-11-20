import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { theme, toggleTheme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-bold"
          style={{ color: "#631730ff" }}
        >
          Reactors 📚
        </Link>

        {/* DESKTOP MENU */}
        <div
          className="hidden md:flex items-center gap-6 text-lg font-medium"
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
          <Link to="/add" className="hover:underline">
            Add & Edit
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-300" />
            ) : (
              <Moon size={18} className="text-gray-800" />
            )}
          </button>

          {/* AUTH SECTION */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 bg-[#631730ff] text-white rounded-lg hover:bg-[#B4182D] transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 border border-[#631730ff] text-[#631730ff] rounded-lg hover:bg-[#63173015] transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 bg-[#631730ff] text-white rounded-lg hover:bg-[#B4182D] transition"
              >
                <span>{user.name}</span>
                <span
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg text-gray-700 border">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BURGER ICON */}
        <button
          className="md:hidden text-[#631730ff]"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white pb-4 shadow-lg border-t text-[#631730ff]">
          <div className="px-6 py-4 flex flex-col gap-4 text-lg font-medium">
            <Link to="/books" onClick={() => setMobileOpen(false)}>
              Books
            </Link>
            <Link to="/reading-list" onClick={() => setMobileOpen(false)}>
              Reading List
            </Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)}>
              Profile
            </Link>
            <Link to="/add" onClick={() => setMobileOpen(false)}>
              Add & Edit
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 w-full text-center px-5 py-2 bg-[#631730ff] text-white rounded-lg hover:bg-[#B4182D] transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-5 py-2 border border-[#631730ff] text-[#631730ff] rounded-lg hover:bg-[#63173015] transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-2 w-full px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
