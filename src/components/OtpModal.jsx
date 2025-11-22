import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OtpModal() {
  const { mfaData, verifyOtp, resendOtp, setMfaData } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    setOtp("");
    setMessage("");
    setResent(false);
  }, [mfaData]);

  if (!mfaData) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await verifyOtp({
      userId: mfaData.userId,
      otp,
    });

    setLoading(false);

    if (!res.success) {
      setMessage(res.message);
    } else {
      setMfaData(null);
      setTimeout(() => navigate("/"), 0);
    }
  };

  const handleResend = async () => {
    setResent(false);
    const res = await resendOtp(mfaData.userId);
    if (res.success) {
      setResent(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-center mb-2 text-[#631730ff]">
          Verification Required
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit code sent to:
          <br />
          <span className="font-medium text-black">{mfaData.email}</span>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
            className="border p-2 rounded-md text-center tracking-widest text-lg focus:ring-2 focus:ring-[#631730ff]"
            required
          />

          {message && (
            <p className="text-center text-red-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#631730ff] text-white py-2 rounded-md hover:bg-[#B4182D] transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="text-sm text-[#631730ff] hover:underline"
          >
            Resend code
          </button>

          {resent && (
            <p className="text-center text-green-600 text-sm">
              A new code has been sent!
            </p>
          )}
        </form>

        <button
          onClick={() => setMfaData(null)}
          className="mt-4 w-full text-center text-gray-600 text-sm hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
