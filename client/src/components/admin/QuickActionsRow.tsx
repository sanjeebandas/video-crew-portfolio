import { Link } from "react-router-dom";

const QuickActionsRow = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></span>
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Manage Contacts Link */}
        <Link
          to="/admin/contacts"
          className="group relative bg-gradient-to-br from-purple-600/90 to-indigo-600/90 backdrop-blur-sm hover:from-purple-500 hover:to-indigo-500 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl font-medium shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 border border-purple-500/20 hover:border-purple-400/30 overflow-hidden animate-in slide-in-from-left fade-in duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                <span className="text-lg sm:text-xl md:text-2xl">📬</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">Manage Contacts</h3>
                <p className="text-purple-100/80 text-xs sm:text-sm">
                  View and respond to inquiries
                </p>
              </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-1 transition-transform duration-200">
              →
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
        </Link>

        {/* Manage Portfolio Link */}
        <Link
          to="/admin/portfolio"
          className="group relative bg-gradient-to-br from-emerald-600/90 to-teal-500/90 backdrop-blur-sm hover:from-emerald-500 hover:to-teal-400 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl font-medium shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 border border-emerald-500/20 hover:border-emerald-400/30 overflow-hidden animate-in slide-in-from-right fade-in duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                <span className="text-lg sm:text-xl md:text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">Manage Portfolio</h3>
                <p className="text-emerald-100/80 text-xs sm:text-sm">
                  Create and edit your projects
                </p>
              </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-1 transition-transform duration-200">
              →
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActionsRow;
