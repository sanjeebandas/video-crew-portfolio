import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ Important!
});

export const login = (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};
