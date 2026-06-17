import { Link, NavLink, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9]">
      {/* Banner */}
      <Link to="/" className="block w-full">
        <img
          src="/ps-header.png"
          alt="PhishStats"
          className="w-full object-cover object-center block"
          style={{ height: '144px' }}
        />
      </Link>

      {/* Public nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
            Phish<span className="text-primary">Stats</span>
          </span>
          <div className="flex-1" />
          <NavLink
            to="/login"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5"
          >
            Log In
          </NavLink>
          <NavLink
            to="/login?mode=register"
            className="text-sm font-medium bg-primary hover:bg-primary-600 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Sign Up
          </NavLink>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
