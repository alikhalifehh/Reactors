import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

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
    window.location.href = "/";
  };

  return (
    <nav className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-md fixed top-0 left-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-bold text-[#631730ff]"
        >
          Reactors 📚
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-lg font-medium text-[#631730ff] dark:text-white">
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

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-gray-800" />
            )}
          </button>

          {/* AUTH */}
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
                  className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-700">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BURGER */}
        <button
          className="md:hidden text-[#631730ff] dark:text-white"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 pb-4 shadow-lg border-t dark:border-zinc-700 text-[#631730ff] dark:text-white transition">
          <div className="px-6 py-4 flex flex-col gap-4 text-lg font-medium">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="self-start p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              {theme === "dark" ? (
                <Sun size={22} className="text-yellow-300" />
              ) : (
                <Moon size={22} className="text-gray-800" />
              )}
            </button>

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
