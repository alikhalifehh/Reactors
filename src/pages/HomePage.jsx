import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
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
      className="min-h-screen flex flex-col bg-cover bg-center transition-all duration-[1500ms] relative"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
      }}
    >
      {/* DARK MODE OVERLAY */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-black/60 pointer-events-none transition-opacity duration-300" />
      )}

      <div className="relative z-10">
        <Navbar />

        {/* HERO SECTION */}
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-200px)]">
          <h1 className="mt-20 text-6xl font-extrabold text-white mb-6 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
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
                className="absolute left-0 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10"
              >
                ◀
              </button>

              {/* BOOK CARD */}
              <div
                className={`rounded-xl shadow-lg p-4 w-60 text-center transition-all duration-500 ${
                  theme === "dark" ? "bg-zinc-800/90" : "bg-white/90"
                }`}
              >
                <img
                  src={featuredBooks[currentBook].image}
                  alt={featuredBooks[currentBook].title}
                  className="rounded-lg mb-3 w-full h-40 object-cover"
                />

                <h3
                  className={`text-base font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {featuredBooks[currentBook].title}
                </h3>

                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
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
                className="absolute right-0 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10"
              >
                ▶
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
