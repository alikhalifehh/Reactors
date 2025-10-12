// Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold" style={{ color: "#631730ff" }}>
          Reactors 📚
        </Link>

        {/* Nav Links */}
        <div className="flex gap-6 text-lg font-medium" style={{ color: "#631730ff" }}>
          <Link to="/books" className="hover:underline">Books</Link>
          <Link to="/reading-list" className="hover:underline">Reading List</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>

          {/* Login Button */}
          <Link
            to="/login"
            className="px-5 py-2 text-white rounded-lg text-base font-semibold transition-colors duration-300"
            style={{ backgroundColor: "#631730ff" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#B4182D")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#631730ff")}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
