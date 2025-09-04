import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getContacts, updateContactStatus, deleteContact } from "../services/api";
import AdminNavbar from "../components/admin/AdminNavbar";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget?: string;
  preferredDate?: string;
  service?: string;
  subject: string;
  message: string;
  status?: "new" | "processing" | "completed";
  adminNotes?: string;
  referenceVideos?: string;
  websiteLinks?: string;
  productionPurpose?: string;
  uploadPlatform?: string;
  videoCount?: string;
  runningTime?: string;
  createdAt: string;
};

type ErrorState = {
  message: string;
  type: 'fetch' | 'update' | 'delete' | 'network' | 'unknown';
  retryable: boolean;
};

const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (error?.type === 'network') {
        setError(null);
        fetchContacts(); // Auto-retry when coming back online
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

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const fetchContacts = useCallback(async (isRetry: boolean = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
      }

      const contacts = await getContacts();
      if (Array.isArray(contacts)) {
        // Remove duplicates based on _id
        const uniqueContacts = contacts.filter((contact, index, self) => 
          index === self.findIndex(c => c._id === contact._id)
        );
        setContacts(uniqueContacts);
        setRetryCount(0); // Reset retry count on success
      } else {
        console.error("Contacts data is not an array:", contacts);
        setContacts([]);
        setError({
          message: "Invalid data format received from server. Please contact support.",
          type: 'fetch',
          retryable: true
        });
      }
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      
      let errorMessage = "Failed to fetch contacts.";
      let errorType: ErrorState['type'] = 'fetch';
      let retryable = true;

      // Determine specific error type and message
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        errorType = 'fetch';
        retryable = false;
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to view contacts.";
        errorType = 'fetch';
        retryable = false;
      } else if (error?.response?.status === 404) {
        errorMessage = "Contact service not found. Please contact support.";
        errorType = 'fetch';
        retryable = true;
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Our team has been notified.";
        errorType = 'fetch';
        retryable = true;
      } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
        errorMessage = "Network connection failed. Please check your internet connection.";
        errorType = 'network';
        retryable = true;
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
        errorType = 'fetch';
        retryable = true;
      }

      setError({
        message: errorMessage,
        type: errorType,
        retryable
      });

      // Auto-retry for retryable errors
      if (retryable && retryCount < MAX_RETRIES) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        if (newRetryCount <= MAX_RETRIES) {
          setIsRetrying(true);
          toast.error(`Retrying... (${newRetryCount}/${MAX_RETRIES})`, { id: 'refresh-contacts' });
          
          setTimeout(() => {
            fetchContacts(true);
          }, RETRY_DELAY * newRetryCount);
        }
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [retryCount]);

  const updateStatus = async (id: string, newStatus: Contact["status"]) => {
    if (!newStatus) return;
    
    try {
      setUpdatingId(id);
      await updateContactStatus(id, newStatus);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      toast.success("✅ Inquiry status updated successfully!");
    } catch (error: any) {
      console.error("Update status error:", error);
      
      let errorMessage = "Failed to update status.";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to update this inquiry.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Inquiry not found. It may have been deleted.";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      }
      
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteContactHandler = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inquiry? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("🗑️ Inquiry deleted successfully!");
    } catch (error: any) {
      console.error("Delete error:", error);
      
      let errorMessage = "Failed to delete inquiry.";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to delete this inquiry.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Inquiry not found. It may have been already deleted.";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      }
      
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = contacts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedIds([]); // Close all expanded items when changing pages
  };

  // Error boundary fallback - prevent dashboard crashes
  if (error && !error.retryable && retryCount >= MAX_RETRIES) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen">
        <AdminNavbar />
        <div className="md:ml-64 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">VC</span>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">Video Crew</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                Contact Inquiries
              </h1>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
              <div className="text-red-400 mb-4">
                <span className="text-2xl">⚠️</span>
                <p className="mt-2">Contact Manager is temporarily unavailable</p>
              </div>
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  {error.message}
                </p>
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                    fetchContacts();
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

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen">
      {/* AdminNavbar */}
      <AdminNavbar />
      
      {/* Main Content */}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  Contact Inquiries
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                  Manage and respond to customer inquiries
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
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    toast.loading("Refreshing contacts...", { id: 'refresh-contacts' });
                    fetchContacts().finally(() => {
                      toast.success("Contacts refreshed!", { id: 'refresh-contacts' });
                    });
                  }}
                  disabled={loading || isRetrying}
                  className="group bg-blue-600/50 hover:bg-blue-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-blue-600/50 hover:border-blue-500/50 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Refresh contacts"
                >
                  <span>{loading || isRetrying ? "⏳" : "🔄"}</span>
                  <span className="hidden sm:inline">
                    {loading || isRetrying ? "Refreshing..." : "Refresh"}
                  </span>
                  <span className="sm:hidden">
                    {loading || isRetrying ? "Refreshing..." : "Refresh"}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="group bg-slate-700/50 hover:bg-slate-600/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 flex items-center gap-1 sm:gap-2"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="group bg-red-600/50 hover:bg-red-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-red-600/50 hover:border-red-500/50 flex items-center gap-1 sm:gap-2"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading && !isRetrying ? (
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-slate-400">Loading contacts...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-sm border border-red-700/50 rounded-xl sm:rounded-2xl p-6">
              <p className="text-red-400 text-center">{error.message}</p>
              {error.retryable && (
                <button
                  onClick={() => fetchContacts()}
                  className="mt-4 px-4 py-2 bg-red-600/50 hover:bg-red-500/50 text-white rounded-lg text-sm transition-all duration-200"
                >
                  Retry
                </button>
              )}
              {isOffline && (
                <p className="mt-2 text-red-400 text-sm">
                  You are currently offline. Please check your connection.
                </p>
              )}
            </div>
          ) : !Array.isArray(contacts) || contacts.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-6">
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📬</span>
                <p className="text-slate-400 text-sm sm:text-base">No contact submissions found.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Contacts List */}
              <div className="space-y-4 sm:space-y-6 mb-6">
                {currentContacts.map((contact, index) => {
                  const isExpanded = expandedIds.includes(contact._id);
                  const uniqueKey = contact._id || `contact-${index}-${Date.now()}`;
                  const isNew = contact.status === "new" || !contact.status;
                  
                  return (
                    <div
                      key={uniqueKey}
                      className={`bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm border rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/20 ${
                        isNew 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : 'border-slate-600/30'
                      }`}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                                {contact.name}
                              </h2>
                              {isNew && (
                                <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full font-medium">
                                  New
                                </span>
                              )}
                              {contact.status === "processing" && (
                                <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full font-medium">
                                  Processing
                                </span>
                              )}
                              {contact.status === "completed" && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm mb-1">{contact.email}</p>
                            <p className="text-slate-400 text-xs">
                              {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} at {new Date(contact.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                            <select
                              value={contact.status || "new"}
                              onChange={(e) =>
                                updateStatus(
                                  contact._id,
                                  e.target.value as Contact["status"]
                                )
                              }
                              className="border border-slate-600/50 rounded-lg px-3 py-2 bg-slate-800/50 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              disabled={updatingId === contact._id || isOffline}
                            >
                              <option value="new">New</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                            </select>

                            <button
                              onClick={() => toggleExpand(contact._id)}
                              className="px-3 py-2 text-sm rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
                              disabled={isOffline}
                            >
                              {isExpanded ? "Hide Details" : "View Details"}
                            </button>
                          </div>
                        </div>

                        {/* Loading indicator for status update */}
                        {updatingId === contact._id && (
                          <div className="mt-2 flex items-center gap-2 text-blue-400 text-xs">
                            <span className="animate-spin">⏳</span>
                            <span>Updating status...</span>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-600/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              {/* Basic Information */}
                              <div>
                                <strong className="text-slate-300">Phone:</strong>
                                <p className="text-slate-400 mt-1">{contact.phone || "Not provided"}</p>
                              </div>
                              <div>
                                <strong className="text-slate-300">Company:</strong>
                                <p className="text-slate-400 mt-1">{contact.company || "Not provided"}</p>
                              </div>
                              <div>
                                <strong className="text-slate-300">Budget:</strong>
                                <p className="text-slate-400 mt-1">
                                  {contact.budget 
                                    ? `${contact.budget} million won` 
                                    : "Not specified"
                                  }
                                </p>
                              </div>
                              <div>
                                <strong className="text-slate-300">Preferred Date:</strong>
                                <p className="text-slate-400 mt-1">{contact.preferredDate || "Not specified"}</p>
                              </div>
                              <div>
                                <strong className="text-slate-300">Production Purpose:</strong>
                                <p className="text-slate-400 mt-1">{contact.productionPurpose || contact.service || "Not specified"}</p>
                              </div>
                              
                              {/* Project Details from Subject */}
                              {(() => {
                                const subjectParts = contact.subject.split(' • ');
                                const videoCount = subjectParts[0]?.replace(' Videos', '') || 'Not specified';
                                const runningTime = subjectParts[1]?.replace(' Runtime', '') || 'Not specified';
                                const platform = subjectParts[2]?.replace('Platform: ', '') || 'Not specified';
                                
                                return (
                                  <>
                                    <div>
                                      <strong className="text-slate-300">Video Count:</strong>
                                      <p className="text-slate-400 mt-1">{videoCount}</p>
                                    </div>
                                    <div>
                                      <strong className="text-slate-300">Running Time:</strong>
                                      <p className="text-slate-400 mt-1">{runningTime}</p>
                                    </div>
                                    <div>
                                      <strong className="text-slate-300">Upload Platform:</strong>
                                      <p className="text-slate-400 mt-1">{platform}</p>
                                    </div>
                                  </>
                                );
                              })()}
                              
                              {/* Reference Materials */}
                              <div className="sm:col-span-2">
                                <strong className="text-slate-300">Reference Videos:</strong>
                                <p className="text-slate-400 mt-1 break-words">
                                  {contact.referenceVideos ? (
                                    <a 
                                      href={contact.referenceVideos} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                      {contact.referenceVideos}
                                    </a>
                                  ) : (
                                    "Not provided"
                                  )}
                                </p>
                              </div>
                              <div className="sm:col-span-2">
                                <strong className="text-slate-300">Website Links:</strong>
                                <p className="text-slate-400 mt-1 break-words">
                                  {contact.websiteLinks ? (
                                    <a 
                                      href={contact.websiteLinks} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                      {contact.websiteLinks}
                                    </a>
                                  ) : (
                                    "Not provided"
                                  )}
                                </p>
                              </div>
                              
                                                           </div>
                            <div className="mt-4 pt-4 border-t border-slate-600/30">
                              <button
                                onClick={() => deleteContactHandler(contact._id)}
                                className={`text-red-400 hover:text-red-300 font-medium transition-colors duration-200 ${
                                  deletingId === contact._id
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                                disabled={isOffline || deletingId === contact._id}
                              >
                                {deletingId === contact._id ? (
                                  <span className="flex items-center gap-1">
                                    <span className="animate-spin">⏳</span>
                                    Deleting...
                                  </span>
                                ) : (
                                  "🗑️ Delete Inquiry"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 border ${
                          currentPage === page
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-slate-700/50 hover:bg-slate-600/50 text-white border-slate-600/50 hover:border-slate-500/50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Summary */}
              <div className="mt-6 text-center text-slate-400 text-sm">
                Showing {startIndex + 1} to {Math.min(endIndex, contacts.length)} of {contacts.length} inquiries
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
