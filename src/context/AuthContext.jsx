import React, { createContext, useContext, useState } from 'react';
import ApiService from '../services/ApiService';
import Joi from "joi";

const AuthContext = createContext();
// ✅ Joi schema for validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Login function with Joi validation + API call
  const login = async (email, password) => {
    // 1. Validate input
    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return { success: false, message: error.details[0].message };
    }

    try {
      // 2. Call API
      const response =await ApiService.post("auth/adminLogin", {
        email,
        password,
      });
            if (response.success) {
        // Example: assume API returns { success: true, user: {...}, token: "xxx" }
        setIsAuthenticated(true);
        setUser(response.user);
        // (Optional) store token in localStorage/sessionStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refershToken", response.refreshToken);
        localStorage.setItem("userData", JSON.stringify(response.user));

        return { success: true };
      } else {
        return { success: false, message: response.data?.message || "Login failed" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Server error" };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}