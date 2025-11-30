import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

export default function Register() {
  const { register, setMfaData } = useAuth();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";
    if (form.name.trim().length > 30)
      newErrors.name = "Name cannot exceed 30 characters.";
    if (/\d/.test(form.name)) newErrors.name = "Name cannot contain numbers.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    const { password } = form;
    if (password.length < 8)
      newErrors.password = "Minimum length is 8 characters.";
    else if (!/[A-Z]/.test(password))
      newErrors.password = "At least one uppercase letter required.";
    else if (!/[a-z]/.test(password))
      newErrors.password = "At least one lowercase letter required.";
    else if (!/\d/.test(password))
      newErrors.password = "At least one number required.";
    else if (!/[@$!%*?&]/.test(password))
      newErrors.password = "At least one special character required.";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const evaluatePasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[@$!%*?&]/.test(value)) score++;

    if (score <= 2) return 1;
    if (score === 3 || score === 4) return 2;
    return 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const foundErrors = validateForm();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    setLoading(true);

    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (!res.success) {
      setErrors({ server: res.message });
      return;
    }

    if (res.mfa) {
      setMfaData({
        userId: res.userId,
        email: res.email,
        mode: "verify-register",
      });
    }
  };

  return (
    <>
      <Navbar />

      <main className={`min-h-screen flex items-center justify-center pt-24 px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-zinc-950" : "bg-gray-100"
      }`}>
        <section className={`w-full max-w-md rounded-2xl shadow-lg p-8 ${
          theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
        }`}>
          <h1 className="text-3xl font-bold text-center mb-6 text-[#660000]">
            Create Your Account
          </h1>

          {errors.server && (
            <p className="text-red-600 text-center mb-3">{errors.server}</p>
          )}

          <button
            onClick={() => {
              window.location.href = "http://localhost:5000/api/auth/google";
            }}
            className={`w-full flex items-center justify-center gap-3 border py-2 mb-6 rounded-lg transition ${
              theme === "dark"
                ? "border-zinc-700 hover:bg-zinc-800"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
              Sign up with Google
            </span>
          </button>

          <div className="flex items-center my-6">
            <div className={`flex-grow h-px ${theme === "dark" ? "bg-zinc-700" : "bg-gray-300"}`}></div>
            <span className={`px-4 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>OR</span>
            <div className={`flex-grow h-px ${theme === "dark" ? "bg-zinc-700" : "bg-gray-300"}`}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Full Name
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === "dark"
                    ? "bg-zinc-800 border-zinc-700 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === "dark"
                    ? "bg-zinc-800 border-zinc-700 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === "dark"
                    ? "bg-zinc-800 border-zinc-700 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, password: val });
                  setPasswordStrength(evaluatePasswordStrength(val));
                }}
                required
              />

              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

              <div className="w-full mt-2">
                <div className={`h-2 w-full rounded-full overflow-hidden ${
                  theme === "dark" ? "bg-zinc-700" : "bg-gray-300"
                }`}>
                  <div
                    className={`h-full transition-all duration-500 ${
                      passwordStrength === 1
                        ? "bg-red-500 w-1/3"
                        : passwordStrength === 2
                        ? "bg-yellow-500 w-2/3"
                        : "bg-green-500 w-full"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full border rounded-lg px-3 py-2 ${
                  theme === "dark"
                    ? "bg-zinc-800 border-zinc-700 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#660000] hover:bg-[#550000] text-white py-2 rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className={`text-center text-sm mt-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#660000] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}