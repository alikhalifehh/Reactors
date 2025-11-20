import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { userBooksApi } from "../services/api";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // consistent user ID fix
  const userId = user?.id || user?._id;

  const [summary, setSummary] = useState({
    reading: 0,
    finished: 0,
    wishlist: 0,
  });

  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const [profileExtras, setProfileExtras] = useState({
    bio: "",
    location: "",
    favoriteGenre: "",
    yearlyGoal: 0,
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: "",
    location: "",
    favoriteGenre: "",
    yearlyGoal: 0,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  // Load saved profile info
  useEffect(() => {
    if (!userId) return;

    const stored = localStorage.getItem(`profile_${userId}`);
    if (stored) {
      try {
        setProfileExtras(JSON.parse(stored));
      } catch {
        setProfileExtras({
          bio: "",
          location: "",
          favoriteGenre: "",
          yearlyGoal: 0,
        });
      }
    }
  }, [userId]);

  // Load stats + activity
  useEffect(() => {
    if (!user) return;

    async function loadStats() {
      setLoadingStats(true);
      try {
        const [summaryRes, listRes] = await Promise.allSettled([
          userBooksApi.getSummary(),
          userBooksApi.getList(),
        ]);

        // summary
        if (summaryRes.status === "fulfilled") {
          const s = summaryRes.value.data.summary;
          setSummary({
            reading: s.reading || 0,
            finished: s.finished || 0,
            wishlist: s.wishlist || 0,
          });
        }

        // activity
        if (listRes.status === "fulfilled") {
          const entries = listRes.value.data || [];
          setActivity(entries.slice(0, 6));
        }
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <Navbar />
        <main className="pt-32 pb-10 text-center text-gray-300">
          Loading profile...
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  // avatar initials
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const totalBooks = summary.reading + summary.finished + summary.wishlist;

  const goalPercent =
    profileExtras.yearlyGoal && summary.finished
      ? Math.round(
          Math.min(100, (summary.finished / profileExtras.yearlyGoal) * 100)
        )
      : 0;

  function openEdit() {
    setEditForm(profileExtras);
    setEditing(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((p) => ({
      ...p,
      [name]: name === "yearlyGoal" ? Number(value) : value,
    }));
  }

  function saveProfile() {
    const cleaned = {
      bio: editForm.bio.trim(),
      location: editForm.location.trim(),
      favoriteGenre: editForm.favoriteGenre.trim(),
      yearlyGoal: Number(editForm.yearlyGoal) || 0,
    };

    setProfileExtras(cleaned);
    localStorage.setItem(`profile_${userId}`, JSON.stringify(cleaned));
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#020617] dark:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-24 pb-20 px-4 sm:px-6 space-y-8">
        {/* HEADER + PROFILE CARD */}
        <section className="relative bg-[#020617] rounded-3xl overflow-hidden shadow-xl border border-white/5">
          <div className="h-32 bg-gradient-to-r from-pink-700 via-rose-500 to-amber-400" />

          <div className="px-6 sm:px-8 pb-8 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* AVATAR */}
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-slate-900 border-4 border-[#020617] shadow-lg flex items-center justify-center overflow-hidden">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold">{initials}</span>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-gray-300 text-sm">{user.email}</p>

                  <button
                    onClick={openEdit}
                    className="mt-3 px-5 py-2 rounded-full bg-white hover:bg-gray-200 text-black text-sm font-semibold shadow-md"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* GOAL TRACKER */}
              <div className="ml-0 sm:ml-auto w-full sm:w-64">
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>
                    {profileExtras.yearlyGoal ? "Yearly Goal" : "No goal set"}
                  </span>
                  {profileExtras.yearlyGoal > 0 && (
                    <span>
                      {summary.finished}/{profileExtras.yearlyGoal}
                    </span>
                  )}
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-lime-400"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* BIO */}
            <p className="mt-6 text-gray-200 text-sm max-w-2xl">
              {profileExtras.bio ||
                "No bio yet. Click Edit Profile to add one."}
            </p>

            {/* LOCATION + FAVORITE GENRE FIXED */}
            {(profileExtras.location || profileExtras.favoriteGenre) && (
              <p className="mt-1 text-xs text-gray-400">
                {profileExtras.location && (
                  <span>{profileExtras.location}</span>
                )}
                {profileExtras.location && profileExtras.favoriteGenre && (
                  <span className="mx-2">•</span>
                )}
                {profileExtras.favoriteGenre && (
                  <span>Loves {profileExtras.favoriteGenre}</span>
                )}
              </p>
            )}

            {/* BOOK STATS */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-2xl py-3">
                <p className="text-xs text-gray-400">Reading</p>
                <p className="mt-1 text-xl font-semibold">{summary.reading}</p>
              </div>
              <div className="bg-white/5 rounded-2xl py-3">
                <p className="text-xs text-gray-400">Finished</p>
                <p className="mt-1 text-xl font-semibold">{summary.finished}</p>
              </div>
              <div className="bg-white/5 rounded-2xl py-3">
                <p className="text-xs text-gray-400">Wishlist</p>
                <p className="mt-1 text-xl font-semibold">{summary.wishlist}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Total books tracked: {totalBooks}
            </p>
          </div>
        </section>

        {/* ACTIVITY SECTION */}
        <section className="bg-[#020617] rounded-3xl border border-white/5 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            {activity.length > 0 && (
              <span className="text-xs text-gray-400">
                Showing last {activity.length} updates
              </span>
            )}
          </div>

          {loadingStats ? (
            <p className="text-sm text-gray-400">Loading activity…</p>
          ) : activity.length === 0 ? (
            <p className="text-sm text-gray-400">
              You have no reading activity yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {activity.map((entry) => (
                <li
                  key={entry._id}
                  className="flex justify-between border-b border-white/5 pb-3 last:border-none"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {entry.book?.title || "Unknown title"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {entry.status}{" "}
                      {entry.progress != null &&
                        entry.status !== "wishlist" &&
                        `• ${entry.progress}%`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {entry.updatedAt
                      ? new Date(entry.updatedAt).toLocaleDateString()
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* EDIT PROFILE MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#020617] p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-300">Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">Location</label>
                <input
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">
                  Favorite Genre
                </label>
                <input
                  name="favoriteGenre"
                  value={editForm.favoriteGenre}
                  onChange={handleEditChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">Yearly Goal</label>
                <input
                  type="number"
                  min="0"
                  name="yearlyGoal"
                  value={editForm.yearlyGoal}
                  onChange={handleEditChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 text-sm">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
