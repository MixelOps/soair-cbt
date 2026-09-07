import { useAuthStore } from "../store/authStore";

export function startAuthRefresh() {
  setInterval(async () => {
    const { refreshToken, user, setAuth, logout } = useAuthStore.getState();
    if (!refreshToken || !user) return;

    try {
      const res = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAuth(data.accessToken, data.user, data.refreshToken);
    } catch {
      logout();
    }
  }, 45 * 60 * 1000); // every 45 minutes, comfortably before the ~1hr expiry
}