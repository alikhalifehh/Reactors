import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import defaultAvatar from "../assets/default-user.png";

export default function UserProfile() {
  const bgImages = [
    "/src/assets/book.jpg",
    "/src/assets/book2.jpg",
    "/src/assets/book3.jpg",
    "/src/assets/book4.jpg",
    "/src/assets/book5.jpg",
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  const [user, setUser] = useState({
    username: "user",
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    avatar: defaultAvatar,
    stats: { booksRead: 27, inProgress: 3, wishlist: 12, goalPercent: 68 },
  });

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    email: user.email,
    avatar: user.avatar,
  });

  useEffect(() => {
    if (isEditing) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        email: user.email,
        avatar: user.avatar,
      });
    }
  }, [isEditing, user]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setEditForm((prev) => ({ ...prev, avatar: previewUrl }));
  }

  function handleAvatarRemove() {
    setEditForm((prev) => ({ ...prev, avatar: defaultAvatar }));
  }

  function handleSave() {
    setUser((prev) => ({
      ...prev,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      bio: editForm.bio,
      email: editForm.email,
      avatar: editForm.avatar || defaultAvatar,
    }));
    setIsEditing(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative transition-all duration-[1500ms]"
      style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <Navbar />

      <main className="relative flex-grow w-full flex flex-col items-center px-6 pt-24 pb-16 text-white">
        <section className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
          {/* Left Profile Card */}
          <div className="bg-white/90 text-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-auto lg:mx-0 flex flex-col items-center">
            <img
              src={user.avatar || defaultAvatar}
              alt={fullName || user.username}
              className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
            />

            <h2 className="mt-4 text-xl font-extrabold text-gray-900 drop-shadow-sm text-center">
              {fullName || user.username}
            </h2>

            <p className="text-sm text-gray-600">@{user.username}</p>

            <p className="mt-4 text-center text-sm text-gray-700 leading-relaxed">
              {user.bio || "No bio yet."}
            </p>

            <p className="mt-4 text-[11px] text-gray-500 break-all text-center">
              {user.email || "No email added"}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 text-white text-sm font-semibold py-2.5 shadow-lg hover:scale-[1.03] active:scale-[0.99] transition-transform"
            >
              Edit Profile
            </button>

            <div className="w-full mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                <span>2025 Reading Goal</span>
                <span>{user.stats.goalPercent}%</span>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                  style={{ width: `${user.stats.goalPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Stat bubbles row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow-xl text-center">
                <div className="text-3xl font-extrabold text-gray-900 leading-none">
                  {user.stats.booksRead}
                </div>
                <div className="text-[11px] text-gray-600 font-medium mt-1 uppercase tracking-wide">
                  Read
                </div>
              </div>

              <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow-xl text-center">
                <div className="text-3xl font-extrabold text-gray-900 leading-none">
                  {user.stats.inProgress}
                </div>
                <div className="text-[11px] text-gray-600 font-medium mt-1 uppercase tracking-wide">
                  In Progress
                </div>
              </div>

              <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow-xl text-center">
                <div className="text-3xl font-extrabold text-gray-900 leading-none">
                  {user.stats.wishlist}
                </div>
                <div className="text-[11px] text-gray-600 font-medium mt-1 uppercase tracking-wide">
                  Wishlist
                </div>
              </div>
            </div>

            {/* My History placeholder card */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-5 text-left text-gray-900">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold text-gray-900">
                  My History
                </div>
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                  Activity
                </div>
              </div>

              <div className="text-gray-600 text-sm leading-relaxed">
                Your reading history will appear here soon.
              </div>

              <div className="text-[11px] text-gray-400 mt-2">
                Recently read, started, and saved books will be shown in this section.
              </div>
            </div>
          </div>
        </section>

        {/* Action Cards Row */}
        <section className="w-full max-w-5xl mt-12 grid gap-6 md:grid-cols-3">
          <button className="bg-white/90 rounded-2xl shadow-xl p-5 text-left hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-gray-900 font-semibold text-base">
              Continue Reading
            </div>
            <div className="text-gray-600 text-xs mt-1">
              Pick up where you left off.
            </div>
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-white/90 rounded-2xl shadow-xl p-5 text-left hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition"
          >
            <div className="text-4xl mb-3">📝</div>
            <div className="text-gray-900 font-semibold text-base">
              Edit Your Bio
            </div>
            <div className="text-gray-600 text-xs mt-1">
              Update how people see you.
            </div>
          </button>

          <button className="bg-white/90 rounded-2xl shadow-xl p-5 text-left hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition">
            <div className="text-4xl mb-3">⭐</div>
            <div className="text-gray-900 font-semibold text-base">
              Add to Wishlist
            </div>
            <div className="text-gray-600 text-xs mt-1">
              Save books to read later.
            </div>
          </button>
        </section>
      </main>

      <Footer />

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsEditing(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-gray-900">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Edit Profile
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Profile Picture
                </label>

                <div className="flex items-start gap-4">
                  <img
                    src={editForm.avatar || defaultAvatar}
                    alt="preview"
                    className="h-16 w-16 rounded-full object-cover border border-gray-300 shadow bg-gray-100"
                  />

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer border border-gray-300 rounded-lg bg-white"
                    />

                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove picture / use default icon
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={editForm.bio}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold py-2 hover:bg-gray-50 active:scale-[0.99] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 text-white text-sm font-semibold py-2 shadow-lg hover:scale-[1.02] active:scale-[0.99] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
