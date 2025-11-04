import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { books as seed } from "../data/books";

export default function BooksList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [user, setUser] = useState(null);
  const [allBooks, setAllBooks] = useState([]);

  // 🔹 Load logged user and merge seed + globally added books
  useEffect(() => {
    const logged =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      JSON.parse(sessionStorage.getItem("loggedInUser"));
    setUser(logged || null);

    const globalList = JSON.parse(localStorage.getItem("global_books")) || [];
    const merged = [...seed, ...globalList];
    setAllBooks(merged);
  }, []);

  // 🔹 Filtering logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allBooks.filter((b) => {
      const matchesText =
        !q || `${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(q);
      const matchesStatus =
        status === "all"
          ? true
          : (b.status || "").toLowerCase() === status.toLowerCase();
      return matchesText && matchesStatus;
    });
  }, [query, status, allBooks]);

  // 🔹 Add book to user’s reading list
  const addToReadingList = (book) => {
    if (!user) {
      alert("Please log in to add books to your reading list.");
      return;
    }

    const key = `reading_${user.email}`;
    const list = JSON.parse(localStorage.getItem(key)) || [];
    const exists = list.some((x) => x.id === book.id);

    if (exists) {
      alert(`"${book.title}" is already in your reading list.`);
      return;
    }

    const newBook = {
      ...book,
      status: "wishlist",
      progress: 0,
      startedAt: null,
      finishedAt: null,
    };

    const updated = [...list, newBook];
    localStorage.setItem(key, JSON.stringify(updated));
    alert(`✅ "${book.title}" added to your reading list.`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative transition-colors duration-300"
      style={{ backgroundColor: "#631730ff" }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-6xl mx-auto p-4 text-white">
        {/* 🔍 Search + Filter */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center p-3 rounded-lg">
          <div className="flex-1" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or genre"
            aria-label="Search books"
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2
                       bg-white/90 text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-rose-600"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by reading status"
            className="rounded-lg border border-gray-300 px-3 py-2
                       bg-white/90 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-rose-600"
          >
            <option value="all">All</option>
            <option value="wishlist">Wishlist</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </header>

        {/* 📚 Books Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            // Check if this book exists in current user’s reading list
            const userList =
              user && JSON.parse(localStorage.getItem(`reading_${user.email}`));
            const match = userList?.find((x) => x.id === b.id);

            return (
              <li key={b.id}>
                <article className="rounded-xl border bg-white/90 text-gray-900 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4 p-4">
                    <img
                      src={b.cover}
                      alt={`${b.title} cover`}
                      className="w-20 h-28 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{b.title}</h2>
                      <p className="text-sm">{b.author}</p>
                      <p className="text-xs text-gray-600">
                        {b.genre || "Unknown Genre"}
                      </p>

                      {/* 👤 Added By */}
                      {b.addedBy && (
                        <p className="text-xs italic text-gray-500 mt-1">
                          Added by {b.addedBy}
                          {user &&
                            (b.addedBy === user.name ||
                              b.addedBy === user.email.split("@")[0]) && (
                              <span className="ml-2 text-green-700 font-semibold">
                                • You
                              </span>
                            )}
                        </p>
                      )}

                      {/* 🔹 User-specific tag */}
                      {user && match && (
                        <span
                          className={`inline-block mt-3 text-xs font-semibold tracking-wide uppercase rounded-full px-3 py-1 border shadow-sm ${
                            match.status === "finished"
                              ? "bg-green-100 border-green-400 text-green-700"
                              : match.status === "reading"
                              ? "bg-blue-100 border-blue-400 text-blue-700"
                              : "bg-amber-100 border-amber-400 text-amber-700"
                          }`}
                        >
                          {match.status.charAt(0).toUpperCase() +
                            match.status.slice(1)}
                        </span>
                      )}

                      {/* 🔸 Add to Reading List */}
                      {user && !match && (
                        <button
                          onClick={() => addToReadingList(b)}
                          className="mt-3 block text-xs bg-[#631730] text-white px-3 py-1.5 rounded-lg hover:bg-[#B4182D] transition"
                        >
                          Add to Reading List
                        </button>
                      )}

                      {/* 🔸 Placeholder for guests */}
                      {!user && (
                        <span className="inline-block mt-3 text-xs text-gray-400 italic">
                          Login to view status
                        </span>
                      )}

                      <div className="mt-3">
                        <Link
                          to={`/books/${b.id}`}
                          className="text-sm text-[#631730] font-semibold underline hover:text-rose-300"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="text-sm mt-6 text-gray-200">
            No books found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
}
