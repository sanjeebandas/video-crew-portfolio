// src/services/upload.ts
import api from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: No token found");

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/image", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadVideo = async (file: File): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: No token found");

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/video", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Video upload failed:", error);
    throw error;
  }
};
