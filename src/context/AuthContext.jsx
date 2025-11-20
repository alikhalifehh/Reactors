import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // current user object
  const [loading, setLoading] = useState(true); // true while checking session
  const [mfaData, setMfaData] = useState(null); // { userId, email } for OTP modal

  // Ask the backend who is currently logged in (based on cookie)
  const fetchUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Start Google login by redirecting to backend /auth/google
  const loginWithGoogle = () => {
    window.location.href = authApi.getGoogleUrl();
  };
  const register = async (data) => {
    try {
      const res = await authApi.register(data);

      setMfaData({
        userId: res.data.userId,
        email: res.data.email,
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Email login for local accounts
  const login = async (data) => {
    try {
      const res = await authApi.login(data);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Verify the OTP code sent by email
  const verifyOtp = async ({ userId, otp }) => {
    try {
      const res = await authApi.verifyOtp({ userId, otp });

      setUser(res.data.user);
      setMfaData(null); // close OTP modal

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid code",
      };
    }
  };

  // Ask backend to resend a verification code
  const resendOtp = async (userId) => {
    try {
      await authApi.resendOtp({ userId });
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  // Clear session in backend and reset user on frontend
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore error, still clear local state
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        mfaData,
        setMfaData,
        fetchUser,
        loginWithGoogle,
        register,
        login,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Simple hook for using the auth context
export const useAuth = () => useContext(AuthContext);
