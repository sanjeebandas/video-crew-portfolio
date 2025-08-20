import AdminNavbar from "../components/admin/AdminNavbar";
import AnalyticsRow from "../components/admin/AnalyticsRow";
import QuickActionsRow from "../components/admin/QuickActionsRow";
import NotificationsRow from "../components/admin/NotificationsRow";

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen">
      {/* Div1: AdminNavbar */}
      <AdminNavbar />
      
      {/* Div2: Main Dashboard Content */}
      <div className="md:ml-64 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">VC</span>
              </div>
              <span className="text-slate-400 text-xs sm:text-sm font-medium">Video Crew</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2 sm:mb-3">
                Admin Dashboard
              </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg">
                Welcome back! Here's your portfolio overview
              </p>
            </div>

          {/* Row 1: Analytics */}
          <AnalyticsRow />

          {/* Row 2: Quick Actions */}
          <QuickActionsRow />

          {/* Row 3: Notifications */}
          <NotificationsRow />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
