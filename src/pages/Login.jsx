import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { loginWithGoogle, login, setMfaData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customLoginError, setCustomLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    setCustomLoginError("");
    setLoading(true);

    const res = await login({ email, password });

    setLoading(false);

    // MFA login
    if (res.mfa) {
      setMfaData({
        userId: res.userId,
        email: res.email,
        mode: "verify-login",
      });
      return;
    }

    // normal login
    if (res.success) {
      navigate(redirectTo);
    } else {
      setCustomLoginError(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* HEADER */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#631730ff]">Welcome Back</h1>
          <p className="text-sm text-gray-600 mt-1">
            Log in to continue your reading journey 📚
          </p>
        </header>

        {/* GOOGLE LOGIN */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3
                     bg-[#631730ff] hover:bg-[#B4182D]
                     text-white font-semibold py-2.5 rounded-lg shadow transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* EMAIL LOGIN */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#631730ff]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#631730ff]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {customLoginError && (
            <p className="text-sm text-red-600 text-center">
              {customLoginError}
            </p>
          )}

          <button
            onClick={handleEmailLogin}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <footer className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#631730ff] font-semibold hover:underline"
          >
            Register
          </Link>
        </footer>
      </section>
    </main>
  );
}
