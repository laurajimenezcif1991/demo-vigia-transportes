import { createContext, useContext, useState, type ReactNode } from 'react';
import { clearCache } from '../api/apiCache';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  pendingEmail: string;
  setPendingEmail: (email: string) => void;
  login: (email: string, password: string) => Promise<'success' | 'invalid_credentials' | 'network_error'>;
  register: (email: string, name: string, company: string, password: string) => 'success' | 'email_exists';
  verifyOtp: (otp: string) => boolean;
  logout: () => void;
  completeVerification: () => void;
}

// ─── API config ───────────────────────────────────────────────────────────────

const API_BASE = 'https://xhk559kht1.execute-api.us-east-2.amazonaws.com/prod';

// ─── Mock data (register + OTP remain mock until backend contract is ready) ──

interface MockUser {
  email: string;
  password: string;
  name: string;
  company: string;
}

let mockUsers: MockUser[] = [];

let pendingRegistration: MockUser | null = null;

const MOCK_OTP = '925782';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = 'unio-auth-user';

function loadUserFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);
  const [token, setToken] = useState<string | null>(() => loadUserFromStorage()?.token ?? null);
  const [pendingEmail, setPendingEmail] = useState('');

  const login = async (
    email: string,
    _password: string
  ): Promise<'success' | 'invalid_credentials' | 'network_error'> => {
    // Demo mode: accept any non-empty email and password
    if (!email) return 'invalid_credentials';
    const authUser: AuthUser = {
      id: 'demo-vigia',
      email,
      name: 'Equipo Vigía',
      companyId: 'vigia',
      token: 'demo-token',
    };
    setUser(authUser);
    setToken('demo-token');
    try { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser)); } catch { /* ignore */ }
    return 'success';
  };

  const register = (
    email: string,
    name: string,
    company: string,
    password: string
  ): 'success' | 'email_exists' => {
    const exists = mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return 'email_exists';
    pendingRegistration = { email, name, company, password };
    setPendingEmail(email);
    return 'success';
  };

  const verifyOtp = (otp: string): boolean => {
    return otp === MOCK_OTP;
  };

  const completeVerification = () => {
    if (pendingRegistration) {
      mockUsers = [...mockUsers, pendingRegistration];
      setUser({
        id: crypto.randomUUID(),
        email: pendingRegistration.email,
        name: pendingRegistration.name,
        companyId: '',
        token: '',
      });
      pendingRegistration = null;
    }
  };

  const logout = () => {
    clearCache();
    setUser(null);
    setToken(null);
    setPendingEmail('');
    try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, pendingEmail, setPendingEmail, login, register, verifyOtp, logout, completeVerification }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
