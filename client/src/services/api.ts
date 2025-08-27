import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Contact API functions
export const getContacts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found for contacts request");
      return [];
    }

    const response = await api.get("/contact", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Return the contacts array from the response
    return response.data?.contacts || response.data || [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

export const updateContactStatus = async (id: string, status: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.put(
      `/contact/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
};

export const deleteContact = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.delete(`/contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

// Portfolio API functions
export const getPortfolioItems = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found for portfolio request");
      return [];
    }

    const response = await api.get("/portfolio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Return the portfolio items array from the response
    return response.data || [];
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return [];
  }
};

export const deletePortfolioItem = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.delete(`/portfolio/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    throw error;
  }
};

export const getPortfolioItemById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get(`/portfolio/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    throw error;
  }
};

export const updatePortfolioItem = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.put(`/portfolio/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    throw error;
  }
};

// Page Visit API functions
export const incrementPageVisit = async () => {
  try {
    const response = await api.post("/pagevisit/increment");
    return response.data;
  } catch (error) {
    console.error("Error incrementing page visit:", error);
    // Don't throw error to avoid breaking user experience
    return { success: false, totalVisits: 0 };
  }
};

export const getPageVisitsFromAPI = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found for page visits request");
      return 0;
    }

    const response = await api.get("/pagevisit", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.totalVisits || 0;
  } catch (error) {
    console.error("Error fetching page visits:", error);
    return 0;
  }
};

export const resetPageVisitsAPI = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.delete("/pagevisit/reset", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting page visits:", error);
    throw error;
  }
};

// Notification API functions
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found for notifications request");
      return { notifications: [], pagination: {}, unreadCount: 0 };
    }

    const response = await api.get(`/notifications?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], pagination: {}, unreadCount: 0 };
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.patch(`/notifications/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.patch("/notifications/mark-all-read", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export default api;
