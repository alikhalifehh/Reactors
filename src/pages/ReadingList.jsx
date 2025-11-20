import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userBooksApi } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function ReadingList() {
  const { user, loading } = useAuth();
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-24 px-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Library</h1>

          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            {["all", "reading", "finished", "wishlist"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-3 py-1 rounded-md text-sm transition " +
                  (filter === f
                    ? "bg-pink-600 text-white"
                    : "text-gray-300 hover:bg-gray-700")
                }
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400">No books to show yet.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((entry) => {
              const b = entry.book;

              return (
                <div
                  key={entry._id}
                  className="bg-gray-800 rounded-xl p-5 flex gap-6 shadow-lg flex-col sm:flex-row"
                >
                  <div className="flex-shrink-0">
                    {b.coverUrl ? (
                      <img
                        src={b.coverUrl}
                        className="h-32 w-24 rounded-md object-cover border border-gray-700"
                        alt={b.title}
                      />
                    ) : (
                      <div className="h-32 w-24 rounded-md bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{b.title}</h3>
                      <p className="text-sm text-gray-400">{b.author}</p>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{entry.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={
                              "h-full " +
                              (entry.progress === 100
                                ? "bg-green-500"
                                : entry.progress > 0
                                ? "bg-blue-500"
                                : "bg-gray-500")
                            }
                            style={{ width: `${entry.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-xs text-gray-400">
                          Status: {entry.status}
                        </span>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <button
                              key={v}
                              onClick={() => setRating(entry, v)}
                              className={
                                "text-lg leading-none " +
                                (entry.rating && entry.rating >= v
                                  ? "text-yellow-400"
                                  : "text-gray-500")
                              }
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        {entry.rating ? (
                          <span className="text-xs text-gray-300">
                            {entry.rating} / 5
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            No rating yet
                          </span>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-300">
                        {editingNotesId === entry._id ? (
                          <div className="space-y-2">
                            <textarea
                              value={notesDraft}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              rows={3}
                              className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-xs"
                              placeholder="Write your thoughts about this book"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingNotesId(null);
                                  setNotesDraft("");
                                }}
                                className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveNotes(entry)}
                                className="px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-500 text-xs font-semibold"
                              >
                                Save notes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="max-w-md">
                              {entry.notes
                                ? entry.notes
                                : "No notes yet. Add your thoughts."}
                            </p>
                            <button
                              onClick={() => openNotes(entry)}
                              className="ml-4 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs whitespace-nowrap"
                            >
                              Edit notes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {entry.status === "reading" && (
                        <>
                          <button
                            onClick={() =>
                              updateEntry(entry._id, {
                                progress: Math.min(100, entry.progress + 5),
                              })
                            }
                            className="px-3 py-1 bg-blue-500 rounded-md text-sm text-black font-semibold"
                          >
                            +5%
                          </button>

                          <button
                            onClick={() =>
                              updateEntry(entry._id, {
                                progress: Math.max(0, entry.progress - 5),
                              })
                            }
                            className="px-3 py-1 bg-blue-500 rounded-md text-sm text-black font-semibold"
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
                            className="px-3 py-1 bg-green-600 rounded-md text-sm font-semibold"
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
                          className="px-3 py-1 bg-gray-700 rounded-md text-sm font-semibold"
                        >
                          Start Reading
                        </button>
                      )}

                      <button
                        onClick={() => removeEntry(entry._id)}
                        className="px-3 py-1 bg-red-500 rounded-md text-sm text-black font-semibold"
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
      </div>

      <Footer />
    </div>
  );
}
