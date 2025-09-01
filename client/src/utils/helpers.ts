// utils/helpers.ts

export const setToken = (token: string) => {
  try {
    localStorage.setItem("admin_token", token);
    console.log("💾 Token saved to localStorage");
  } catch (error) {
    console.error("❌ Failed to save token to localStorage:", error);
  }
};

export const getToken = () => {
  try {
    const token = localStorage.getItem("admin_token");
    console.log("📖 Token retrieved from localStorage:", token ? "Found" : "Not found");
    return token;
  } catch (error) {
    console.error("❌ Failed to get token from localStorage:", error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("admin_token");
    console.log("🗑️ Token removed from localStorage");
  } catch (error) {
    console.error("❌ Failed to remove token from localStorage:", error);
  }
};
