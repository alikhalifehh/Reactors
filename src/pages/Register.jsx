import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loginWithGoogle, setMfaData } = useAuth();

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // local errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // validate
  const validate = () => {
    const newErrors = {};
    if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";
    if (!email.includes("@")) newErrors.email = "Enter a valid email.";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    // backend register request
    const res = await register({ name, email, password });

    setLoading(false);

    // registration failed
    if (!res.success) {
      setErrors({ server: res.message });
      return;
    }

    //success
    setMfaData({
      userId: res.user.id,
      email: res.user.email,
      mode: "verify-register",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center pt-24">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#660000]">
          Create Your Account
        </h1>

        {errors.server && (
          <p className="text-red-600 text-center mb-3">{errors.server}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#660000] hover:bg-[#550000] text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <hr className="flex-1" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="flex-1" />
        </div>

        {/* Google Signup */}
        <button
          onClick={loginWithGoogle}
          className="w-full bg-white border py-2 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100"
        >
          <img src="/google.png" alt="Google" className="w-5" />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center text-sm mt-6">
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
  );
}
