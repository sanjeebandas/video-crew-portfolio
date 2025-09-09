import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );
    if (confirmed) {
    logout();
      toast.success("Logged out successfully!");
      navigate("/admin/login");
    }
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
      icon: "fas fa-chart-line",
      onClick: () => setIsMobileMenuOpen(false),
    },
    {
      path: "/admin/contacts",
      label: "Manage Contacts",
      icon: "fas fa-envelope",
      onClick: () => setIsMobileMenuOpen(false),
    },
    {
      path: "/admin/portfolio",
      label: "Manage Portfolio",
      icon: "fas fa-briefcase",
      onClick: () => setIsMobileMenuOpen(false),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-700 z-50 font-montserrat">
        <div className="flex flex-col w-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <img
                src="/imgs/Frame 362.png"
                alt="Video Crew Logo"
                className="w-24 h-10 hover:scale-105 transition-all duration-200 ease-out"
              />
              <div>
                <p className="text-gray-400 text-xs font-bold">Admin Panel</p>
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
                      ? "text-white border border-gray-600"
                      : "text-gray-300 hover:text-white hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: isActive(item.path) ? '#1F1F1F' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = '#1F1F1F';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={handleGoToHome}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-gray-300 hover:text-white hover:scale-105"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F1F1F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <i className="fas fa-home text-lg"></i>
                <span>Go to Homepage</span>
              </button>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-red-400 hover:text-red-300 border border-red-600 hover:border-red-500 hover:scale-105"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1F1F1F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-black border-b border-gray-700 sticky top-0 z-50 font-montserrat">
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
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
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
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-black border-l border-gray-700 shadow-2xl">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <img
                  src="/imgs/Frame 362.png"
                  alt="Video Crew Logo"
                  className="w-22 h-8"
                />
                <div>
                  <p className="text-white text-sm font-bold">Video Crew</p>
                  <p className="text-gray-300 text-sm">Admin Panel</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
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
                      ? "text-white border border-gray-600"
                      : "text-gray-300 hover:text-white hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: isActive(item.path) ? '#1F1F1F' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = '#1F1F1F';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={item.onClick}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleGoToHome();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-gray-300 hover:text-white hover:scale-105"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F1F1F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <i className="fas fa-home text-lg"></i>
                <span>Go to Homepage</span>
              </button>
            </div>

            {/* Mobile Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-red-400 hover:text-red-300 border border-red-600 hover:border-red-500 hover:scale-105"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F1F1F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
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
