import type {AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig} from "axios";
import axios from "axios";
import { refreshAccessToken } from "@/services/api/auth.ts";
import {
    AuthExpiredError,
    NetworkConnectionError,
    ForbiddenError,
    NotFoundError,
    RateLimitError
} from "@/services/errors/ErrorClasses.ts"
import {tokenManager} from "@/contexts/tokenManager.ts";

// For Make Log on Develop Mode
const logOnDev = (...args: any[]) => {
    if (import.meta.env.MODE === "development") {
        console.log("[AXIOS]", ...args);
    }
};

// promise base for preventing infinite refresh retries
let refreshPromise: Promise<string> | null = null;

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    // getting token from manager
    const token = tokenManager.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    logOnDev("REQUEST:", {
        method: config.method,
        url: config.url,
        headers: config.headers,
    });
    return config;
};

export const responseInterceptor =
    async (response: AxiosResponse) => {
        // just logging , token error - interceptor catch
        logOnDev("RESPONSE:", {
            method: response.config?.method,
            url: response.config?.url,
            status: response.status,
        });
        return response;
    }

export const errorInterceptor =
async (error: AxiosError | Error) => {
    // js failure catch
    if (!axios.isAxiosError(error)) {
        logOnDev("NON-AXIOS ERROR:", error.message);
        return Promise.reject(error);
    }

    const originalRequest = error.config as any;

    // connection / cors / user context (restrictions)
    if (!error.response) {
        if (error.request && error.config?.url?.includes("/users/me")) {
            return Promise.reject(new AuthExpiredError());
        }
        return Promise.reject(new NetworkConnectionError());
    }

    const { method, url } = error.config as AxiosRequestConfig;
    const { status } = error.response as AxiosResponse ?? {};
    logOnDev("API ERROR:", {
        method,
        url,
        status,
        message: error.message,
    });

    switch (status) {
        case 401: {
            if(!originalRequest._retry) {
                console.warn("Already retried once. Failing.");
                tokenManager.setToken(null);
                return Promise.reject(new AuthExpiredError());
            }
            originalRequest._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken()
                        .then((token) => {
                            tokenManager.setToken(token);
                            return token;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }
                const newAccessToken = await refreshPromise;
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return axios(originalRequest);
            } catch (refreshError) {
                console.error("REFRESH FAILED:", refreshError);
                tokenManager.setToken(null);
                return Promise.reject(new AuthExpiredError());
            }
        }
        case 403: {
            //access denied
            return Promise.reject(new ForbiddenError());
        }
        case 404: {
            //invalid request
            return Promise.reject(new NotFoundError());
        }
        case 500: {
            //server error
            return Promise.reject(new NetworkConnectionError());
        }
        case 429: {
            // rate limit over exceeded
            return Promise.reject(new RateLimitError());
        }
    }
    return Promise.reject(error);
}