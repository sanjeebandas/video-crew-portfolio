import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    // Redirect to login page after logout
    window.location.href = "/admin/login";
  };

  const handleGoToHome = () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this page and go back to the homepage?"
    );
    if (confirmed) {
      window.location.href = "/";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: "📊",
      onClick: () => setIsMobileMenuOpen(false),
    },
    {
      path: "/admin/contacts",
      label: "Manage Contacts",
      icon: "📬",
      onClick: () => setIsMobileMenuOpen(false),
    },
    {
      path: "/admin/portfolio",
      label: "Manage Portfolio",
      icon: "🎯",
      onClick: () => setIsMobileMenuOpen(false),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 z-50">
        <div className="flex flex-col w-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <img
                src="/imgs/Frame 362.png"
                alt="Video Crew Logo"
                className="w-24 h-10"
              />
              <div>
                <p className="text-white text-sm font-bold">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.onClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white border border-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={handleGoToHome}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-slate-300 hover:text-white hover:bg-slate-700/30"
              >
                <span className="text-xl">🏠</span>
                <span>Go to Homepage</span>
              </button>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/30"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/imgs/Frame 362.png"
                alt="Video Crew Logo"
                className="w-24 h-10"
              />
            </div>

            <button
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/30"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 shadow-2xl">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <img
                  src="/imgs/Frame 362.png"
                  alt="Video Crew Logo"
                  className="w-22 h-8"
                />
                <div>
                  <p className="text-white text-sm font-bold">Video Crew</p>
                  <p className="text-slate-400 text-sm">Admin Panel</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/30"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white border border-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                  }`}
                  onClick={item.onClick}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleGoToHome();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-slate-300 hover:text-white hover:bg-slate-700/30"
              >
                <span className="text-xl">🏠</span>
                <span>Go to Homepage</span>
              </button>
            </div>

            {/* Mobile Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/30"
              >
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
