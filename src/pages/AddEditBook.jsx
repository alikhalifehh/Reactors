import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { booksApi } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddEditBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = useAuth();

  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    coverImage: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!editing) return;

    async function load() {
      try {
        const res = await booksApi.getOne(id);
        const b = res.data;
        setForm({
          title: b.title || "",
          author: b.author || "",
          description: b.description || "",
          genre: b.genre || "",
          coverImage: b.coverImage || "",
        });
      } catch {
        console.log("Could not load book");
      }
    }

    load();
  }, [editing, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editing) {
        await booksApi.update(id, form);
      } else {
        await booksApi.create(form);
      }
      navigate("/books");
    } catch {
      alert("Could not save book");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#020617] text-white">
        <Navbar />
        <main className="flex-1 pt-28 px-6 text-center text-gray-300">
          Loading...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto pt-24 pb-16 px-4 sm:px-6">
        <button
          onClick={() => navigate("/books")}
          className="text-xs text-gray-400 hover:text-gray-200 mb-4"
        >
          ← Back to Books
        </button>

        <section className="bg-slate-900 border border-white/5 rounded-3xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            {editing ? "Edit Book" : "Add New Book"}
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm text-gray-200">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Book title"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-200">Author</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Author name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-200">Genre</label>
              <input
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Fantasy, Thriller, Sci-Fi..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-200">Cover Image URL</label>
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="https://example.com/cover.jpg"
              />
              <p className="text-[11px] text-gray-400">
                Paste a direct image link. This will appear on the book cards
                and detail page.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-200">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Brief summary of the book"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/books")}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-sm font-semibold"
              >
                {editing ? "Save Changes" : "Add Book"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
