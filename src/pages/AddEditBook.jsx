import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { booksApi } from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddEditBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = useAuth();
  const { theme } = useTheme();
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
      <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-[#140404] text-white" : "bg-[#FFFCE0] text-black"}`}>
        <Navbar />
        <main className="flex-1 pt-28 px-6 text-center">
          Loading...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === "dark" ? "bg-[#140404] text-white" : "bg-[#FFFCE0] text-black"}`}>
      <Navbar />
<main className="flex-1 max-w-6xl mx-auto pt-24 pb-16 px-4 sm:px-8">
        <button
          onClick={() => navigate("/books")}
          className={`text-xs mb-4 transition-colors ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`}
        >
          ← Back to Books
        </button>

        <section className={`w-[1200px] mx-auto rounded-4xl shadow-xl p-10 sm:p-12 transition-colors ${theme === "dark" ? "bg-zinc-700 border border-zinc-800" : "bg-[#BAAE93] border border-gray-200"}`}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            {editing ? "Edit Book" : "Add New Book"}
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className={`text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  theme === "dark" 
                    ? "bg-zinc-800 border border-zinc-700 text-white" 
                    : "bg-gray-50 border border-gray-300 text-black"
                }`}
                placeholder="Book title"
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Author</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  theme === "dark" 
                    ? "bg-zinc-800 border border-zinc-700 text-white" 
                    : "bg-gray-50 border border-gray-300 text-black"
                }`}
                placeholder="Author name"
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Genre</label>
              <input
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  theme === "dark" 
                    ? "bg-zinc-800 border border-zinc-700 text-white" 
                    : "bg-gray-50 border border-gray-300 text-black"
                }`}
                placeholder="Fantasy, Thriller, Sci-Fi..."
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`w-full rounded-lg px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  theme === "dark" 
                    ? "bg-zinc-800 border border-zinc-700 text-white" 
                    : "bg-gray-50 border border-gray-300 text-black"
                }`}
                placeholder="Brief summary of the book"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/books")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold transition-colors"
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