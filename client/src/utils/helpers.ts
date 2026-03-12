// utils/helpers.ts

export const setToken = (token: string) => {
  localStorage.setItem("admin_token", token);
};

export const getToken = () => {
  return localStorage.getItem("admin_token");
};

export const removeToken = () => {
  localStorage.removeItem("admin_token");
};

/**
 * Resolves a media URL (thumbnail/video) to a full URL.
 * Handles both legacy absolute URLs and new relative paths.
 * For relative paths, prepends the server base URL derived from VITE_API_BASE_URL.
 */
export const getMediaUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${path.startsWith("/") ? "" : "/"}${path}`;
};
