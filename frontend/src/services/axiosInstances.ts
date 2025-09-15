import axios from "axios";

export const defaultAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const privateAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});