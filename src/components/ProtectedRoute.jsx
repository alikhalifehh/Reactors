import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking cookies/session
  if (loading) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">Loading...</div>
    );
  }

  // Not logged in → send to login and remember where user wanted to go
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
