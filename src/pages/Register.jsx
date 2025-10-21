import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState({ level: "", color: "" });

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  //pass strength
  const checkStrength = (value) => {
    if (!value) {
      setStrength({ level: "", color: "" });
      return;
    }
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[@$!%*?&]/.test(value)) score++;
    if (score <= 2) setStrength({ level: "Weak", color: "bg-red-500" });
    else if (score <= 4)
      setStrength({ level: "Medium", color: "bg-yellow-400" });
    else setStrength({ level: "Strong", color: "bg-green-500" });
  };

  const validateForm = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    if (name.trim().length < 2) {
      setNameError("Full name must be at least 2 characters.");
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const typedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(typedEmail)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.some(
        (u) => (u.email || "").trim().toLowerCase() === typedEmail
      );
      if (exists) {
        setEmailError("This email is already registered.");
        valid = false;
      }
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must include uppercase, lowercase, number, and special character."
      );
      valid = false;
    }

    if (confirmPassword !== password) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }

    return valid;
  };

  const handleRegister = () => {
    if (validateForm()) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      console.log("Mock verification code:", code); // appears in devtools
      setShowVerifyModal(true);
      setVerifyMessage(
        "A 6-digit verification code has been sent (check console)."
      );
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (enteredCode.trim() === verificationCode) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const newUser = { name, email: email.trim().toLowerCase(), password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        setVerifyMessage("✅ Email verified! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setVerifyMessage("❌ Incorrect code. Please try again.");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const resendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(newCode);
    console.log("New mock code:", newCode);
    setVerifyMessage("A new code has been generated (check console).");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex items-center justify-center mt-24">
        <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#660000]">
              Create Your Account
            </h1>
          </header>

          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                required
              />
              {nameError && (
                <p className="text-red-600 text-sm mt-1">{nameError}</p>
              )}
            </div>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                required
              />
              {emailError && (
                <p className="text-red-600 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  checkStrength(val);
                }}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                required
              />
              {password && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                      className={`h-2 ${strength.color} transition-all duration-300`}
                      style={{
                        width:
                          strength.level === "Weak"
                            ? "33%"
                            : strength.level === "Medium"
                            ? "66%"
                            : strength.level === "Strong"
                            ? "100%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      strength.level === "Weak"
                        ? "text-red-600"
                        : strength.level === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {strength.level}
                  </p>
                </div>
              )}
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#660000]"
                required
              />
              {confirmError && (
                <p className="text-red-600 text-sm mt-1">{confirmError}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={isSending}
              className="w-full bg-[#660000] hover:bg-[#550000] text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Register"}
            </button>
          </form>

          {/* Login redirect */}
          <footer className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#660000] font-semibold hover:underline"
            >
              Login here
            </Link>
          </footer>
        </section>
      </main>

      {/* --- Verification Modal --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center transform transition-all duration-300 ease-out scale-100">
            <h2 className="text-2xl font-semibold text-[#660000] mb-3">
              Verify Your Email
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Enter the 6-digit code shown in the console for{" "}
              <strong>{email}</strong>.
            </p>

            <input
              type="text"
              maxLength={6}
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Enter code"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#660000] text-center tracking-widest"
            />

            {verifyMessage && (
              <p
                className={`text-sm mb-3 ${
                  verifyMessage.includes("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {verifyMessage}
              </p>
            )}

            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-[#631730ff] text-white px-4 py-2 rounded-lg hover:bg-[#B4182D] transition disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={resendCode}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Resend Code
              </button>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
