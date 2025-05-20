// src/pages/AuthPage.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Adjust path to your Supabase client
import { AuthError, User } from "@supabase/supabase-js";
import { Mail, Lock, LogIn, UserPlus, KeyRound, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
  onLoginSuccess?: (user: User) => void; // Callback for successful login
  onNavigate?: (page: string, params?: any) => void; // For navigation to sign-up or forgot-password
  initialMode?: "login" | "signup"; // To set the initial view
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onNavigate, initialMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgotPassword">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For sign-up
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For success messages (e.g., password reset email sent)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Clear errors/messages when mode changes
    setError(null);
    setMessage(null);
    // Reset fields, but maybe keep email if switching between login/signup
    // setPassword('');
    // setConfirmPassword('');
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else if (data.user) {
      setMessage("Login successful! Redirecting...");
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        onNavigate?.("landing"); // Default navigation if no specific callback
      }
    } else {
      setError("Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      // You can add options for email confirmation redirection here
      // options: {
      //   emailRedirectTo: `${window.location.origin}/`
      // }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.session === null && data.user?.identities?.length === 0) {
      // This case can happen if email confirmation is required but the user already exists without being confirmed.
      // Supabase might return a user object but no session.
      setError("This email address is already registered but not confirmed. Please check your email or try logging in.");
    } else if (data.user) {
      if (data.session) {
        // User logged in directly (e.g. email confirmation disabled)
        setMessage("Sign up successful! Redirecting...");
        if (onLoginSuccess) onLoginSuccess(data.user);
        else onNavigate?.("landing");
      } else {
        // Email confirmation required
        setMessage("Sign up successful! Please check your email to confirm your account.");
      }
    } else {
      setError("Sign up failed. Please try again.");
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // redirectTo: `${window.location.origin}/account/update-password`, // URL to redirect to after clicking the link in email
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("If an account exists for this email, a password reset link has been sent.");
    }
    setLoading(false);
  };

  const renderFormFields = () => {
    if (mode === "forgotPassword") {
      return (
        <>
          <div>
            <label htmlFor="email-reset" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                id="email-reset"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
              />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {mode === "signup" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* You can add First Name / Last Name here if you want to collect it during sign up and update profile */}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password_auth" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              id="password_auth"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 pr-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-green-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {mode === "signup" && (
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-green-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  let submitHandler = handleLogin;
  let buttonText = "Sign In";
  let titleText = "Sign in to Your Account";
  let IconComponent = LogIn;

  if (mode === "signup") {
    submitHandler = handleSignUp;
    buttonText = "Create Account";
    titleText = "Create a New Account";
    IconComponent = UserPlus;
  } else if (mode === "forgotPassword") {
    submitHandler = handlePasswordReset;
    buttonText = "Send Reset Link";
    titleText = "Reset Your Password";
    IconComponent = KeyRound;
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <IconComponent size={48} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900">{titleText}</h2>
        </div>

        {/* Tabs for Login/Signup (only if not in forgotPassword mode) */}
        {mode !== "forgotPassword" && (
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 text-center font-medium text-sm transition-all duration-300 ease-in-out
                ${mode === "login" ? "border-b-2 border-green-600 text-green-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 text-center font-medium text-sm transition-all duration-300 ease-in-out
                ${mode === "signup" ? "border-b-2 border-green-600 text-green-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          {renderFormFields()}

          {mode === "login" && (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("forgotPassword");
                  }}
                  className="font-medium text-green-600 hover:text-green-500 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
          {message && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 disabled:opacity-70"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : buttonText}
            </button>
          </div>
          {mode === "forgotPassword" && (
            <div className="text-sm text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                }}
                className="font-medium text-green-600 hover:text-green-500 hover:underline"
              >
                Back to Sign In
              </a>
            </div>
          )}
        </form>

        {mode !== "forgotPassword" && (
          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode(mode === "login" ? "signup" : "login");
                }}
                className="font-medium text-green-600 hover:text-green-500 hover:underline"
              >
                {mode === "login" ? "Sign up here" : "Sign in here"}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
