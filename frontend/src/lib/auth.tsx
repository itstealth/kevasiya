"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/utils";
import { setCookie, getCookie, eraseCookie } from "@/lib/cookies";

interface User {
  id: number;
  username: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsLoading(false);
    setIsInitialized(true);
    eraseCookie("adminToken");
    eraseCookie("adminUser");
    router.push("/admin/login");
  }, [router]);

  const verifyToken = useCallback(
    async (tokenToVerify: string): Promise<User | null> => {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/me`, {
          headers: {
            Authorization: `Bearer ${tokenToVerify}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.user;
        } else {
          // Token is invalid
          eraseCookie("adminToken");
          eraseCookie("adminUser");
          return null;
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        eraseCookie("adminToken");
        eraseCookie("adminUser");
        return null;
      }
    },
    []
  );

  // Initialize auth state on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true);
      return;
    }

    const initializeAuth = async () => {
      setIsLoading(true);

      const storedToken = getCookie("adminToken");
      const storedUserString = getCookie("adminUser");

      if (storedToken && storedUserString) {
        try {
          // Verify the token is still valid
          const verifiedUser = await verifyToken(storedToken);

          if (verifiedUser) {
            // Token is valid, set the authenticated state
            setToken(storedToken);
            setUser(verifiedUser);
          } else {
            // Token is invalid, clear everything
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          eraseCookie("adminToken");
          eraseCookie("adminUser");
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, [verifyToken]);

  const login = (newToken: string, userData: User): void => {
    // Persist cookies first so middleware and server components can use them immediately
    setCookie("adminToken", newToken, 1);
    setCookie("adminUser", JSON.stringify(userData), 1);

    // Update client state synchronously
    setToken(newToken);
    setUser(userData);

    // Authentication state is now ready, mark initialized if it wasn't
    setIsInitialized(true);

    // Navigate to the dashboard
    router.replace("/admin");
    // Restore router.refresh() to ensure server components are refetched
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
