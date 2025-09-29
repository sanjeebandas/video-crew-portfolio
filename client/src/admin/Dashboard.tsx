import { useState, useEffect, useCallback } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import AnalyticsRow from "../components/admin/AnalyticsRow";
import QuickActionsRow from "../components/admin/QuickActionsRow";
import NotificationsRow from "../components/admin/NotificationsRow";

type ErrorState = {
  message: string;
  type: 'component' | 'network' | 'unknown';
  retryable: boolean;
  component?: string;
};

const Dashboard = () => {
  const [error, setError] = useState<ErrorState | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [componentErrors, setComponentErrors] = useState<Record<string, ErrorState>>({});

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (error?.type === 'network') {
        setError(null);
        setComponentErrors({});
        // Auto-retry when coming back online
        handleRetry();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      if (!error) {
        setError({
          message: "You're currently offline. Some features may be unavailable.",
          type: 'network',
          retryable: true
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  // Error boundary handler for child components (for future use)
  // const handleComponentError = useCallback((componentName: string, error: ErrorState) => {
  //   console.error(`Error in ${componentName}:`, error);
  //   setComponentErrors(prev => ({
  //     ...prev,
  //     [componentName]: error
  //   }));
  // }, []);

  // Retry handler
  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) return;

    try {
      setIsRetrying(true);
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // Clear component errors and retry
      setComponentErrors({});
      setError(null);

      // Simulate retry delay
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * newRetryCount));

      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount]);

  // Error boundary fallback - prevent dashboard crashes
  if (error && !error.retryable && retryCount >= MAX_RETRIES) {
    return (
      <div className="bg-black min-h-screen font-montserrat">
        <AdminNavbar />
        <div className="md:ml-64 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                Welcome back! Here's your portfolio overview
              </p>
            </div>

            <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
              <div className="text-red-400 mb-4">
                <span className="text-2xl">⚠️</span>
                <p className="mt-2">Dashboard is temporarily unavailable</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">
                  {error.message}
                </p>
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                    setComponentErrors({});
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-['Montserrat']">
      {/* Div1: AdminNavbar */}
      <AdminNavbar />

      {/* Div2: Main Dashboard Content */}
      <div className="md:ml-64 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Welcome back! Here's your portfolio overview
            </p>
            
            {/* Network Status Indicator */}
            {isOffline && (
              <div className="mt-2 flex items-center gap-2 text-yellow-400 text-xs">
                <span>📡</span>
                <span>You're currently offline</span>
              </div>
            )}
            
            {/* Retry Status */}
            {isRetrying && (
              <div className="mt-2 flex items-center gap-2 text-blue-400 text-xs">
                <span>⏳</span>
                <span>Retrying... ({retryCount}/{MAX_RETRIES})</span>
              </div>
            )}
          </div>

          {/* Error Display for Component Failures */}
          {Object.keys(componentErrors).length > 0 && (
            <div className="mb-6 bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>⚠️</span>
                  <span className="text-sm">
                    Some components are experiencing issues
                  </span>
                </div>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="text-blue-600 hover:text-blue-500 text-xs font-medium transition-colors"
                >
                  {isRetrying ? "Retrying..." : "Retry"}
                </button>
              </div>
            </div>
          )}

          {/* Row 1: Analytics */}
          <div className="mb-6 sm:mb-8">
            {componentErrors.AnalyticsRow ? (
              <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
                <div className="text-red-400 mb-2">
                  <span className="text-xl">📊</span>
                  <p className="mt-2 text-sm">Analytics temporarily unavailable</p>
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  {componentErrors.AnalyticsRow.message}
                </p>
                <button
                  onClick={() => {
                    setComponentErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.AnalyticsRow;
                      return newErrors;
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                >
                  🔄 Retry Analytics
                </button>
              </div>
            ) : (
              <AnalyticsRow />
            )}
          </div>

          {/* Row 2: Quick Actions */}
          <div className="mb-6 sm:mb-8">
            {componentErrors.QuickActionsRow ? (
              <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
                <div className="text-red-400 mb-2">
                  <span className="text-xl">⚡</span>
                  <p className="mt-2 text-sm">Quick Actions temporarily unavailable</p>
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  {componentErrors.QuickActionsRow.message}
                </p>
                <button
                  onClick={() => {
                    setComponentErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.QuickActionsRow;
                      return newErrors;
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                >
                  🔄 Retry Quick Actions
                </button>
              </div>
            ) : (
              <QuickActionsRow />
            )}
          </div>

          {/* Row 3: Notifications */}
          <div className="mb-6 sm:mb-8">
            {componentErrors.NotificationsRow ? (
              <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
                <div className="text-red-400 mb-2">
                  <span className="text-xl">🔔</span>
                  <p className="mt-2 text-sm">Notifications temporarily unavailable</p>
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  {componentErrors.NotificationsRow.message}
                </p>
                <button
                  onClick={() => {
                    setComponentErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.NotificationsRow;
                      return newErrors;
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                >
                  🔄 Retry Notifications
                </button>
              </div>
            ) : (
              <NotificationsRow />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
