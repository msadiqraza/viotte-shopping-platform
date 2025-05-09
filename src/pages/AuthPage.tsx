// -----------------------------------------------------------------------------
// 2. pages/AuthPage.tsx
// Description: Authentication page with Login and Register forms.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/AuthPage.tsx` directory

import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const InputField: React.FC<{ type: string; placeholder: string; icon: React.ReactNode; id: string; showToggle?: boolean; onToggle?: () => void; isShown?: boolean }> = 
    ({ type, placeholder, icon, id, showToggle, onToggle, isShown }) => (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
      />
      {showToggle && onToggle && (
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-sky-600">
          {isShown ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-center font-medium text-sm transition-all duration-300 ease-in-out
              ${isLogin ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-center font-medium text-sm transition-all duration-300 ease-in-out
              ${!isLogin ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Register
          </button>
        </div>

        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <InputField type="text" placeholder="Full Name" icon={<User className="text-slate-400" size={20} />} id="fullName" />
            )}
            <InputField type="email" placeholder="Email address" icon={<Mail className="text-slate-400" size={20} />} id="email" />
            <InputField 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              icon={<Lock className="text-slate-400" size={20} />} 
              id="password"
              showToggle={true}
              onToggle={() => setShowPassword(!showPassword)}
              isShown={showPassword}
            />
            {!isLogin && (
              <InputField 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                icon={<Lock className="text-slate-400" size={20} />} 
                id="confirmPassword"
                showToggle={true}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                isShown={showConfirmPassword}
              />
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900"> Remember me </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-sky-600 hover:text-sky-500"> Forgot your password? </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500"> Or continue with </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3"> {/* Changed to 1 column for better mobile view, can be grid-cols-2 for larger screens */}
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.735 9.494.49.09.665-.214.665-.476 0-.234-.008-.855-.013-1.678-2.782.602-3.368-1.34-3.368-1.34-.446-1.132-1.088-1.434-1.088-1.434-.89-.608.068-.596.068-.596.984.07 1.503.998 1.503.998.874 1.496 2.295 1.064 2.853.814.09-.632.34-.94.617-1.155-2.178-.248-4.465-1.09-4.465-4.842 0-1.07.384-1.946 1.012-2.63-.102-.248-.438-1.243.096-2.594 0 0 .823-.264 2.696.996A9.407 9.407 0 0110 4.97c.85.003 1.702.115 2.498.345 1.87-1.26 2.693-.996 2.693-.996.536 1.35.2 2.346.098 2.594.63.684 1.012 1.56 1.012 2.63 0 3.762-2.29 4.59-4.478 4.832.348.3.655.89.655 1.792l-.01 2.683c0 .264.174.57.67.473C17.138 18.163 20 14.416 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              Google
            </button>
            {/* Add more social login buttons here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};
