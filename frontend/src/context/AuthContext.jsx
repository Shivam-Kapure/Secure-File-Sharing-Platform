import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const data = await api.me();
        if (!mounted) return;
        setIsAuthenticated(true);
        setUserId(data.userId || null);
      } catch {
        if (!mounted) return;
        setIsAuthenticated(false);
        setUserId(null);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const value = {
    ready,
    isAuthenticated,
    userId,
    markAuthenticated(nextUserId) {
      setIsAuthenticated(true);
      setUserId(nextUserId || null);
    },
    markLoggedOut() {
      setIsAuthenticated(false);
      setUserId(null);
    },
    async logout() {
      try {
        await api.logout();
      } catch (error) {
        console.error("Logout error", error);
      } finally {
        setIsAuthenticated(false);
        setUserId(null);
        // Force reload to clear cache/state if needed
        window.location.href = "/login";
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
