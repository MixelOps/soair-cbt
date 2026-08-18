import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}