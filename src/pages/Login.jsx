import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// ---- Forgot Password Modal ----
export function ForgotPasswordModal({ initialEmail = "", onClose }) {
  const [step, setStep] = useState(1); // 1 email, 2 code, 3 password
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // ---- Password strength evaluation ----
  const evaluatePasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[@$!%*?&]/.test(value)) score++;

    if (score <= 2) return 1;
    if (score <= 4) return 2;
    return 3;
  };

  const validateNewPassword = () => {
    if (newPassword.length < 8) return "Minimum length is 8 characters.";
    if (!/[A-Z]/.test(newPassword))
      return "Needs at least one uppercase letter.";
    if (!/[a-z]/.test(newPassword))
      return "Needs at least one lowercase letter.";
    if (!/\d/.test(newPassword)) return "Needs at least one number.";
    if (!/[@$!%*?&]/.test(newPassword))
      return "Needs at least one special character.";
    if (newPassword !== confirmNewPassword) return "Passwords do not match.";
    return "";
  };

  // ---- STEP 1: Send Reset Email ----
  const handleSendEmail = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || "Could not send reset email.");
        return;
      }

      setUserId(data.userId);
      setMessage("A reset code has been sent to your email.");
      setStep(2);
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  // ---- STEP 2: Verify Code ----
  const handleVerifyCode = async () => {
    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter the code you received.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || "Invalid or expired code.");
        return;
      }

      setMessage("Code verified! You can now set a new password.");
      setStep(3);
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  // ---- STEP 3: Reset Password ----
  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    const validationError = validateNewPassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || "Could not reset password.");
        return;
      }

      setMessage("Password changed successfully. You can now log in.");

      setTimeout(onClose, 1200);
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#631730ff] mb-2 text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          {step === 1 && "Enter your email to receive a reset code."}
          {step === 2 && "Enter the 6-digit code sent to your email."}
          {step === 3 && "Choose a new password for your account."}
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-3">{error}</p>
        )}

        {message && (
          <p className="text-sm text-green-600 text-center mb-3">{message}</p>
        )}

        {/* ---- STEP 1: Enter Email ---- */}
        {step === 1 && (
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

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full bg-[#631730ff] hover:bg-[#B4182D] text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </div>
        )}

        {/* ---- STEP 2: Enter Code ---- */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#631730ff]"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full bg-[#631730ff] hover:bg-[#B4182D] text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
        )}

        {/* ---- STEP 3: New Password ---- */}
        {step === 3 && (
          <div className="space-y-4">
            {/* NEW PASSWORD */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                New Password
              </label>

              <input
                type="password"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#631730ff]"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewPassword(val);
                  setPasswordStrength(evaluatePasswordStrength(val));
                }}
              />

              {/* Password meter */}
              <div className="w-full mt-2">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`
                      h-full transition-all duration-500
                      ${
                        passwordStrength === 1
                          ? "bg-red-500 w-1/3"
                          : passwordStrength === 2
                          ? "bg-yellow-500 w-2/3"
                          : passwordStrength === 3
                          ? "bg-green-500 w-full"
                          : "w-0"
                      }
                    `}
                  ></div>
                </div>
              </div>

              {newPassword && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === 1
                      ? "text-red-500"
                      : passwordStrength === 2
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Strength:{" "}
                  {passwordStrength === 1
                    ? "Weak"
                    : passwordStrength === 2
                    ? "Medium"
                    : "Strong"}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Confirm New Password
              </label>

              <input
                type="password"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#631730ff]"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save New Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Main Login Component ----
export default function Login() {
  const { loginWithGoogle, login, setMfaData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [customLoginError, setCustomLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);

  const handleEmailLogin = async () => {
    setCustomLoginError("");
    setLoading(true);

    const res = await login({ email, password });

    setLoading(false);

    // MFA flow
    if (res.mfa) {
      setMfaData({
        userId: res.userId,
        email: res.email,
        mode: "verify-login",
      });
      return;
    }

    if (res.success) {
      navigate(redirectTo);
    } else {
      setCustomLoginError(res.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 px-4">
        <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* HEADER */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#631730ff]">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Log in to continue your reading journey 📚
            </p>
          </header>

          {/* GOOGLE LOGIN */}
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-[#631730ff] hover:bg-[#B4182D] text-white font-semibold py-2.5 rounded-lg shadow transition"
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

          {/* EMAIL LOGIN FORM */}
          <div className="space-y-4">
            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Password
              </label>

              <input
                type="password"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#631730ff]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-[#631730ff] hover:underline"
                >
                  Forgot password?
                </button>
              </p>
            </div>

            {/* ERRORS */}
            {customLoginError && (
              <p className="text-sm text-red-600 text-center">
                {customLoginError}
              </p>
            )}

            {/* SUBMIT */}
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

      {showForgot && (
        <ForgotPasswordModal
          initialEmail={email}
          onClose={() => setShowForgot(false)}
        />
      )}
    </>
  );
}
