import { useState, useEffect } from "react";
import { getContacts, getPortfolioItems } from "../../services/api";

interface Notification {
  id: string;
  type: 'contact' | 'portfolio' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon: string;
  data?: any; // Additional data for the notification
}

const NotificationsRow = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Set up real-time updates (you can replace this with WebSocket or polling)
    const interval = setInterval(loadNotifications, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // Load existing notifications from localStorage
      const storedNotifications = localStorage.getItem('notifications');
      let existingNotifications: Notification[] = storedNotifications 
        ? JSON.parse(storedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        : [];

      // Fetch current data to compare
      let currentContacts = [];
      let currentPortfolioItems = [];
      
      try {
        const [contactsResponse, portfolioResponse] = await Promise.all([
          getContacts(),
          getPortfolioItems()
        ]);
        
        // Ensure we have arrays
        currentContacts = Array.isArray(contactsResponse) ? contactsResponse : [];
        currentPortfolioItems = Array.isArray(portfolioResponse) ? portfolioResponse : [];
      } catch (error) {
        console.warn('Failed to fetch data for notifications, using existing data:', error);
        // Use existing data from localStorage if API calls fail
        const existingData = localStorage.getItem('previousData');
        if (existingData) {
          const parsed = JSON.parse(existingData);
          currentContacts = Array.isArray(parsed.contacts) ? parsed.contacts : [];
          currentPortfolioItems = Array.isArray(parsed.portfolioItems) ? parsed.portfolioItems : [];
        }
      }

      // Get previous data for comparison
      const previousData = localStorage.getItem('previousData');
      const previous = previousData ? JSON.parse(previousData) : {
        contacts: [],
        portfolioItems: []
      };

      const newNotifications: Notification[] = [];

      // Check for new contacts
      const newContacts = currentContacts.filter((contact: any) => 
        !previous.contacts.find((prev: any) => prev._id === contact._id)
      );

      newContacts.forEach((contact: any) => {
        newNotifications.push({
          id: `contact-${contact._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'contact',
          title: 'New Contact Inquiry',
          message: `${contact.name || 'Someone'} sent a message about ${contact.subject || 'video production services'}`,
          timestamp: new Date(contact.createdAt || Date.now()),
          isRead: false,
          icon: '📬',
          data: contact
        });
      });

      // Check for new portfolio items - improved detection
      const newPortfolioItems = currentPortfolioItems.filter((item: any) => {
        // Check if this item exists in previous data
        const existsInPrevious = previous.portfolioItems.find((prev: any) => 
          prev._id === item._id || 
          (prev.title === item.title && prev.createdAt === item.createdAt) ||
          (prev.title === item.title && Math.abs(new Date(prev.createdAt).getTime() - new Date(item.createdAt).getTime()) < 60000) // Within 1 minute
        );
        return !existsInPrevious;
      });

      newPortfolioItems.forEach((item: any) => {
        newNotifications.push({
          id: `portfolio-${item._id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'portfolio',
          title: 'Portfolio Item Created',
          message: `New project "${item.title || 'Untitled Project'}" has been added to portfolio`,
          timestamp: new Date(item.createdAt || Date.now()),
          isRead: false,
          icon: '🎯',
          data: item
        });
      });

      // Add system notifications for dashboard updates
      const lastSystemCheck = localStorage.getItem('lastSystemCheck');
      const now = Date.now();
      if (!lastSystemCheck || (now - parseInt(lastSystemCheck)) > 3600000) { // 1 hour
        newNotifications.push({
          id: `system-${now}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'system',
          title: 'Dashboard Updated',
          message: 'Analytics and system data have been refreshed',
          timestamp: new Date(now),
          isRead: false,
          icon: '⚙️'
        });
        localStorage.setItem('lastSystemCheck', now.toString());
      }

      // Combine and sort notifications
      const allNotifications = [...newNotifications, ...existingNotifications]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 50); // Keep only last 50 notifications

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.isRead).length);

      // Store updated notifications
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
      localStorage.setItem('previousData', JSON.stringify({
        contacts: currentContacts,
        portfolioItems: currentPortfolioItems
      }));

    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to mock data if API fails
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'contact',
          title: 'New Contact Inquiry',
          message: 'John Doe sent a message about video production services',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: false,
          icon: '📬'
        },
        {
          id: '2',
          type: 'portfolio',
          title: 'Portfolio Item Created',
          message: 'New project "Corporate Brand Video" has been added to portfolio',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: false,
          icon: '🎯'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    }
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, isRead: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Function to add a manual notification (for testing or real-world triggers)
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${notification.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50);
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Function to add portfolio item notification
  const addPortfolioNotification = (portfolioItem: any) => {
    addNotification({
      type: 'portfolio',
      title: 'Portfolio Item Created',
      message: `New project "${portfolioItem.title || 'Untitled Project'}" has been added to portfolio`,
      icon: '🎯',
      data: portfolioItem
    });
  };

  // Expose the functions globally for use in other components
  if (typeof window !== 'undefined') {
    (window as any).addNotification = addNotification;
    (window as any).addPortfolioNotification = addPortfolioNotification;
    (window as any).refreshNotifications = loadNotifications;
    
    // Test function to manually trigger a portfolio notification
    (window as any).testPortfolioNotification = () => {
      addPortfolioNotification({
        title: 'Test Portfolio Item',
        description: 'This is a test portfolio item',
        category: 'Test Category',
        createdAt: new Date().toISOString()
      });
    };
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact': return 'border-purple-500/20 bg-purple-600/10';
      case 'portfolio': return 'border-emerald-500/20 bg-emerald-600/10';
      case 'system': return 'border-blue-500/20 bg-blue-600/10';
      default: return 'border-slate-500/20 bg-slate-600/10';
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></span>
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 self-start sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
         {notifications.length === 0 ? (
           <div className="text-center py-6 sm:py-8">
             <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">🔔</span>
             <p className="text-slate-400 text-sm sm:text-base">No notifications yet</p>
           </div>
         ) : (
           <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
             {notifications.map((notification) => (
               <div
                 key={notification.id}
                 className={`group relative p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg ${
                   notification.isRead 
                     ? 'border-slate-600/30 bg-slate-700/20' 
                     : `border-l-4 border-l-emerald-500 ${getTypeColor(notification.type)}`
                 }`}
               >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">{notification.icon}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-xs sm:text-sm ${
                        notification.isRead ? 'text-slate-300' : 'text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-white"
                      title="Mark as read"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {!notification.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full"></div>
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
