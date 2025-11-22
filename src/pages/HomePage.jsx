import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Import images using Vite's recommended method
const bg1 = new URL("../assets/book.jpg", import.meta.url).href;
const bg2 = new URL("../assets/book2.jpg", import.meta.url).href;
const bg3 = new URL("../assets/book3.jpg", import.meta.url).href;
const bg4 = new URL("../assets/book4.jpg", import.meta.url).href;
const bg5 = new URL("../assets/book5.jpg", import.meta.url).href;

const atomicHabits = new URL("../assets/atomic-habits.jpg", import.meta.url)
  .href;
const deepWork = new URL("../assets/deep-work.jpg", import.meta.url).href;
const alchemist = new URL("../assets/the-alchemist.jpg", import.meta.url).href;

export default function HomePage() {
  const images = [bg1, bg2, bg3, bg4, bg5];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Featured books carousel
  const featuredBooks = [
    {
      title: "Atomic Habits",
      desc: "An easy & proven way to build good habits and break bad ones.",
      image: atomicHabits,
    },
    {
      title: "Deep Work",
      desc: "Rules for focused success in a distracted world.",
      image: deepWork,
    },
    {
      title: "The Alchemist",
      desc: "A journey of dreams, destiny, and discovery.",
      image: alchemist,
    },
  ];

  const [currentBook, setCurrentBook] = useState(0);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center transition-all duration-[1500ms]"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
      }}
    >
      <Navbar />

      {/* HERO SECTION */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
          Welcome to Reactors
        </h1>

        <p className="text-lg sm:text-xl text-white max-w-2xl mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Track, manage, and enjoy your reading journey. Discover books, build
          your reading list, and never lose track of your progress!
        </p>

        {/* EXPLORE BUTTON */}
        <Link
          to="/books"
          className="px-10 py-5 text-white text-xl font-bold rounded-2xl shadow-xl hover:scale-110 transition-transform"
          style={{ backgroundColor: "#631730ff" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#B4182D")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#631730ff")
          }
        >
          Explore Books
        </Link>

        {/* FEATURES SECTION */}
        <section className="flex justify-center gap-8 mt-20">
          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow hover:shadow-xl transition text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl mb-2">
              📚
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Track</h3>
          </div>

          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow hover:shadow-xl transition text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl mb-2">
              📖
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Discover</h3>
          </div>

          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow hover:shadow-xl transition text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 text-2xl mb-2">
              ⭐
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Motivation</h3>
          </div>
        </section>

        {/* FEATURED BOOKS CAROUSEL */}
        <section className="mt-20 w-full max-w-md px-6">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg text-center">
            Featured Books
          </h2>

          <div className="relative flex items-center justify-center">
            {/* LEFT BUTTON */}
            <button
              onClick={() =>
                setCurrentBook((prev) =>
                  prev === 0 ? featuredBooks.length - 1 : prev - 1
                )
              }
              className="absolute left-0 bg-white/70 hover:bg-white p-2 rounded-full shadow-md"
            >
              ◀
            </button>

            {/* BOOK CARD */}
            <div className="bg-white/90 rounded-xl shadow-lg p-4 w-60 text-center transition-all duration-500">
              <img
                src={featuredBooks[currentBook].image}
                alt={featuredBooks[currentBook].title}
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />

              <h3 className="text-base font-semibold text-gray-900">
                {featuredBooks[currentBook].title}
              </h3>

              <p className="text-xs text-gray-600 mt-1">
                {featuredBooks[currentBook].desc}
              </p>
            </div>

            {/* RIGHT BUTTON */}
            <button
              onClick={() =>
                setCurrentBook((prev) =>
                  prev === featuredBooks.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-0 bg-white/70 hover:bg-white p-2 rounded-full shadow-md"
            >
              ▶
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
