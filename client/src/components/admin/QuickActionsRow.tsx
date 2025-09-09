import { Link } from "react-router-dom";

const QuickActionsRow = () => {
  return (
    <div className="mb-6 sm:mb-8 font-montserrat">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <span className="w-1 h-6 sm:h-8 bg-white rounded-full"></span>
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Manage Contacts Link */}
        <Link
          to="/admin/contacts"
          className="group relative bg-black text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-700 overflow-hidden animate-in slide-in-from-left fade-in"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2A2A2A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors duration-200" style={{ backgroundColor: '#1F1F1F' }}>
                <i className="fas fa-envelope text-lg sm:text-xl md:text-2xl"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">
                  Manage Contacts
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm">
                  View and respond to inquiries
                </p>
              </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-1 transition-transform duration-200">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>

        {/* Manage Portfolio Link */}
        <Link
          to="/admin/portfolio"
          className="group relative bg-black text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-700 overflow-hidden animate-in slide-in-from-right fade-in"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2A2A2A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors duration-200" style={{ backgroundColor: '#1F1F1F' }}>
                <i className="fas fa-briefcase text-lg sm:text-xl md:text-2xl"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">
                  Manage Portfolio
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Create and edit your projects
                </p>
              </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-1 transition-transform duration-200">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActionsRow;
