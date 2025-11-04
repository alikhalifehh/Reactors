import { useParams, Link, useNavigate } from "react-router-dom";
import { books } from "../data/books";
import bgImage from "../assets/background2.png";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === id);

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!book ? (
        <div className="max-w-3xl mx-auto p-6 text-white">
          <p className="text-red-300">Book not found.</p>
          <div className="mt-2 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="underline">
              Go back
            </button>
            <Link to="/books" className="underline">
              ← Back to list
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-6 bg-white/40 rounded-xl shadow-lg">
          <Link to="/books" className="text-sm underline text-gray-200">
            ← Back to list
          </Link>

          <div className="mt-3 flex flex-col sm:flex-row gap-6">
            <img
              src={book.cover}
              alt={`${book.title} cover`}
              className="w-40 h-56 object-cover rounded shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-semibold mb-2">{book.title}</h1>
              <p className="text-gray-200 text-lg">{book.author}</p>
              <p className="text-sm text-gray-300 mb-4">
                {book.genre} • {book.year} •{" "}
                <span className="italic">{book.status}</span>
              </p>
              <p className="leading-relaxed text-gray-100">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
