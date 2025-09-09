import { useState, useEffect, useCallback } from "react";
import {
  getContacts,
  getPortfolioItems,
  getPageVisitsFromAPI,
  resetPageVisitsAPI,
} from "../../services/api";
import toast from "react-hot-toast";

interface AnalyticsData {
  contacts: number;
  portfolioItems: number;
  pageVisits: number;
}

interface AnalyticsState {
  data: AnalyticsData;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  consecutiveFailures: number;
  isRetrying: boolean;
}

const AnalyticsRow = () => {
  const [state, setState] = useState<AnalyticsState>({
    data: {
      contacts: 0,
      portfolioItems: 0,
      pageVisits: 0,
    },
    loading: true,
    error: null,
    lastUpdate: null,
    consecutiveFailures: 0,
    isRetrying: false,
  });

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds
  const FAILURE_THRESHOLD = 3; // Show error after 3 consecutive failures

  // Extract common analytics logic to avoid duplication
  const fetchAnalyticsData = useCallback(async (): Promise<AnalyticsData> => {
    try {
      // Fetch real data from API
      const [contactsResponse, portfolioResponse, currentVisits] =
        await Promise.all([
          getContacts(),
          getPortfolioItems(),
          getPageVisitsFromAPI(),
        ]);

      // Get current counts
      const currentContacts = contactsResponse?.length || 0;
      const currentPortfolioItems = portfolioResponse?.length || 0;

      const newAnalytics = {
        contacts: currentContacts,
        portfolioItems: currentPortfolioItems,
        pageVisits: currentVisits,
      };

      return newAnalytics;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  }, []);

  // Load analytics with retry mechanism
  const loadAnalytics = useCallback(
    async (isRetry: boolean = false) => {
      try {
        if (!isRetry) {
          setState((prev) => ({ ...prev, loading: true, error: null }));
        }

        const newAnalytics = await fetchAnalyticsData();

        setState((prev) => ({
          ...prev,
          data: newAnalytics,
          loading: false,
          error: null,
          lastUpdate: new Date(),
          consecutiveFailures: 0,
          isRetrying: false,
        }));

        // Clear any error toasts on success
        toast.dismiss("analytics-error");
      } catch (error) {
        console.error("Error loading analytics:", error);

        const newFailureCount = state.consecutiveFailures + 1;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load analytics data",
          consecutiveFailures: newFailureCount,
          isRetrying: false,
        }));

        // Only show error notification after multiple consecutive failures
        if (newFailureCount >= FAILURE_THRESHOLD) {
          toast.error(
            "Analytics data failed to load. Retrying automatically...",
            { id: "analytics-error", duration: 4000 }
          );
        }

        // Auto-retry with exponential backoff
        if (newFailureCount <= MAX_RETRIES) {
          setState((prev) => ({ ...prev, isRetrying: true }));

          setTimeout(() => {
            loadAnalytics(true);
          }, RETRY_DELAY * newFailureCount);
        }
      }
    },
    [fetchAnalyticsData, state.consecutiveFailures]
  );

  // Silent refresh for real-time updates
  const silentRefresh = useCallback(async () => {
    try {
      const newAnalytics = await fetchAnalyticsData();

      setState((prev) => ({
        ...prev,
        data: newAnalytics,
        lastUpdate: new Date(),
        consecutiveFailures: 0, // Reset on successful silent refresh
      }));
    } catch (error) {
      console.error("Silent analytics refresh failed:", error);

      // Increment failure count but don't show user notification for silent failures
      setState((prev) => ({
        ...prev,
        consecutiveFailures: prev.consecutiveFailures + 1,
      }));
    }
  }, [fetchAnalyticsData]);

  // Manual refresh with user feedback
  const handleManualRefresh = useCallback(async () => {
    toast.loading("Refreshing analytics...", { id: "manual-refresh" });
    await loadAnalytics();
    toast.success("Analytics refreshed!", { id: "manual-refresh" });
  }, [loadAnalytics]);

  useEffect(() => {
    loadAnalytics();

    // Silent auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(silentRefresh, 5000);

    return () => clearInterval(interval);
  }, [loadAnalytics, silentRefresh]);


  // Error boundary fallback - prevent dashboard crashes
  if (state.error && state.consecutiveFailures > MAX_RETRIES) {
    return (
      <div className="mb-6 sm:mb-8 font-montserrat">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-white rounded-full"></span>
            Analytics Overview
          </h2>
        </div>

        <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-4">
            <i className="fas fa-exclamation-triangle text-2xl"></i>
            <p className="mt-2">Analytics data is temporarily unavailable</p>
          </div>
          <div className="space-y-3">
            <p className="text-gray-300 text-sm">
              Last update:{" "}
              {state.lastUpdate
                ? state.lastUpdate.toLocaleTimeString()
                : "Never"}
            </p>
            <button
              onClick={() => loadAnalytics()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>Retry Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div className="mb-6 sm:mb-8 font-montserrat">
        {/* Analytics Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-white rounded-full"></span>
            Analytics Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent opacity-50"></div>
              <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-gray-800 rounded-full"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-700 rounded-lg sm:rounded-xl"></div>
                  <div className="w-16 sm:w-20 h-4 sm:h-6 bg-gray-700 rounded-full"></div>
                </div>
                <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gray-700 rounded mb-1 sm:mb-2"></div>
                <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-700 rounded mb-3 sm:mb-4"></div>
                <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8 font-['Montserrat']">
      {/* Analytics Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-white rounded-full"></span>
            Analytics Overview
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {state.lastUpdate && (
              <span className="block text-xs text-gray-500 mt-1">
                Last updated: {state.lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={state.isRetrying}
            className="bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-gray-600 hover:border-gray-500 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i
              className={state.isRetrying ? "fas fa-clock" : "fas fa-sync-alt"}
            ></i>
            <span className="hidden sm:inline">
              {state.isRetrying ? "Retrying..." : "Refresh Analytics"}
            </span>
            <span className="sm:hidden">
              {state.isRetrying ? "Retrying..." : "Refresh"}
            </span>
          </button>

          <button
            onClick={async () => {
              try {
                await resetPageVisitsAPI();
                loadAnalytics();
                toast.success("Page visits reset successfully!");
              } catch (error) {
                console.error("Failed to reset page visits:", error);
                toast.error("Failed to reset page visits");
              }
            }}
            className="bg-red-900/20 hover:bg-red-800/20 text-red-400 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-red-600 hover:border-red-500 flex items-center gap-1 sm:gap-2"
            title="Reset page visits count"
          >
            <i className="fas fa-broom"></i>
            <span className="hidden sm:inline">Reset Visits</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Error indicator for consecutive failures */}
      {state.consecutiveFailures > 0 &&
        state.consecutiveFailures < FAILURE_THRESHOLD && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
            <p className="text-yellow-400 text-sm text-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>Some analytics
              data may be outdated. Retrying automatically...
            </p>
          </div>
        )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Contacts Analytics */}
        <div className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#272727" }}
              >
                <i className="fas fa-envelope text-lg sm:text-2xl"></i>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {state.data.contacts}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Total Contacts
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-white h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min((state.data.contacts / 50) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Portfolio Items Analytics */}
        <div className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className="w-10 h-10 sm:w-14 sm:h-14  rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#1f1f1f" }}
              >
                <i className="fas fa-briefcase text-lg sm:text-2xl"></i>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {state.data.portfolioItems}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Portfolio Items
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-white h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min(
                    (state.data.portfolioItems / 20) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Page Visits Analytics */}
        <div className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#1f1f1f" }}
              >
                <i className="fas fa-users text-lg sm:text-2xl"></i>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {state.data.pageVisits.toLocaleString()}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Page Visits
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-white h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min(
                    (state.data.pageVisits / 2000) * 100,
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
