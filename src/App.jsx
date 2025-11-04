import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar.jsx";
import BooksList from "./pages/BooksList";
import BookDetail from "./pages/BookDetail";
import UserProfile from "./pages/UserProfile";
import ReadingList from "./pages/ReadingList";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/reading-list" element={<ReadingList />} />
        </Routes>
      </main>
    </Router>
  );
}
