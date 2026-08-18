import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === "/register";
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg font-semibold text-[var(--color-ink)]">
          SOAIR <span className="text-[var(--color-signal)]">CBT</span>
        </span>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Home</Link>
          <Link to="/about" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">About</Link>
          <Link to="/services" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Services</Link>
          <Link to="/calendar" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Exam calendar</Link>
          <Link to="/contact" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
                            <span className="text-sm text-[var(--color-slate)]">Hi, {user.firstName}</span>
              <button onClick={handleLogout} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-slate-50">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Log in</Link>
              {!isRegisterPage && (
                <Link to="/register" className="rounded-md bg-[var(--color-signal)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c8663]">
                  Register now
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}