import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false); // togle pass

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // toggle new pass
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // 👁️ toggle confirm pass
  const [step, setStep] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const typedEmail = email.trim().toLowerCase();

      const user = users.find(
        (u) =>
          (u.email || "").trim().toLowerCase() === typedEmail &&
          u.password === password
      );

      if (user) {
        setLoginError("");
        if (rememberMe)
          localStorage.setItem("loggedInUser", JSON.stringify(user));
        else sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "/";
      } else {
        setLoginError("Invalid email or password.");
      }
    }
  };

  // --- Forgot Password Flow ---
  const handleResetRequest = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) =>
        (u.email || "").trim().toLowerCase() === resetEmail.trim().toLowerCase()
    );

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      console.log("Password reset code:", code);
      setResetMessage("A reset code has been sent (check console).");
      setStep(2);
    } else {
      setResetMessage("Email not found. Please register first.");
    }
  };

  const handleVerifyCode = () => {
    if (enteredCode.trim() === verificationCode) {
      setResetMessage("✅ Code verified! Please enter your new password.");
      setStep(3);
    } else {
      setResetMessage("❌ Incorrect code. Try again.");
    }
  };

  const handlePasswordChange = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setResetMessage(
        "Password must include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetMessage("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updated = users.map((u) =>
      (u.email || "").trim().toLowerCase() === resetEmail.trim().toLowerCase()
        ? { ...u, password: newPassword }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updated));
    setResetMessage("✅ Password reset successful! Redirecting...");
    setTimeout(() => closeModal(), 1500);
  };

  const closeModal = () => {
    setShowForgotModal(false);
    setResetEmail("");
    setResetMessage("");
    setVerificationCode("");
    setEnteredCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setStep(1);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex items-center justify-center pt-24">
        <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#660000]">
              Login to Reactors
            </h1>
          </header>

          <form className="space-y-5">
            <fieldset className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* Password with eye toggle 👁️ */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </fieldset>

            <div className="flex items-center justify-between text-sm">
              <label htmlFor="remember" className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[#660000] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {loginError && (
              <p className="text-red-600 text-center text-sm">{loginError}</p>
            )}

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[#660000] hover:bg-[#550000] text-white font-semibold rounded-lg py-2 transition"
            >
              Login
            </button>
          </form>

          <footer className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#660000] font-semibold hover:underline"
            >
              Sign up now!
            </Link>
          </footer>
        </section>
      </main>

      {/* --- Forgot Password Modal --- */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold text-[#660000] mb-4">
                  Forgot Password
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Enter your registered email to receive a reset code.
                </p>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                />
                {resetMessage && (
                  <p className="text-sm text-red-600 mb-3">{resetMessage}</p>
                )}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleResetRequest}
                    className="bg-[#631730ff] text-white px-4 py-2 rounded-lg hover:bg-[#B4182D] transition"
                  >
                    Send Code
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold text-[#660000] mb-4">
                  Verify Code
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Check the console for the code sent to your email.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#660000] text-center tracking-widest"
                />
                {resetMessage && (
                  <p className="text-sm text-red-600 mb-3">{resetMessage}</p>
                )}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleVerifyCode}
                    className="bg-[#631730ff] text-white px-4 py-2 rounded-lg hover:bg-[#B4182D] transition"
                  >
                    Verify
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-semibold text-[#660000] mb-4">
                  Set New Password
                </h2>

                {/* new password with eye 👁️ */}
                <div className="relative mb-3">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* confirm new password with eye 👁️ */}
                <div className="relative mb-3">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {resetMessage && (
                  <p
                    className={`text-sm mb-3 ${
                      resetMessage.includes("✅")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {resetMessage}
                  </p>
                )}

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePasswordChange}
                    className="bg-[#631730ff] text-white px-4 py-2 rounded-lg hover:bg-[#B4182D] transition"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
