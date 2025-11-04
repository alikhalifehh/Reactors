import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar.jsx";
import BooksList from "./pages/BooksList";
import BookDetail from "./pages/BookDetail";
import UserProfile from "./pages/UserProfile";
import ReadingList from "./pages/ReadingList";
import AddEditBook from "./pages/AddEditBook";
import { BookContextProvider } from "./context/BookContext";

export default function App() {
  return (
    <BookContextProvider>
      <Router>
        <Navbar />
        <main className="pt-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/reading-list" element={<ReadingList />} />
            <Route path="/add" element={<AddEditBook />} />
            <Route path="/edit/:id" element={<AddEditBook />} />
          </Routes>
        </main>
      </Router>
    </BookContextProvider>
  );
}
