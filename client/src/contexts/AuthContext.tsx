import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface DemoUser {
  name: string;
  role: string;
}

/**
 * Same storage key the design prototype uses (`aa_auth`), so the built site
 * and the .dc.html files agree on what "signed in" means.
 *
 * This is the demo session only — it exists so the signed-in navigation and
 * the منصة الإدخال entry can be exercised before UAE PASS OIDC is wired. The
 * real flow replaces `login` with the redirect to the identity provider.
 */
const KEY = "aa_auth";

interface AuthValue {
  user: DemoUser | null;
  login: (user: DemoUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue>({
  user: null,
  login: () => {},
  logout: () => {},
});

function read(): DemoUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.name === "string" ? parsed : null;
  } catch {
    // Storage can be unavailable (private windows, sandboxed previews).
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(read);

  // Follow sign-ins and sign-outs made in other tabs.
  useEffect(() => {
    const sync = () => setUser(read());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = (next: DemoUser) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* session still works in memory */
    }
    setUser(next);
  };

  const logout = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
