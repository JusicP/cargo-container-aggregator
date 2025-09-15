import {privateAxiosInstance} from "./axiosInstances.ts";
import type {AxiosError, InternalAxiosRequestConfig, AxiosResponse} from "axios";

privateAxiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        //temporary, waiting for backend implementation of refresh token
        const accessToken = sessionStorage.getItem("accessToken")
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    }, async (error: AxiosError) => {
        return Promise.reject(error);
    }
)

privateAxiosInstance.interceptors.response.use(
    async (config: AxiosResponse) => {
        return config;
    }, async (error: AxiosError) => {
        if (error.response?.status === 401) {
            //call refresh
        }
    }
)