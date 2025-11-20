import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { booksApi, userBooksApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await booksApi.getOne(id);
        const current = res.data;
        setBook(current);

        const all = await booksApi.getAll();
        const sameAuthor = all.data.filter(
          (b) => b.author === current.author && b._id !== id
        );
        setOthers(sameAuthor);
      } catch {
        console.log("Could not load book");
      } finally {
        setLoading(false);
      }
    }

    load();
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

        {/* MAIN BOOK BLOCK */}
        <section className="bg-slate-900 rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[290px,1fr]">
            {/* COVER */}
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
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  {book.title}
                </h1>

                <p className="mt-2 text-lg text-gray-300">
                  by <span className="font-semibold">{book.author}</span>
                </p>

                {/* TAGS */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {book.genre && (
                    <span className="px-3 py-1 rounded-full bg-pink-600/20 text-pink-200 font-semibold">
                      {book.genre}
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-3">
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

          {/* ABOUT + DETAILS */}
          <div className="px-6 sm:px-8 pb-7 pt-4 grid gap-8 lg:grid-cols-[minmax(0,2.1fr),minmax(0,1fr)]">
            {/* ABOUT */}
            <div>
              <h2 className="text-lg font-semibold mb-2">About this book</h2>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {book.description ||
                  "No full description has been added for this book yet."}
              </p>
            </div>

            {/* DETAILS TABLE */}
            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 text-sm">
              <h3 className="text-sm font-semibold mb-3 text-gray-100">
                Details
              </h3>
              <dl className="space-y-1.5 text-gray-300 text-xs sm:text-sm">
                {book.genre && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400">Genre</dt>
                    <dd className="font-medium text-right">{book.genre}</dd>
                  </div>
                )}
                {book.pages && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400">Pages</dt>
                    <dd className="font-medium text-right">{book.pages}</dd>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400">Published</dt>
                    <dd className="font-medium text-right">
                      {book.publishedYear}
                    </dd>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400">Publisher</dt>
                    <dd className="font-medium text-right">{book.publisher}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-400">Added by</dt>
                  <dd className="font-medium text-right">Admin</dd>
                </div>
                {addedOn && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400">Added on</dt>
                    <dd className="font-medium text-right">{addedOn}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>

        {/* MORE BY AUTHOR */}
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
                    {o.description || "No description available yet."}
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
