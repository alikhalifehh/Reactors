import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { userBooksApi } from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme } = useTheme();

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

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

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

  useEffect(() => {
    if (!user) return;

    async function loadStats() {
      setLoadingStats(true);

      try {
        const [summaryRes, listRes] = await Promise.allSettled([
          userBooksApi.getSummary(),
          userBooksApi.getList(),
        ]);

        if (summaryRes.status === "fulfilled") {
          const s = summaryRes.value.data.summary;
          setSummary({
            reading: s.reading || 0,
            finished: s.finished || 0,
            wishlist: s.wishlist || 0,
          });
        }

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
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${
          theme === "dark" ? "bg-[#020617] text-white" : "bg-gray-50 text-black"
        }`}
      >
        <Navbar />
        <main className="flex-1 pt-32 pb-10 text-center">Loading profile...</main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const initials =
    user?.name
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
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#140404] text-white"
          : "bg-[#FFFCE0] text-black"
      }`}
    >
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto pt-24 pb-20 px-4 sm:px-6 space-y-8">
        {/* PROFILE CARD */}
        <section
          className={`w-[1000px] relative rounded-3xl overflow-hidden shadow-xl border transition-colors ${
            theme === "dark"
              ? "bg-zinc-700 text-white"
              : "bg-[#BAAE93] text-black"
          }`}
        >
          <div className="h-32 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500" />

          <div className="px-6 sm:px-8 pb-8 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-24 w-24 rounded-full border-4 shadow-lg flex items-center justify-center overflow-hidden ${
                    theme === "dark"
                      ? "bg-zinc-900 border-[#020617]"
                      : "bg-gray-100 border-white"
                  }`}
                >
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
                  <p
                    className={`mt-3 text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.email}
                  </p>

                  <button
                    onClick={openEdit}
                    className={`mt-3 px-5 py-2 rounded-full text-sm font-semibold shadow-md transition ${
                      theme === "dark"
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* GOAL TRACKER */}
              <div className="ml-0 sm:ml-auto w-full sm:w-64">
                <div
                  className={`flex justify-between text-xs mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  <span>
                    {profileExtras.yearlyGoal ? "Yearly Goal" : "No goal set"}
                  </span>

                  {profileExtras.yearlyGoal > 0 && (
                    <span>
                      {summary.finished}/{profileExtras.yearlyGoal}
                    </span>
                  )}
                </div>

                <div
                  className={`h-2 rounded-full overflow-hidden ${
                    theme === "dark" ? "bg-slate-800" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-lime-400"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <p
              className={`mt-6 text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {profileExtras.bio || "No bio yet. Click Edit Profile to add one."}
            </p>

            {(profileExtras.location || profileExtras.favoriteGenre) && (
              <p
                className={`mt-1 text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {profileExtras.location && <span>{profileExtras.location}</span>}
                {profileExtras.location && profileExtras.favoriteGenre && (
                  <span className="mx-2">•</span>
                )}
                {profileExtras.favoriteGenre && (
                  <span>Loves {profileExtras.favoriteGenre}</span>
                )}
              </p>
            )}

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div
                className={`rounded-2xl py-3 ${
                  theme === "dark" ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Reading
                </p>
                <p className="mt-1 text-xl font-semibold">{summary.reading}</p>
              </div>

              <div
                className={`rounded-2xl py-3 ${
                  theme === "dark" ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Finished
                </p>
                <p className="mt-1 text-xl font-semibold">{summary.finished}</p>
              </div>

              <div
                className={`rounded-2xl py-3 ${
                  theme === "dark" ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Wishlist
                </p>
                <p className="mt-1 text-xl font-semibold">{summary.wishlist}</p>
              </div>
            </div>

            <p
              className={`mt-3 text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total books tracked: {totalBooks}
            </p>
          </div>
        </section>

        {/* ACTIVITY */}
        <section
          className={`w-[1000px] rounded-3xl p-6 shadow-lg border transition-colors ${
            theme === "dark"
              ? "bg-zinc-700 border-white/5"
              : "bg-[#BAAE93] text-black"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>

            {activity.length > 0 && (
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Showing last {activity.length} updates
              </span>
            )}
          </div>

          {loadingStats ? (
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading activity…
            </p>
          ) : activity.length === 0 ? (
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              You have no reading activity yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {activity.map((entry) => (
                <li
                  key={entry._id}
                  className={`flex justify-between pb-3 border-b last:border-none ${
                    theme === "dark" ? "border-white/5" : "border-gray-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {entry.book?.title || "Unknown title"}
                    </p>

                    <p
                      className={`text-xs ${
                        theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {entry.status}{" "}
                      {entry.progress != null &&
                        entry.status !== "wishlist" && <>• {entry.progress}%</>}
                    </p>
                  </div>

                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
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
          <div
            className={`p-6 rounded-2xl shadow-xl max-w-md w-full border transition-colors ${
              theme === "dark"
                ? "bg-[#020617] border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  className={`w-full rounded-lg px-3 py-2 border ${
                    theme === "dark"
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-300"
                  }`}
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">Location</label>
                <input
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  className={`w-full rounded-lg px-3 py-2 border ${
                    theme === "dark"
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1">Favorite Genre</label>
                <input
                  name="favoriteGenre"
                  value={editForm.favoriteGenre}
                  onChange={handleEditChange}
                  className={`w-full rounded-lg px-3 py-2 border ${
                    theme === "dark"
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1">Yearly Goal</label>
                <input
                  type="number"
                  min="0"
                  name="yearlyGoal"
                  value={editForm.yearlyGoal}
                  onChange={handleEditChange}
                  className={`w-full rounded-lg px-3 py-2 border ${
                    theme === "dark"
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 text-sm">
              <button
                onClick={() => setEditing(false)}
                className={`px-4 py-2 rounded-lg transition ${
                  theme === "dark"
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
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
