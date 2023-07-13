import axios from "axios";
import { useUserStore } from "@/store/user";

let userStore: ReturnType<typeof useUserStore> | null = null;

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  userStore = userStore ?? useUserStore();
  if (userStore.auth.key && userStore.auth.key.trim() !== "") {
    config.headers.Authorization = `Bearer ${userStore.auth.key}`;
  }
  return config;
});

export default request;

/**
 * useFetch(Post)
 * Just for stream api
 */
export const useFetch = (url: string, data?: any) => {
  userStore = userStore ?? useUserStore();
  const baseURL = import.meta.env.VITE_BASE_URL;
  if (url.startsWith("/")) url = baseURL + url;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userStore.auth.key}`,
    },
  })
};
