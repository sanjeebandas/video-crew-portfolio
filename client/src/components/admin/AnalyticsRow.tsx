import { useState, useEffect } from "react";
import {
  getContacts,
  getPortfolioItems,
  getPageVisitsFromAPI,
  resetPageVisitsAPI,
} from "../../services/api";

interface AnalyticsData {
  contacts: number;
  portfolioItems: number;
  pageVisits: number;
  contactsChange: number;
  portfolioChange: number;
  visitsChange: number;
}

const AnalyticsRow = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    contacts: 0,
    portfolioItems: 0,
    pageVisits: 0,
    contactsChange: 0,
    portfolioChange: 0,
    visitsChange: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch real data from your API
      const [contactsResponse, portfolioResponse] = await Promise.all([
        getContacts(),
        getPortfolioItems(),
      ]);

      // Get current counts
      const currentContacts = contactsResponse?.length || 0;
      const currentPortfolioItems = portfolioResponse?.length || 0;

      // Get page visits from API
      const currentVisits = await getPageVisitsFromAPI();

      // Debug logging
      console.log("📊 Analytics Update:", {
        currentVisits,
        currentContacts,
        currentPortfolioItems,
      });

      // Get previous data from localStorage for comparison
      const previousData = localStorage.getItem("analyticsData");
      const previous = previousData
        ? JSON.parse(previousData)
        : {
            contacts: 0,
            portfolioItems: 0,
            pageVisits: 0,
          };

      // Calculate percentage changes
      const contactsChange =
        previous.contacts > 0
          ? ((currentContacts - previous.contacts) / previous.contacts) * 100
          : 0;
      const portfolioChange =
        previous.portfolioItems > 0
          ? ((currentPortfolioItems - previous.portfolioItems) /
              previous.portfolioItems) *
            100
          : 0;
      const visitsChange =
        previous.pageVisits > 0
          ? ((currentVisits - previous.pageVisits) / previous.pageVisits) * 100
          : 0;

      const newAnalytics = {
        contacts: currentContacts,
        portfolioItems: currentPortfolioItems,
        pageVisits: currentVisits,
        contactsChange: Math.round(contactsChange * 10) / 10, // Round to 1 decimal
        portfolioChange: Math.round(portfolioChange * 10) / 10,
        visitsChange: Math.round(visitsChange * 10) / 10,
      };

      setAnalytics(newAnalytics);

      // Store current data for next comparison
      localStorage.setItem(
        "analyticsData",
        JSON.stringify({
          contacts: currentContacts,
          portfolioItems: currentPortfolioItems,
          pageVisits: currentVisits,
        })
      );
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Don't fallback to mock data - show real zeros if API fails
      setAnalytics({
        contacts: 0,
        portfolioItems: 0,
        pageVisits: 0,
        contactsChange: 0,
        portfolioChange: 0,
        visitsChange: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();

    // Silent auto-refresh every 5 seconds using the same logic as manual refresh
    const interval = setInterval(() => {
      // Use the same loadAnalytics function for consistency
      const silentRefresh = async () => {
        try {
          // Fetch real data from your API
          const [contactsResponse, portfolioResponse] = await Promise.all([
            getContacts(),
            getPortfolioItems(),
          ]);

          // Get current counts
          const currentContacts = contactsResponse?.length || 0;
          const currentPortfolioItems = portfolioResponse?.length || 0;

          // Get page visits from API
          const currentVisits = await getPageVisitsFromAPI();

          // Get previous data from localStorage for comparison
          const previousData = localStorage.getItem("analyticsData");
          const previous = previousData
            ? JSON.parse(previousData)
            : {
                contacts: 0,
                portfolioItems: 0,
                pageVisits: 0,
              };

          // Calculate percentage changes
          const contactsChange =
            previous.contacts > 0
              ? ((currentContacts - previous.contacts) / previous.contacts) *
                100
              : 0;
          const portfolioChange =
            previous.portfolioItems > 0
              ? ((currentPortfolioItems - previous.portfolioItems) /
                  previous.portfolioItems) *
                100
              : 0;
          const visitsChange =
            previous.pageVisits > 0
              ? ((currentVisits - previous.pageVisits) / previous.pageVisits) *
                100
              : 0;

          const newAnalytics = {
            contacts: currentContacts,
            portfolioItems: currentPortfolioItems,
            pageVisits: currentVisits,
            contactsChange: Math.round(contactsChange * 10) / 10,
            portfolioChange: Math.round(portfolioChange * 10) / 10,
            visitsChange: Math.round(visitsChange * 10) / 10,
          };

          setAnalytics(newAnalytics);

          // Store current data for next comparison
          localStorage.setItem(
            "analyticsData",
            JSON.stringify({
              contacts: currentContacts,
              portfolioItems: currentPortfolioItems,
              pageVisits: currentVisits,
            })
          );
        } catch (error) {
          console.error("Silent analytics refresh failed:", error);
        }
      };
      silentRefresh();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-500" : "text-red-500";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? "↗" : "↘";
  };

  if (loading) {
    return (
      <div className="mb-6 sm:mb-8">
        {/* Analytics Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
            Analytics Overview
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Real-time metrics and performance indicators
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
              <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-700 rounded-lg sm:rounded-xl"></div>
                  <div className="w-16 sm:w-20 h-4 sm:h-6 bg-slate-700 rounded-full"></div>
                </div>
                <div className="w-20 sm:w-24 h-8 sm:h-10 bg-slate-700 rounded mb-1 sm:mb-2"></div>
                <div className="w-24 sm:w-32 h-3 sm:h-4 bg-slate-700 rounded mb-3 sm:mb-4"></div>
                <div className="w-full h-2 sm:h-3 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* Analytics Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
            Analytics Overview
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Real-time metrics and performance indicators
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              console.log("🔄 Manual Refresh - Refreshing analytics data");
              // Refresh only the analytics data
              loadAnalytics();
            }}
            className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 flex items-center gap-1 sm:gap-2"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Refresh Analytics</span>
            <span className="sm:hidden">Refresh</span>
          </button>

          <button
            onClick={async () => {
              try {
                await resetPageVisitsAPI();
                console.log("🧹 Reset page visits");
                loadAnalytics();
              } catch (error) {
                console.error("Failed to reset page visits:", error);
              }
            }}
            className="bg-red-600/50 hover:bg-red-500/50 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-red-600/50 hover:border-red-500/50 flex items-center gap-1 sm:gap-2"
            title="Reset page visits count"
          >
            <span>🧹</span>
            <span className="hidden sm:inline">Reset Visits</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Contacts Analytics */}
        <div className="bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-30"></div>
          <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-orange-500/10 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border border-orange-500/20">
                <span className="text-lg sm:text-2xl">📬</span>
              </div>
              <div
                className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${getChangeColor(
                  analytics.contactsChange
                )} bg-slate-600/50 backdrop-blur-sm border border-slate-500/30`}
              >
                <span className="flex items-center gap-1">
                  {getChangeIcon(analytics.contactsChange)}
                  {Math.abs(analytics.contactsChange)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {analytics.contacts}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Total Contacts
            </p>
            <div className="w-full bg-slate-600/30 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500/60 to-red-500/60 h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min((analytics.contacts / 50) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Portfolio Items Analytics */}
        <div className="bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-30"></div>
          <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-emerald-500/10 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border border-emerald-500/20">
                <span className="text-lg sm:text-2xl">🎯</span>
              </div>
              <div
                className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${getChangeColor(
                  analytics.portfolioChange
                )} bg-slate-600/50 backdrop-blur-sm border border-slate-500/30`}
              >
                <span className="flex items-center gap-1">
                  {getChangeIcon(analytics.portfolioChange)}
                  {Math.abs(analytics.portfolioChange)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {analytics.portfolioItems}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Portfolio Items
            </p>
            <div className="w-full bg-slate-600/30 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500/60 to-teal-500/60 h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min(
                    (analytics.portfolioItems / 20) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Page Visits Analytics */}
        <div className="bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-30"></div>
          <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-blue-500/10 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border border-blue-500/20">
                <span className="text-lg sm:text-2xl">👥</span>
              </div>
              <div
                className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${getChangeColor(
                  analytics.visitsChange
                )} bg-slate-600/50 backdrop-blur-sm border border-slate-500/30`}
              >
                <span className="flex items-center gap-1">
                  {getChangeIcon(analytics.visitsChange)}
                  {Math.abs(analytics.visitsChange)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {analytics.pageVisits.toLocaleString()}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Page Visits
            </p>
            <div className="w-full bg-slate-600/30 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500/60 to-purple-500/60 h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min(
                    (analytics.pageVisits / 2000) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsRow;
