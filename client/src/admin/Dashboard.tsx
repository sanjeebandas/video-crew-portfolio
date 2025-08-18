import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/*  Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                Admin Dashboard
              </h1>
              <p className="text-slate-400 text-lg">
                Welcome back! Here's your portfolio overview
              </p>
            </div>
            
                         {/* Logout Button */}
             <button
               onClick={handleLogout}
               className="group bg-gradient-to-r from-red-600/90 to-pink-600/90 hover:from-red-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 border border-red-500/20 hover:border-red-400/30 flex items-center gap-3"
             >
               <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                 🚪
               </span>
               <span>Logout</span>
             </button>
          </div>
        </div>

        {/*  Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></span>
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manage Contacts Link */}
            <Link
              to="/admin/contacts"
              className="group relative bg-gradient-to-br from-purple-600/90 to-indigo-600/90 backdrop-blur-sm hover:from-purple-500 hover:to-indigo-500 text-white p-8 rounded-2xl font-medium shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 border border-purple-500/20 hover:border-purple-400/30 overflow-hidden animate-in slide-in-from-left fade-in duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                    <span className="text-2xl">📬</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Manage Contacts</h3>
                    <p className="text-purple-100/80 text-sm">
                      View and respond to inquiries
                    </p>
                  </div>
                </div>
                <div className="text-2xl group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
            </Link>

            {/* Manage Portfolio Link */}
            <Link
              to="/admin/portfolio"
              className="group relative bg-gradient-to-br from-emerald-600/90 to-teal-500/90 backdrop-blur-sm hover:from-emerald-500 hover:to-teal-400 text-white p-8 rounded-2xl font-medium shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 border border-emerald-500/20 hover:border-emerald-400/30 overflow-hidden animate-in slide-in-from-right fade-in duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Manage Portfolio</h3>
                    <p className="text-emerald-100/80 text-sm">
                      Create and edit your projects
                    </p>
                  </div>
                </div>
                <div className="text-2xl group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>

        {/*  Welcome Section */}
        <div
          className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 animate-in slide-in-from-bottom fade-in duration-500"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Ready to work!
                </h3>
                <p className="text-slate-400">
                  Your portfolio is looking great. Keep creating amazing
                  projects!
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "200ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "400ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
