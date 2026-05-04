import { type ReactNode } from 'react';

// Demo mode: auth check disabled — all routes are publicly accessible.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
