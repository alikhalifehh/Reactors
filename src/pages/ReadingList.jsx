import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { userBooksApi } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function ReadingList() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const res = await userBooksApi.getList();
        setEntries(res.data);
      } catch {
        console.log("Could not load reading list");
      }
    }

    load();
  }, [user]);

  async function updateEntry(id, data) {
    const res = await userBooksApi.update(id, data);
    setEntries((prev) => prev.map((e) => (e._id === id ? res.data : e)));
  }

  async function removeEntry(id) {
    if (!window.confirm("Remove this book from your list?")) return;
    await userBooksApi.delete(id);
    setEntries((prev) => prev.filter((e) => e._id !== id));
  }

  function openNotes(entry) {
    setEditingNotesId(entry._id);
    setNotesDraft(entry.notes || "");
  }

  async function saveNotes(entry) {
    await updateEntry(entry._id, { notes: notesDraft });
    setEditingNotesId(null);
    setNotesDraft("");
  }

  async function setRating(entry, value) {
    await updateEntry(entry._id, { rating: value });
  }

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.status === filter);

  return (
    <div
      className={`
        min-h-screen flex flex-col 
        transition-colors duration-300 
        ${
          theme === "dark"
            ? "bg-[#140404] text-white"
            : "bg-[#FFFCE0] text-black"
        }
      `}
    >
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto pt-24 px-6 pb-24">
        {/* HEADER + FILTERS */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold">My Library</h1>

          <div
            className={`
              rounded-xl p-1 flex gap-1
              ${theme === "dark" ? "bg-[#1e293b]" : "bg-gray-200"}
            `}
          >
            {["all", "reading", "finished", "wishlist"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-1 rounded-lg text-sm font-medium transition
                  ${
                    filter === f
                      ? "bg-pink-600 text-white"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-[#334155]"
                      : "text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 ? (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            No books to show yet.
          </p>
        ) : (
          <div className="space-y-6">
            {filtered.map((entry) => {
              const b = entry.book;

              return (
                <div
                  key={entry._id}
                  className={`w-[1200px]
                    rounded-2xl p-6 shadow-xl flex gap-6 flex-col sm:flex-row
                    transition-colors
                    ${
                      theme === "dark"
                        ? "bg-zinc-700 border border-white/10"
                        : "bg-[#BAAE93] border border-gray-200"
                    }
                  `}
                >
                  {/* COVER */}
                  <div className="flex-shrink-0">
                    {(entry.coverImage || b.coverImage) ? (
                      <img
                        src={entry.coverImage || b.coverImage}
                        className={`
                          h-36 w-28 rounded-lg object-cover
                          ${
                            theme === "dark"
                              ? "border border-white/10"
                              : "border border-gray-300"
                          }
                        `}
                        alt={b.title}
                      />
                    ) : (
                      <div
                        className={`
                          h-36 w-28 rounded-lg flex items-center justify-center text-sm
                          ${
                            theme === "dark"
                              ? "bg-[#0f172a] text-gray-400"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        No cover
                      </div>
                    )}
                  </div>

                  {/* RIGHT SIDE CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{b.title}</h3>
                      <p
                        className={`
                          text-sm
                          ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
                        `}
                      >
                        {b.author}
                      </p>

                      {/* PROGRESS */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-300">
                            Progress
                          </span>
                          <span>{entry.progress}%</span>
                        </div>

                        <div
                          className={`
                            h-2 rounded-full overflow-hidden
                            ${
                              theme === "dark"
                                ? "bg-[#0f172a]"
                                : "bg-gray-200"
                            }
                          `}
                        >
                          <div
                            className={
                              entry.progress === 100
                                ? "bg-green-500 h-full"
                                : entry.progress > 0
                                ? "bg-blue-500 h-full"
                                : "bg-gray-500 h-full"
                            }
                            style={{ width: `${entry.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* STATUS + RATING */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span
                          className={`text-xs ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Status: {entry.status}
                        </span>

                        {/* Rating stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <button
                              key={v}
                              onClick={() => setRating(entry, v)}
                              className={`
                                text-xl leading-none 
                                ${
                                  entry.rating && entry.rating >= v
                                    ? "text-yellow-400"
                                    : theme === "dark"
                                    ? "text-gray-600"
                                    : "text-gray-300"
                                }
                              `}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <span
                          className={`text-xs ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          {entry.rating ? `${entry.rating} / 5` : "No rating yet"}
                        </span>
                      </div>

                      {/* NOTES */}
                      <div
                        className={`
                          mt-4 text-sm
                          ${theme === "dark" ? "text-gray-300" : "text-gray-700"}
                        `}
                      >
                        {editingNotesId === entry._id ? (
                          <div className="space-y-3">
                            <textarea
                              value={notesDraft}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              rows={3}
                              className={`
                                w-full rounded-md border px-3 py-2 text-sm
                                ${
                                  theme === "dark"
                                    ? "bg-[#0f172a] border-[#1e293b]"
                                    : "bg-white border-gray-300"
                                }
                              `}
                            />

                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingNotesId(null);
                                  setNotesDraft("");
                                }}
                                className={`
                                  px-4 py-1 rounded-md text-xs
                                  ${
                                    theme === "dark"
                                      ? "bg-[#0f172a] hover:bg-[#1e293b]"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }
                                `}
                              >
                                Cancel
                              </button>

                              <button
                                onClick={() => saveNotes(entry)}
                                className="px-4 py-1 rounded-md bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="max-w-md">
                              {entry.notes ||
                                "No notes yet. Add your thoughts."}
                            </p>

                            <button
                              onClick={() => openNotes(entry)}
                              className={`
                                ml-4 px-4 py-1 rounded-md text-xs
                                ${
                                  theme === "dark"
                                    ? "bg-[#0f172a] hover:bg-[#1e293b]"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }
                              `}
                            >
                              Edit notes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 mt-6 flex-wrap">
                      {entry.status === "reading" && (
                        <>
                          <button
                            onClick={() =>
                              updateEntry(entry._id, {
                                progress: Math.min(100, entry.progress + 5),
                              })
                            }
                            className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white font-semibold"
                          >
                            +5%
                          </button>

                          <button
                            onClick={() =>
                              updateEntry(entry._id, {
                                progress: Math.max(0, entry.progress - 5),
                              })
                            }
                            className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white font-semibold"
                          >
                            -5%
                          </button>

                          <button
                            onClick={() =>
                              updateEntry(entry._id, {
                                progress: 100,
                                status: "finished",
                              })
                            }
                            className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm text-white font-semibold"
                          >
                            Mark Done
                          </button>
                        </>
                      )}

                      {entry.status === "wishlist" && (
                        <button
                          onClick={() =>
                            updateEntry(entry._id, {
                              status: "reading",
                              progress: 1,
                            })
                          }
                          className={`
                            px-4 py-1 rounded-md text-sm font-semibold
                            ${
                              theme === "dark"
                                ? "bg-[#475569] hover:bg-[#334155]"
                                : "bg-gray-800 hover:bg-gray-900 text-white"
                            }
                          `}
                        >
                          Start Reading
                        </button>
                      )}

                      <button
                        onClick={() => removeEntry(entry._id)}
                        className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
