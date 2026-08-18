import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Candidates", path: "/admin/candidates" },
  { label: "Exam sessions", path: "/admin/sessions" },
  { label: "Workstations", path: "/admin/workstations" },
  { label: "Staff", path: "/admin/staff" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)]">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <span className="font-display text-lg font-semibold text-[var(--color-ink)]">
            SOAIR <span className="text-[var(--color-signal)]">CBT</span>
          </span>
          <p className="mt-0.5 text-xs text-[var(--color-slate)]">Admin console</p>
        </div>
        <nav className="p-3">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-[var(--color-signal)]/10 text-[var(--color-signal)]"
                    : "text-[var(--color-slate)] hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-slate)]">
              {user?.firstName} <span className="font-mono text-xs uppercase text-[var(--color-signal)]">{user?.role}</span>
            </span>
            <button onClick={handleLogout} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:bg-slate-50">
              Log out
            </button>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}