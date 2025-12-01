import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { booksApi, userBooksApi, authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import { fetchGoogleCover } from "../utils/fetchCover";
import { getCachedCover, cacheCover } from "../utils/coverCache";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [book, setBook] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true);

        const res = await booksApi.getOne(id);
        let current = res.data;

        if (current.createdBy) {
          try {
            const resp = await authApi.getUser(current.createdBy);
            setCreatorName(resp.data.user?.name || "Unknown");
          } catch (err) {
            console.error("Creator fetch failed:", err);
            setCreatorName("Unknown");
          }
        } else {
          setCreatorName("Unknown");
        }

        if (!current.coverImage) {
          const cached = getCachedCover(current.title);

          if (cached) {
            current.coverImage = cached;
          } else {
            const fetched = await fetchGoogleCover(current.title);
            if (fetched) {
              cacheCover(current.title, fetched);
              current.coverImage = fetched;
            }
          }
        }

        setBook(current);

        const all = await booksApi.getAll();
        const sameAuthor = all.data.filter(
          (b) => b.author === current.author && b._id !== id
        );

        setOthers(sameAuthor);
      } catch (err) {
        console.error("Error loading book:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  async function addToList() {
    if (!user) return navigate("/login");
    if (!book) return;

    try {
      setAdding(true);
      await userBooksApi.create({
        bookId: book._id,
        status: "wishlist",
        coverImage: book.coverImage,
      });
      alert("Added to your reading list");
    } catch (err) {
      alert(err?.response?.data?.message || "Could not add this book");
    } finally {
      setAdding(false);
    }
  }

  // Loading screen
  if (loading || !book) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"}`}>
        <Navbar />
        <main className="max-w-4xl mx-auto pt-28 pb-20 px-6 text-center">
          Loading book details…
        </main>
        <Footer />
      </div>
    );
  }

  const addedOn = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString()
    : null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ?  "bg-[#140404] text-white"
            : "bg-[#FFFCE0] text-black"}`}>
      <Navbar />

      <main className="max-w-6xl mx-auto pt-24 pb-20 px-4 sm:px-6 space-y-10">
        <button
          onClick={() => navigate("/books")}
          className={`text-sm mb-2 transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}
        >
          ← Back to all books
        </button>

        {/* MAIN INFO BLOCK */}
        <section className={`rounded-3xl shadow-2xl overflow-hidden transition-colors ${
          theme === "dark" 
            ? "bg-[#1e293b] border border-zinc-800" 
            : "bg-gray-200 border border-gray-200"
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-[290px,1fr]">
            {/* COVER IMAGE */}
            <div className={`p-6 flex items-center justify-center ${theme === "dark" ? "bg-zinc-950/70" : "bg-gray-100"}`}>
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className={`h-80 w-full max-w-xs object-cover rounded-2xl shadow-lg ${
                    theme === "dark" ? "border border-zinc-700" : "border border-gray-300"
                  }`}
                />
              ) : (
                <div className={`h-80 w-full max-w-xs rounded-2xl border border-dashed flex items-center justify-center text-sm ${
                  theme === "dark" 
                    ? "border-zinc-700 bg-zinc-900 text-gray-400" 
                    : "border-gray-300 bg-gray-50 text-gray-500"
                }`}>
                  No cover available
                </div>
              )}
            </div>

            {/* TEXT CONTENT */}
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <h1 className="text-3xl sm:text-4xl font-bold">{book.title}</h1>
              <p className={`mt-2 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                by <span className="font-semibold">{book.author}</span>
              </p>

              {book.genre && (
                <span className="px-3 py-1 w-fit rounded-full bg-pink-600/20 text-pink-200 text-xs font-semibold">
                  {book.genre}
                </span>
              )}

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={addToList}
                  disabled={adding}
                  className="px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold shadow-md disabled:opacity-60 transition-colors"
                >
                  {adding ? "Adding…" : "Add to My Reading List"}
                </button>

                <button
                  onClick={() => navigate("/reading-list")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    theme === "dark"
                      ? "bg-zinc-800 hover:bg-zinc-700 border border-zinc-600"
                      : "bg-gray-200 hover:bg-gray-300 border border-gray-300"
                  }`}
                >
                  Go to My Library
                </button>
              </div>
            </div>
          </div>

          {/* DETAILS PANEL */}
          <div className="px-6 sm:px-8 pb-7 pt-4 grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
            {/* ABOUT SECTION */}
            <div>
              <h2 className="text-lg font-semibold mb-2">About this book</h2>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}>
                {book.description || "No description yet."}
              </p>
            </div>

            {/* DETAILS SECTION */}
            <div className={`rounded-2xl p-4 text-sm transition-colors ${
              theme === "dark"
                ? "bg-zinc-950/60 border border-zinc-800"
                : "bg-gray-100 border border-gray-200"
            }`}>
              <h3 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                Details
              </h3>

              <DetailItem label="Genre" value={book.genre} theme={theme} />
              {book.pages && <DetailItem label="Pages" value={book.pages} theme={theme} />}
              {book.publishedYear && (
                <DetailItem label="Published" value={book.publishedYear} theme={theme} />
              )}
              <DetailItem label="Added by" value={creatorName} theme={theme} />
              {addedOn && <DetailItem label="Added on" value={addedOn} theme={theme} />}
            </div>
          </div>
        </section>

        {/* MORE BOOKS */}
        {others.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              More by {book.author || "this author"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <div
                  key={o._id}
                  onClick={() => navigate(`/books/${o._id}`)}
                  className={`rounded-2xl p-4 cursor-pointer transition shadow-md flex flex-col gap-2 ${
                    theme === "dark"
                      ? "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold text-sm">{o.title}</p>
                  <p className={`text-xs line-clamp-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {o.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function DetailItem({ label, value, theme }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}