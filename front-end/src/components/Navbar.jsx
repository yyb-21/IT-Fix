import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => (
  <header className="mobile-top-bar">
    <button type="button" onClick={toggleSidebar} className="btn-ghost-icon" aria-label="Open menu">
      <Menu size={20} strokeWidth={1.75} />
    </button>
    <div className="flex items-center gap-2">
      <span className="auth-brand-dot" />
      <span className="font-semibold tracking-tight text-[var(--text-primary)]">HelpDesk</span>
    </div>
    <span className="w-9" aria-hidden />
  </header>
);

export default Navbar;
