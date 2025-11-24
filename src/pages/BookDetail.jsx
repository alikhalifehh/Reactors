import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { booksApi, userBooksApi, authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

import { fetchGoogleCover } from "../utils/fetchCover";
import { getCachedCover, cacheCover } from "../utils/coverCache";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <div className="min-h-screen bg-[#020617] text-white">
        <Navbar />
        <main className="max-w-4xl mx-auto pt-28 pb-20 px-6 text-center text-gray-300">
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
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-24 pb-20 px-4 sm:px-6 space-y-10">
        <button
          onClick={() => navigate("/books")}
          className="text-sm text-gray-400 hover:text-white mb-2"
        >
          ← Back to all books
        </button>

        {/* MAIN INFO BLOCK */}
        <section className="bg-slate-900 rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[290px,1fr]">
            {/* COVER IMAGE */}
            <div className="bg-slate-950/70 p-6 flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-80 w-full max-w-xs object-cover rounded-2xl border border-slate-700 shadow-lg"
                />
              ) : (
                <div className="h-80 w-full max-w-xs rounded-2xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center text-sm text-gray-400">
                  No cover available
                </div>
              )}
            </div>

            {/* TEXT CONTENT */}
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <h1 className="text-3xl sm:text-4xl font-bold">{book.title}</h1>
              <p className="mt-2 text-lg text-gray-300">
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
                  className="px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-sm font-semibold shadow-md disabled:opacity-60"
                >
                  {adding ? "Adding…" : "Add to My Reading List"}
                </button>

                <button
                  onClick={() => navigate("/reading-list")}
                  className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-sm font-semibold border border-slate-600"
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
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {book.description || "No description yet."}
              </p>
            </div>

            {/* DETAILS SECTION */}
            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 text-sm">
              <h3 className="text-sm font-semibold mb-3 text-gray-100">
                Details
              </h3>

              <DetailItem label="Genre" value={book.genre} />
              {book.pages && <DetailItem label="Pages" value={book.pages} />}
              {book.publishedYear && (
                <DetailItem label="Published" value={book.publishedYear} />
              )}
              <DetailItem label="Added by" value={creatorName} />
              {addedOn && <DetailItem label="Added on" value={addedOn} />}
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
                  className="bg-slate-900 rounded-2xl border border-slate-800 p-4 cursor-pointer hover:bg-slate-800 transition shadow-md flex flex-col gap-2"
                >
                  <p className="font-semibold text-sm">{o.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-3">
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

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-400">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
