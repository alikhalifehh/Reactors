import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import defaultAvatar from "../assets/default-user.png";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();

  // 🔹 Redirect if not logged in
  useEffect(() => {
    const loggedIn =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (!loggedIn) {
      const banner = document.createElement("div");
      banner.textContent = "⚠ Please log in to access Profile.";
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

  // 🔹 Background rotation
  const bgImages = [
    "/src/assets/book.jpg",
    "/src/assets/book2.jpg",
    "/src/assets/book3.jpg",
    "/src/assets/book4.jpg",
    "/src/assets/book5.jpg",
  ];
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % bgImages.length),
      7000
    );
    return () => clearInterval(interval);
  }, [bgImages.length]);

  // 🔹 Logged user + their reading list
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState([]);

  useEffect(() => {
    const u =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      JSON.parse(sessionStorage.getItem("loggedInUser"));
    setUser(u || null);

    if (!u) {
      setReadingList([]);
      return;
    }

    const key = `reading_${u.email}`;
    const list = JSON.parse(localStorage.getItem(key)) || [];
    setReadingList(list);
  }, []);

  // 🔹 Compute stats + extended analytics
  function daysBetween(a, b) {
    if (!a || !b) return 0;
    const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  function daysReading(book) {
    if (book.status === "reading" && book.startedAt)
      return daysBetween(book.startedAt, new Date());
    if (book.status === "finished" && book.startedAt && book.finishedAt)
      return daysBetween(book.startedAt, book.finishedAt);
    return 0;
  }

  const booksRead = readingList.filter((b) => b.status === "finished").length;
  const inProgress = readingList.filter((b) => b.status === "reading").length;
  const wishlist = readingList.filter((b) => b.status === "wishlist").length;
  const total = booksRead + inProgress + wishlist;
  const goalPercent = total === 0 ? 0 : Math.round((booksRead / total) * 100);

  // 📘 Total reading duration
  const totalDaysReading = readingList
    .filter((b) => b.status === "reading" || b.status === "finished")
    .reduce((sum, b) => sum + daysReading(b), 0);

  // ⭐ Average progress
  const avgProgress =
    readingList.length > 0
      ? Math.round(
          readingList.reduce((sum, b) => sum + (b.progress || 0), 0) /
            readingList.length
        )
      : 0;

  // 🏆 Longest reading streak
  const longestStreak = readingList.length
    ? Math.max(...readingList.map(daysReading))
    : 0;

  // 🔹 Editing section
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    avatar: defaultAvatar,
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        email: user.email || "",
        avatar: user.avatar || defaultAvatar,
      });
    }
  }, [user]);

  const fullName =
    (editForm.firstName + " " + editForm.lastName).trim() ||
    user?.name ||
    "User";

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

  // 🔹 Save profile changes
  function handleSave() {
    if (!user) return;

    const updatedUser = {
      ...user,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      bio: editForm.bio.trim(),
      avatar: editForm.avatar,
      name:
        (editForm.firstName.trim() + " " + editForm.lastName.trim()).trim() ||
        user.name,
    };

    if (localStorage.getItem("loggedInUser")) {
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem("loggedInUser")) {
      sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      (u.email || "").trim().toLowerCase() ===
      (user.email || "").trim().toLowerCase()
        ? { ...u, ...updatedUser }
        : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(updatedUser);
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
        {!user ? (
          <p className="mt-20 text-lg text-center text-yellow-300 font-semibold">
            ⚠️ Please login to access your profile.
          </p>
        ) : (
          <section className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
            {/* Left card */}
            <div className="bg-white/90 text-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-auto lg:mx-0 flex flex-col items-center">
              <img
                src={editForm.avatar || defaultAvatar}
                alt={fullName}
                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
              />
              <h2 className="mt-4 text-xl font-extrabold text-gray-900 drop-shadow-sm text-center">
                {fullName}
              </h2>
              <p className="text-sm text-gray-600">
                @{user.email.split("@")[0]}
              </p>
              <p className="mt-4 text-center text-sm text-gray-700 leading-relaxed">
                {editForm.bio || "No bio yet."}
              </p>
              <p className="mt-4 text-[11px] text-gray-500 break-all text-center">
                {user.email}
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
                  <span>{goalPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow-xl text-center">
                  <div className="text-3xl font-extrabold text-gray-900 leading-none">
                    {booksRead}
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium mt-1 uppercase tracking-wide">
                    Read
                  </div>
                </div>

                <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow-xl text-center">
                  <div className="text-3xl font-extrabold text-gray-900 leading-none">
                    {inProgress}
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium mt-1 uppercase tracking-wide">
                    In Progress
                  </div>
                </div>

                <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow-xl text-center">
                  <div className="text-3xl font-extrabold text-gray-900 leading-none">
                    {wishlist}
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium mt-1 uppercase tracking-wide">
                    Wishlist
                  </div>
                </div>
              </div>

              {/* Extended Stats */}
              <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center text-sm text-gray-200">
                <div className="bg-white/10 rounded-xl p-4 shadow-inner">
                  <p className="text-2xl font-bold text-white">
                    {totalDaysReading}
                  </p>
                  <p className="mt-1 text-gray-300">Total Days Reading</p>
                </div>

                <div className="bg-white/10 rounded-xl p-4 shadow-inner">
                  <p className="text-2xl font-bold text-white">
                    {avgProgress}%
                  </p>
                  <p className="mt-1 text-gray-300">Average Progress</p>
                </div>

                <div className="bg-white/10 rounded-xl p-4 shadow-inner">
                  <p className="text-2xl font-bold text-white">
                    {longestStreak}
                  </p>
                  <p className="mt-1 text-gray-300">Longest Streak (days)</p>
                </div>
              </div>

              {/* History */}
              <div className="bg-white/90 rounded-2xl shadow-xl p-5 text-left text-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-semibold text-gray-900">
                    My History
                  </div>
                  <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                    Activity
                  </div>
                </div>

                {readingList.length === 0 ? (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    You haven’t added any books yet.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {readingList
                      .slice(-5)
                      .reverse()
                      .map((b) => (
                        <li
                          key={b.id}
                          className="flex justify-between border-b border-gray-200 pb-1"
                        >
                          <span>
                            <strong>{b.title}</strong>{" "}
                            <span className="text-gray-500">
                              (
                              {b.status.charAt(0).toUpperCase() +
                                b.status.slice(1)}
                              )
                            </span>
                          </span>
                          <span className="text-gray-400">{b.author}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
