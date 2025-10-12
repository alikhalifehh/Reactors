import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  
  const images = [
    "/src/assets/book.jpg",
    "/src/assets/book2.jpg",
    "/src/assets/book3.jpg",
    "/src/assets/book4.jpg",
    "/src/assets/book5.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const featuredBooks = [
    {
      title: "Atomic Habits",
      desc: "An easy & proven way to build good habits and break bad ones.",
      image: "/src/assets/atomic-habits.jpg",
    },
    {
      title: "Deep Work",
      desc: "Rules for focused success in a distracted world.",
      image: "/src/assets/deep-work.jpg",
    },
    {
      title: "The Alchemist",
      desc: "A journey of dreams, destiny, and discovery.",
      image: "/src/assets/the-alchemist.jpg",
    },
  ];

  const [currentBook, setCurrentBook] = useState(0);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 mt-20">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
          Welcome to Reactors
        </h1>
        <p className="text-lg sm:text-xl text-white max-w-2xl mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Track, manage, and enjoy your reading journey.  
          Discover books, build your reading list, and never lose track of your progress!
        </p>
        <button
          className="px-10 py-5 text-white text-xl font-bold rounded-2xl shadow-xl hover:scale-110 transition-transform"
          style={{ backgroundColor: "#5412B" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#B4182D")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#631730ff")}
        >
          Explore Books
        </button>

        {/* Features Section (Circular) */}
        <section className="flex justify-center gap-8 mt-20">
          {/* Track Books */}
          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow hover:shadow-xl transition text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl mb-2">
              📚
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Track</h3>
          </div>

          {/* Discover Details */}
          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow hover:shadow-xl transition text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl mb-2">
              📖
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Discover</h3>
          </div>

          {/* Stay Motivated */}
          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white/90 rounded-full shadow hover:shadow-xl transition text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 text-2xl mb-2">
              ⭐
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Motivation</h3>
          </div>
        </section>

        {/* Featured Books Carousel */}
        <section className="mt-20 w-full max-w-md px-6">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg text-center">
            Featured Books
          </h2>

          <div className="relative flex items-center justify-center">
            {/* Left Button */}
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

            {/* Book Card */}
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

            {/* Right Button */}
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

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
