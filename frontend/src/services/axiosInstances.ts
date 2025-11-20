import axios from "axios";
import {requestInterceptor, responseInterceptor, errorInterceptor} from "./axiosInterceptors.ts";

//for non-registered users operations
export const defaultAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    //timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

//for operations which require token
export const privateAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    //timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

privateAxiosInstance.interceptors.request.use(requestInterceptor, errorInterceptor);
privateAxiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);
// adding error processing to the default interceptor
defaultAxiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);