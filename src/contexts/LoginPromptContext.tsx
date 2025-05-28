// src/contexts/LoginPromptContext.tsx (New File)
import React, { createContext, useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface LoginPromptContextType {
  isLoginPromptVisible: boolean;
  showLoginPrompt: (options?: { returnUrl?: string }) => void;
  hideLoginPrompt: () => void;
  loginAndReturn: (loginFn: () => Promise<any>) => Promise<void>; // Helper for inline login
}

const LoginPromptContext = createContext<LoginPromptContextType | undefined>(undefined);

export const LoginPromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginPromptVisible, setIsLoginPromptVisible] = useState(false);
  const [_returnUrl, setReturnUrl] = useState<string | null>(null);
  // const navigate = useNavigate();
  const location = useLocation();

  const showLoginPrompt = useCallback(
    (options?: { returnUrl?: string }) => {
      setReturnUrl(options?.returnUrl || location.pathname + location.search);
      setIsLoginPromptVisible(true);
    },
    [location]
  );

  const hideLoginPrompt = useCallback(() => {
    setIsLoginPromptVisible(false);
    setReturnUrl(null);
  }, []);

  // Optional: A helper for components that want to trigger an action after login
  // This might be more complex depending on how you want the UX to flow
  const loginAndReturn = useCallback(
    async (_actionFn: () => Promise<any>) => {
      // This is a simplified version. You might want to store 'actionFn'
      // and execute it after successful login via the AuthPage.
      showLoginPrompt();
    },
    [showLoginPrompt]
  );

  return (
    <LoginPromptContext.Provider
      value={{ isLoginPromptVisible, showLoginPrompt, hideLoginPrompt, loginAndReturn }}
    >
      {children}
    </LoginPromptContext.Provider>
  );
};

export const useLoginPrompt = (): LoginPromptContextType => {
  const context = useContext(LoginPromptContext);
  if (!context) {
    throw new Error("useLoginPrompt must be used within a LoginPromptProvider");
  }
  return context;
};
