import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { books as seed } from "../data/books";

export default function BooksList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seed.filter((b) => {
      const matchesText =
        !q || `${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(q);
      const matchesStatus = status === "all" ? true : b.status === status;
      return matchesText && matchesStatus;
    });
  }, [query, status]);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundColor: "#631730ff",
      }}
    >
      {/* Optional slight overlay to keep consistent style */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 text-white">
        {/* ⬇️ Added a soft panel behind controls for contrast */}
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center p-3 rounded-lg">
          <div className="flex-1" />

          {/* ✅ High-contrast input */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or genre"
            aria-label="Search books"
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2
                       bg-white/90 text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-rose-600"
          />

          {/* ✅ High-contrast select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by reading status"
            className="rounded-lg border border-gray-300 px-3 py-2
                       bg-white/90 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-rose-600"
          >
            <option value="all">All</option>
            <option value="planned">Planned</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
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
                      {b.genre} • {b.year}
                    </p>

                    {/* Optional: color-coded status badge */}
                    <span
                      className={
                        "inline-block mt-2 text-xs rounded-full px-2 py-0.5 border " +
                        (b.status === "completed"
                          ? "bg-green-100 border-green-300 text-green-800"
                          : b.status === "reading"
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-gray-100 border-gray-300 text-gray-800")
                      }
                    >
                      {b.status}
                    </span>

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
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="text-sm mt-6 text-gray-200">
            No books match your search/filter.
          </p>
        )}
      </div>
    </div>
  );
}
