import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { booksApi, userBooksApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

import { fetchGoogleCover } from "../utils/fetchCover";
import { getCachedCover, cacheCover } from "../utils/coverCache";

export default function BooksList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await booksApi.getAll();
        const rawBooks = res.data;

        setBooks(rawBooks);

        const uniqueGenres = Array.from(
          new Set(rawBooks.map((b) => b.genre).filter(Boolean))
        );
        setGenres(uniqueGenres);

        rawBooks.forEach(async (b) => {
          if (b.coverImage) return;

          const cached = getCachedCover(b.title);
          if (cached) {
            setBooks((prev) =>
              prev.map((x) =>
                x._id === b._id ? { ...x, coverImage: cached } : x
              )
            );
            return;
          }

          const autoCover = await fetchGoogleCover(b.title);

          if (autoCover) {
            cacheCover(b.title, autoCover);

            setBooks((prev) =>
              prev.map((x) =>
                x._id === b._id ? { ...x, coverImage: autoCover } : x
              )
            );
          }
        });
      } catch {
        console.log("Could not load books");
      }
    }

    load();
  }, []);

  async function addToList(bookId) {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await userBooksApi.create({
        bookId,
        status: "wishlist",
        progress: 0,
      });

      alert("Book added to your list");
    } catch (err) {
      const msg = err?.response?.data?.message;
      alert(msg || "Could not add book");
    }
  }

  const filteredBooks = books.filter((b) => {
    const matchesTitle = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = activeGenre === "all" || b.genre === activeGenre;
    return matchesTitle && matchesGenre;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-[#140404] text-white" : "bg-[#FFFCE0] text-black"
    }`}>
      <Navbar />

      <div className="max-w-7xl mx-auto pt-24 px-6 pb-20">
        <h1 className="text-3xl font-bold mb-6">Explore Books</h1>

        {/* SEARCH + GENRE FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* SEARCH BAR */}
          <input
            placeholder="Search by title"
            className={`w-full sm:w-80 p-2 rounded-md border transition-colors ${
              theme === "dark"
                ? "bg-zinc-900 border-zinc-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-black placeholder-gray-500"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* GENRE FILTERS */}
          <div className={`p-1 rounded-lg flex gap-1 flex-wrap ${
            theme === "dark" ? "bg-zinc-900" : "bg-gray-200"
          }`}>
            <button
              onClick={() => setActiveGenre("all")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                activeGenre === "all"
                  ? "bg-pink-600 text-white"
                  : theme === "dark"
                  ? "hover:bg-zinc-700 text-gray-300"
                  : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              All
            </button>

            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  activeGenre === g
                    ? "bg-pink-600 text-white"
                    : theme === "dark"
                    ? "hover:bg-zinc-700 text-gray-300"
                    : "hover:bg-gray-300 text-gray-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* BOOK GRID */}
        {filteredBooks.length === 0 ? (
          <p className={`mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            No books found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((b) => (
              <div
                key={b._id}
                onClick={() => navigate(`/books/${b._id}`)}
                className={`rounded-xl shadow-lg p-5 flex flex-col transition cursor-pointer ${
                  theme === "dark"
                    ? "bg-zinc-700 hover:bg-zinc-800 border border-zinc-800"
                    : "bg-[#BAAE93] hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {/* COVER */}
                {b.coverImage ? (
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className={`h-48 w-full object-cover rounded-lg ${
                      theme === "dark" ? "border border-zinc-700" : "border border-gray-300"
                    }`}
                  />
                ) : (
                  <img
                    src={
                      theme === "dark"
                        ? "https://via.placeholder.com/300x450/18181b/ffffff?text=No+Cover"
                        : "https://via.placeholder.com/300x450/f3f4f6/000000?text=No+Cover"
                    }
                    alt="No cover"
                    className={`h-48 w-full object-cover rounded-lg ${
                      theme === "dark" ? "border border-zinc-700" : "border border-gray-300"
                    }`}
                  />
                )}

                {/* TITLE + AUTHOR */}
                <h3 className="text-lg font-semibold mt-4">{b.title}</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {b.author}
                </p>

                {/* DESCRIPTION */}
                <p className={`mt-3 text-xs line-clamp-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  {b.description || "No description provided"}
                </p>

                {/* BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToList(b._id);
                  }}
                  className="mt-auto px-4 py-2 bg-pink-600 rounded-md text-sm font-semibold hover:bg-pink-500 text-white transition-colors"
                >
                  Add to My List
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}