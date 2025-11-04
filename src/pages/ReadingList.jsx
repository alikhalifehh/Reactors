import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ReadingListPage() {
  const navigate = useNavigate();

  //LOGIN CHECK
  useEffect(() => {
    const loggedIn =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (!loggedIn) {
      const banner = document.createElement("div");
      banner.textContent = "⚠ Please log in to access Reading List.";
      banner.style.position = "fixed";
      banner.style.top = "80px";
      banner.style.left = "50%";
      banner.style.transform = "translateX(-50%)";
      banner.style.background = "#fef08a";
      banner.style.color = "#63320c";
      banner.style.padding = "10px 20px";
      banner.style.borderRadius = "8px";
      banner.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      banner.style.zIndex = "9999";
      document.body.appendChild(banner);
      setTimeout(() => {
        banner.remove();
        navigate("/login");
      }, 2000);
    }
  }, [navigate]);

  // 🔹 rotating backgrounds (keep original)
  const bgImages = [
    "/src/assets/book.jpg",
    "/src/assets/book2.jpg",
    "/src/assets/book3.jpg",
    "/src/assets/book4.jpg",
    "/src/assets/book5.jpg",
  ];

  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setBgIndex((p) => (p + 1) % bgImages.length),
      7000
    );
    return () => clearInterval(t);
  }, [bgImages.length]);

  // 🔹 user + their books
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");

  // 🔹 Load logged user + their reading list
  useEffect(() => {
    const u =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      JSON.parse(sessionStorage.getItem("loggedInUser"));
    setUser(u || null);

    if (!u) {
      setBooks([]);
      return;
    }

    const key = `reading_${u.email}`;
    const saved = JSON.parse(localStorage.getItem(key));
    setBooks(Array.isArray(saved) ? saved : []);
  }, []);

  // 🔹 Persist helper (save to localStorage)
  const persist = (next) => {
    setBooks(next);
    if (!user) return;
    localStorage.setItem(`reading_${user.email}`, JSON.stringify(next));
  };

  // 🔹 Filters
  const filters = [
    { key: "all", label: "All" },
    { key: "reading", label: "Reading" },
    { key: "finished", label: "Finished" },
    { key: "wishlist", label: "Wishlist" },
  ];

  // 🔹 Helper functions
  function daysBetween(a, b) {
    const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  function daysReading(book) {
    if (book.status === "reading" && book.startedAt) {
      return daysBetween(book.startedAt, new Date());
    }
    if (book.status === "finished" && book.startedAt && book.finishedAt) {
      return daysBetween(book.startedAt, book.finishedAt);
    }
    return null;
  }

  const visible = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  // 🔹 Actions
  function markDone(id) {
    const next = books.map((b) =>
      b.id === id
        ? {
            ...b,
            status: "finished",
            progress: 100,
            finishedAt: new Date().toISOString().slice(0, 10),
          }
        : b
    );
    persist(next);
  }

  function startReading(id) {
    const today = new Date().toISOString().slice(0, 10);
    const next = books.map((b) =>
      b.id === id && b.status === "wishlist"
        ? { ...b, status: "reading", progress: 1, startedAt: today }
        : b
    );
    persist(next);
  }

  function removeBook(id) {
    const book = books.find((b) => b.id === id);
    const confirmRemove = window.confirm(
      `Are you sure you want to remove "${
        book?.title || "this book"
      }" from your reading list?`
    );
    if (!confirmRemove) return;

    const next = books.filter((b) => b.id !== id);
    persist(next);
  }

  function bumpProgress(id, delta) {
    const next = books.map((b) =>
      b.id === id
        ? {
            ...b,
            progress: Math.max(0, Math.min(100, (b.progress || 0) + delta)),
          }
        : b
    );
    persist(next);
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center transition-all duration-[1500ms]"
      style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <Navbar />

      <main className="relative flex-grow w-full flex flex-col items-center px-6 pt-24 pb-16 text-white">
        <div className="w-full max-w-6xl space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold drop-shadow">
                My Library
              </h1>
              <p className="text-sm text-white/80">
                Track your current reads, progress, and history.
              </p>
            </div>

            <div className="bg-white/90 text-gray-900 rounded-2xl shadow p-1 flex items-center gap-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={
                    "px-3 py-1.5 rounded-xl text-sm font-semibold transition " +
                    (filter === f.key
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100")
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </header>

          {/* 🔹 Books Section */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((book) => {
              const d = daysReading(book);
              const statusBadge =
                book.status === "finished"
                  ? "bg-green-100 text-green-700"
                  : book.status === "reading"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700";

              return (
                <article
                  key={book.id}
                  className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-4 flex flex-col"
                >
                  <div className="flex gap-4">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-28 w-20 rounded-md object-cover border"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-gray-900 leading-tight">
                          {book.title}
                        </h3>
                        <span
                          className={
                            "text-[10px] px-2 py-0.5 rounded-full font-medium " +
                            statusBadge
                          }
                        >
                          {book.status === "reading"
                            ? "Reading"
                            : book.status === "finished"
                            ? "Finished"
                            : "Wishlist"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {book.author}
                      </p>

                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] text-gray-600">
                          <span>Progress</span>
                          <span>{book.progress || 0}%</span>
                        </div>
                        <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={
                              "h-full " +
                              (book.progress === 100
                                ? "bg-green-500"
                                : book.progress > 0
                                ? "bg-blue-500"
                                : "bg-gray-400")
                            }
                            style={{ width: `${book.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      {d !== null && (
                        <p className="mt-2 text-[11px] text-gray-500">
                          {book.status === "finished"
                            ? `Read in ${d} day${d === 1 ? "" : "s"}`
                            : `Reading for ${d} day${d === 1 ? "" : "s"}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 text-xs">
                    {book.status === "reading" && (
                      <>
                        <button
                          onClick={() => bumpProgress(book.id, +5)}
                          className="flex-1 rounded-lg bg-blue-400 text-black py-2 font-semibold hover:bg-blue-300 transition"
                        >
                          +5%
                        </button>
                        <button
                          onClick={() => bumpProgress(book.id, -5)}
                          className="flex-1 rounded-lg bg-blue-400 text-black py-2 font-semibold hover:bg-blue-300 transition"
                        >
                          -5%
                        </button>
                        <button
                          onClick={() => markDone(book.id)}
                          className="flex-1 rounded-lg bg-gray-900 text-white py-2 font-semibold hover:bg-gray-800 active:scale-[0.99] transition"
                        >
                          Mark Done
                        </button>
                      </>
                    )}

                    {book.status === "wishlist" && (
                      <button
                        onClick={() => startReading(book.id)}
                        className="flex-1 rounded-lg bg-gray-900 text-white py-2 font-semibold hover:bg-gray-800 active:scale-[0.99] transition"
                      >
                        Start Reading
                      </button>
                    )}

                    <button
                      onClick={() => removeBook(book.id)}
                      className="flex-1 rounded-lg bg-red-500 text-black py-2 font-semibold hover:bg-red-400 transition"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {/* 🔹 Empty State */}
          {visible.length === 0 && (
            <div className="bg-white/90 text-gray-900 rounded-2xl shadow p-6 text-center">
              <p className="text-sm">
                {user
                  ? "No books in your reading list yet."
                  : "Please login to access your reading list."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
