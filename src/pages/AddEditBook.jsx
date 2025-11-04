import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookContext } from "../context/BookContext";
import Navbar from "../components/Navbar";

const AddEditBook = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (!loggedIn) {
      const banner = document.createElement("div");
      banner.textContent = "⚠ Please log in to access Add/Edit Books.";
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

  const { id } = useParams();
  const { books, addBook, updateBook } = useContext(BookContext);

  const editing = Boolean(id);
  const existingBook = editing
    ? books.find((b) => b.id === parseInt(id))
    : null;

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    status: "To Read",
    progress: 0,
    rating: 0,
    notes: "",
    cover: "",
  });

  useEffect(() => {
    if (existingBook) setForm(existingBook);
  }, [existingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const loggedUser =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedUser) {
      alert("Please log in to add or edit books.");
      navigate("/login");
      return;
    }

    const readingKey = `reading_${loggedUser.email}`;
    const globalKey = "global_books";

    const userList = JSON.parse(localStorage.getItem(readingKey)) || [];
    const globalList = JSON.parse(localStorage.getItem(globalKey)) || [];

    if (editing) {
      // Update in personal list
      const updatedUserList = userList.map((b) =>
        b.id === parseInt(id) ? { ...b, ...form } : b
      );
      localStorage.setItem(readingKey, JSON.stringify(updatedUserList));

      // Update globally if same id exists
      const updatedGlobalList = globalList.map((b) =>
        b.id === parseInt(id) ? { ...b, ...form } : b
      );
      localStorage.setItem(globalKey, JSON.stringify(updatedGlobalList));
    } else {
      // Create new book object
      const newBook = {
        ...form,
        id: Date.now(),
        status: "wishlist",
        progress: 0,
        createdAt: new Date().toISOString(),
        addedBy: loggedUser.name || loggedUser.email.split("@")[0],
      };

      // Add to both lists
      const updatedUserList = [...userList, newBook];
      const updatedGlobalList = [...globalList, newBook];

      localStorage.setItem(readingKey, JSON.stringify(updatedUserList));
      localStorage.setItem(globalKey, JSON.stringify(updatedGlobalList));
    }

    navigate("/books");
  };

  return (
    <div className="min-h-screen bg-[#1c1208] text-white flex justify-center items-center p-6 bg-[url('/src/assets/library-bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="bg-[#2c1b10]/95 w-full max-w-2xl rounded-2xl shadow-xl p-8 border border-[#55322c] backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#f5d39d]">
          {editing ? "Edit Book Details" : "Add a New Book"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-[#f5d39d]">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#3b2417] text-white border border-[#704832] focus:outline-none focus:ring-2 focus:ring-[#b66a4d]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-[#f5d39d]">Author</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#3b2417] text-white border border-[#704832] focus:outline-none focus:ring-2 focus:ring-[#b66a4d]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[#f5d39d]">Genre</label>
              <input
                type="text"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#3b2417] text-white border border-[#704832] focus:outline-none focus:ring-2 focus:ring-[#b66a4d]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[#f5d39d]">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#3b2417] text-white border border-[#704832] focus:outline-none focus:ring-2 focus:ring-[#b66a4d]"
              >
                <option>To Read</option>
                <option>Reading</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[#f5d39d]">Notes / Review</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 h-24 rounded-md bg-[#3b2417] text-white border border-[#704832] focus:outline-none focus:ring-2 focus:ring-[#b66a4d]"
              placeholder="Write your thoughts..."
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-[#f5d39d]">Cover Image URL</label>
            <input
              type="text"
              name="cover"
              value={form.cover}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#3b2417] text-white border border-[#704832] focus:outline-none focus:ring-2 focus:ring-[#b66a4d]"
              placeholder="Paste a link to the book cover"
            />
          </div>

          {form.cover && (
            <div className="flex justify-center my-4">
              <img
                src={form.cover}
                alt="Book cover preview"
                className="h-40 rounded-lg shadow-md border border-[#704832]"
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2 bg-[#5b352a] hover:bg-[#703d31] rounded-md text-[#f5d39d] font-semibold shadow-md transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#b66a4d] hover:bg-[#c47855] rounded-md text-white font-semibold shadow-md transition-all duration-200"
            >
              {editing ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBook;
