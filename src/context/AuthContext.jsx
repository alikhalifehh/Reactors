import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mfaData, setMfaData] = useState(null);

  // fetch user
  const fetchUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // google login
  const loginWithGoogle = () => {
    window.location.href = authApi.getGoogleUrl();
  };

  // register
  const register = async (data) => {
    try {
      const res = await authApi.register(data);

      // backend returns: success, mfa, email, userId
      return {
        success: true,
        userId: res.data.userId,
        email: res.data.email,
        mfa: true,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // login
  const login = async (data) => {
    try {
      const res = await authApi.login(data);

      if (res.data.mfa) {
        setMfaData({
          userId: res.data.userId,
          email: res.data.email,
          mode: "verify-login",
        });
        return { mfa: true };
      }

      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // verify otp
  const verifyOtp = async ({ userId, otp }) => {
    try {
      const res = await authApi.verifyOtp({ userId, otp });

      setUser(res.data.user);
      setMfaData(null);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid code",
      };
    }
  };

  // resend otp
  const resendOtp = async (userId) => {
    try {
      await authApi.resendOtp({ userId });
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  // logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {}
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

export const useAuth = () => useContext(AuthContext);
