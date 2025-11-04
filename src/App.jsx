import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
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
        <AppRoutes />
      </Router>
    </BookContextProvider>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedUser, setLoggedUser] = useState(null);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      JSON.parse(sessionStorage.getItem("loggedInUser"));
    setLoggedUser(user);
  }, []);

  useEffect(() => {
    const protectedPaths = ["/profile", "/reading-list", "/add"];
    const isProtected =
      protectedPaths.includes(location.pathname) ||
      location.pathname.startsWith("/edit");

    if (isProtected && !loggedUser) {
      const pageName = location.pathname.split("/")[1] || "this page";
      setAlert(`⚠️ Please login to access ${pageName}.`);
      setTimeout(() => setAlert(""), 3000);
      navigate("/login");
    }
  }, [location.pathname, loggedUser, navigate]);

  return (
    <main className="pt-24">
      {alert && (
        <div className="bg-yellow-200 text-yellow-900 font-semibold text-center py-2 fixed top-16 left-0 right-0 z-50 shadow-md">
          {alert}
        </div>
      )}

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
  );
}
