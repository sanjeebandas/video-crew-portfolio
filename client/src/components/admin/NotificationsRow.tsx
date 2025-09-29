import { useState, useEffect } from "react";
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../../services/api";

interface Notification {
  _id: string;
  type: "portfolio" | "contact" | "page_visit" | "system";
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

const NotificationsRow = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  useEffect(() => {
    loadNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setError(null);
      const response: NotificationResponse = await getNotifications(1, 20);
      
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
      setLoading(false);
    } catch (error: any) {
      console.error("Error loading notifications:", error);
      
      let errorMessage = "Failed to load notifications";
      
      // Determine specific error type and message
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to view notifications.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Notification service not found. Please contact support.";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Our team has been notified.";
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        errorMessage = "Network connection failed. Please check your internet connection.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setMarkingAsRead(id);
      await markNotificationAsRead(id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      
      let errorMessage = "Failed to mark notification as read";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to update this notification.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Notification not found. It may have been deleted.";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      }
      
      console.warn(errorMessage);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      await markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      
      let errorMessage = "Failed to mark all notifications as read";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to update notifications.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Notification service not found. Please contact support.";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      }
      
      console.warn(errorMessage);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };


  const getTypeIcon = (notification: Notification) => {
    const { type, title, data } = notification;
    
    switch (type) {
      case "contact":
        // Check if it's a status update or new inquiry
        if (title.includes("Status Updated")) {
          return "fas fa-clipboard-check";
        }
        return "fas fa-envelope";
        
      case "portfolio":
        // Check the action in data or title to show specific icons
        if (data?.action === "created" || title.includes("Created")) {
          return "fas fa-plus-circle";
        } else if (data?.action === "updated" || title.includes("Updated")) {
          return "fas fa-edit";
        } else if (data?.action === "deleted" || title.includes("Deleted")) {
          return "fas fa-trash";
        }
        return "fas fa-briefcase";
        
      case "page_visit":
        return "fas fa-chart-line";
        
      case "system":
        return "fas fa-cog";
        
      default:
        return "fas fa-bell";
    }
  };

  if (loading) {
    return (
      <div className="mb-4 sm:mb-6 lg:mb-8 font-montserrat">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-5 sm:h-6 lg:h-8 bg-white rounded-full"></span>
            Notifications
          </h2>
        </div>
        <div className="bg-black border border-gray-700 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
          <div className="text-center py-4 sm:py-6 lg:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-emerald-500 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-300 text-xs sm:text-sm lg:text-base">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6 lg:mb-8 font-['Montserrat']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <span className="w-1 h-5 sm:h-6 lg:h-8 bg-white rounded-full"></span>
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center ml-2">
              {unreadCount} {unreadCount === 1 ? "new" : "new"}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead}
            className={`text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 self-start sm:self-auto px-3 py-1.5 rounded-lg border ${
              markingAllAsRead
                ? "bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500"
            }`}
          >
            {markingAllAsRead ? (
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Marking...
              </span>
            ) : (
              "Mark all as read"
            )}
          </button>
        )}
      </div>

      <div className="bg-black border border-gray-700 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
        {error ? (
          <div className="text-center py-4 sm:py-6 lg:py-8">
            <i className="fas fa-exclamation-triangle text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4 block text-red-400"></i>
            <p className="text-red-400 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">{error}</p>
            <button
              onClick={loadNotifications}
              className="text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-medium transition-colors duration-200 bg-emerald-900/20 hover:bg-emerald-800/20 px-3 py-1.5 rounded-lg border border-emerald-600"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 sm:py-6 lg:py-8">
            <i className="fas fa-bell text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4 block text-gray-400"></i>
            <p className="text-gray-300 text-xs sm:text-sm lg:text-base">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 lg:space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto pr-1 sm:pr-2">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`group relative p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border transition-all duration-200 hover:translate-y-[-1px] sm:hover:translate-y-[-2px] hover:shadow-lg cursor-pointer ${
                  notification.isRead
                    ? "border-gray-700 bg-purple-600/10"
                    : "border-gray-700 bg-gray-900"
                }`}
                onClick={() => !notification.isRead && !markingAsRead && handleMarkAsRead(notification._id)}
              >
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`${getTypeIcon(notification)} text-sm sm:text-base lg:text-lg`}></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 sm:gap-2">
                      <h4
                        className={`font-semibold text-xs sm:text-sm lg:text-base ${
                          notification.isRead ? "text-gray-300" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!markingAsRead) {
                          handleMarkAsRead(notification._id);
                        }
                      }}
                      disabled={markingAsRead === notification._id}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 sm:p-1.5 rounded ${
                        markingAsRead === notification._id
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-400 hover:text-white"
                      }`}
                      title="Mark as read"
                    >
                      {markingAsRead === notification._id ? (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {!notification.isRead && (
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsRow;
